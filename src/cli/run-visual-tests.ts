// ============================================================================
// File: src/cli/run-visual-tests.ts
// ============================================================================

import { VisualTester } from '../core/visual.tester';
import { VisualTestConfig, ComparisonMode } from '../types/visual-regression.types';
import { Logger } from '../utils/logger.utils';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TEST CONFIGURATIONS
// ============================================================================

const testConfigs: VisualTestConfig[] = [
  // Desktop Tests
  {
    name: 'homepage-desktop',
    url: 'https://example.com',
    fullPage: true,
    threshold: 0.1,
    viewport: {
      width: 1920,
      height: 1080
    }
  },
  {
    name: 'about-page-desktop',
    url: 'https://example.com/about',
    fullPage: true,
    threshold: 0.1,
    waitForSelector: 'main',
    viewport: {
      width: 1920,
      height: 1080
    }
  },
  {
    name: 'products-page-desktop',
    url: 'https://example.com/products',
    fullPage: true,
    waitForSelector: '.product-list',
    threshold: 0.15,
    viewport: {
      width: 1920,
      height: 1080
    }
  },
  {
    name: 'contact-page-desktop',
    url: 'https://example.com/contact',
    fullPage: true,
    waitForSelector: 'form',
    threshold: 0.1,
    viewport: {
      width: 1920,
      height: 1080
    }
  },

  // Tablet Tests
  {
    name: 'homepage-tablet',
    url: 'https://example.com',
    fullPage: true,
    threshold: 0.15,
    viewport: {
      width: 768,
      height: 1024
    }
  },
  {
    name: 'products-page-tablet',
    url: 'https://example.com/products',
    fullPage: true,
    waitForSelector: '.product-list',
    threshold: 0.15,
    viewport: {
      width: 768,
      height: 1024
    }
  },

  // Mobile Tests
  {
    name: 'homepage-mobile',
    url: 'https://example.com',
    fullPage: true,
    threshold: 0.2,
    viewport: {
      width: 375,
      height: 667
    }
  },
  {
    name: 'products-page-mobile',
    url: 'https://example.com/products',
    fullPage: true,
    waitForSelector: '.product-list',
    threshold: 0.2,
    viewport: {
      width: 375,
      height: 667
    }
  },

  // Specific Component Tests
  {
    name: 'header-navigation',
    url: 'https://example.com',
    fullPage: false,
    waitForSelector: 'header',
    threshold: 0.1,
    viewport: {
      width: 1920,
      height: 1080
    }
  },

  // Tests with Ignored Regions (for dynamic content)
  {
    name: 'homepage-no-dynamic-ads',
    url: 'https://example.com',
    fullPage: true,
    threshold: 0.1,
    viewport: {
      width: 1920,
      height: 1080
    },
    ignoreRegions: [
      // Ignore top banner ad
      { x: 0, y: 0, width: 300, height: 250 },
      // Ignore sidebar ad
      { x: 1620, y: 500, width: 300, height: 600 },
      // Ignore timestamp/date footer
      { x: 0, y: 2800, width: 1920, height: 100 }
    ]
  }
];

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

interface CliOptions {
  mode: ComparisonMode;
  config?: string;
  filter?: string;
  verbose?: boolean;
  help?: boolean;
}

function parseArguments(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    mode: 'test',
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;

      case '-m':
      case '--mode':
        const mode = args[++i] as ComparisonMode;
        if (['test', 'update', 'compare'].includes(mode)) {
          options.mode = mode;
        } else {
          Logger.error(`Invalid mode: ${mode}. Use: test, update, or compare`);
          process.exit(1);
        }
        break;

      case '-c':
      case '--config':
        options.config = args[++i];
        break;

      case '-f':
      case '--filter':
        options.filter = args[++i];
        break;

      case '-v':
      case '--verbose':
        options.verbose = true;
        break;

      default:
        // If no flag, assume it's the mode
        if (['test', 'update', 'compare'].includes(arg as ComparisonMode)) {
          options.mode = arg as ComparisonMode;
        }
        break;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║                 Visual Regression Testing Framework                      ║
╚══════════════════════════════════════════════════════════════════════════╝

USAGE:
  npm run test:run [mode] [options]
  ts-node src/cli/run-visual-tests.ts [mode] [options]

MODES:
  test       Run visual tests and compare with baselines (default)
             Creates new baselines if they don't exist
  
  update     Update all baseline images with new screenshots
             Use this when you've made intentional design changes
  
  compare    Compare with existing baselines only
             Fails if baseline doesn't exist (no auto-creation)

OPTIONS:
  -m, --mode <mode>        Set the test mode (test|update|compare)
  -c, --config <path>      Load test configs from external file
  -f, --filter <pattern>   Run only tests matching the pattern
  -v, --verbose            Enable verbose logging
  -h, --help               Show this help message

EXAMPLES:
  # Run all tests in test mode (default)
  npm run test:run

  # Update all baseline images
  npm run test:run update
  npm run test:run --mode update

  # Run only mobile tests
  npm run test:run --filter mobile

  # Run specific test pattern
  npm run test:run --filter "homepage"

  # Load custom config file
  npm run test:run --config ./custom-tests.json

  # Compare mode with verbose output
  npm run test:run compare --verbose

PROJECT STRUCTURE:
  visual-tests/
  ├── baseline/     Baseline images (committed to git)
  ├── current/      Current screenshots (temporary)
  ├── diff/         Difference images (temporary)
  └── reports/      HTML reports

ENVIRONMENT VARIABLES:
  VRT_MODE          Set default mode (test|update|compare)
  VRT_THRESHOLD     Set default threshold (0-100)
  VRT_VIEWPORT      Set default viewport (e.g., 1920x1080)

For more information, visit: https://github.com/your-repo/visual-regression-framework
`);
}

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================

function loadExternalConfig(configPath: string): VisualTestConfig[] {
  try {
    const absolutePath = path.resolve(configPath);
    
    if (!fs.existsSync(absolutePath)) {
      Logger.error(`Config file not found: ${absolutePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const configs = JSON.parse(fileContent);

    if (!Array.isArray(configs)) {
      Logger.error('Config file must export an array of test configurations');
      process.exit(1);
    }

    Logger.info(`Loaded ${configs.length} test configurations from ${configPath}`);
    return configs;
  } catch (error) {
    Logger.error(`Failed to load config file: ${error}`);
    process.exit(1);
  }
}

function filterConfigs(configs: VisualTestConfig[], pattern?: string): VisualTestConfig[] {
  if (!pattern) {
    return configs;
  }

  const filtered = configs.filter(config => 
    config.name.toLowerCase().includes(pattern.toLowerCase()) ||
    config.url.toLowerCase().includes(pattern.toLowerCase())
  );

  if (filtered.length === 0) {
    Logger.warning(`No tests match filter pattern: "${pattern}"`);
  } else {
    Logger.info(`Filtered to ${filtered.length} test(s) matching: "${pattern}"`);
  }

  return filtered;
}

// ============================================================================
// ENVIRONMENT VARIABLE OVERRIDES
// ============================================================================

function applyEnvironmentOverrides(configs: VisualTestConfig[]): VisualTestConfig[] {
  const threshold = process.env.VRT_THRESHOLD;
  const viewport = process.env.VRT_VIEWPORT;

  if (threshold) {
    const thresholdValue = parseFloat(threshold);
    if (!isNaN(thresholdValue) && thresholdValue >= 0 && thresholdValue <= 100) {
      Logger.info(`Applying environment threshold: ${thresholdValue}%`);
      configs.forEach(config => {
        config.threshold = thresholdValue;
      });
    }
  }

  if (viewport) {
    const match = viewport.match(/^(\d+)x(\d+)$/);
    if (match) {
      const width = parseInt(match[1]);
      const height = parseInt(match[2]);
      Logger.info(`Applying environment viewport: ${width}x${height}`);
      configs.forEach(config => {
        config.viewport = { width, height };
      });
    }
  }

  return configs;
}

// ============================================================================
// STATISTICS AND REPORTING
// ============================================================================

function printStatistics(configs: VisualTestConfig[]): void {
  const viewportCounts = configs.reduce((acc, config) => {
    const key = config.viewport 
      ? `${config.viewport.width}x${config.viewport.height}`
      : 'default';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Logger.section('📋 TEST CONFIGURATION');
  console.log(`Total Tests:     ${configs.length}`);
  console.log(`\nViewport Distribution:`);
  Object.entries(viewportCounts).forEach(([viewport, count]) => {
    console.log(`  ${viewport}: ${count} test(s)`);
  });

  const withWaitSelector = configs.filter(c => c.waitForSelector).length;
  const fullPage = configs.filter(c => c.fullPage).length;
  const withIgnoreRegions = configs.filter(c => c.ignoreRegions && c.ignoreRegions.length > 0).length;

  console.log(`\nFeatures:`);
  console.log(`  Full Page Captures:  ${fullPage}`);
  console.log(`  Wait Selectors:      ${withWaitSelector}`);
  console.log(`  Ignore Regions:      ${withIgnoreRegions}`);
  console.log('');
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateConfigs(configs: VisualTestConfig[]): void {
  const errors: string[] = [];
  const names = new Set<string>();

  configs.forEach((config, index) => {
    // Check for duplicate names
    if (names.has(config.name)) {
      errors.push(`Duplicate test name: "${config.name}"`);
    }
    names.add(config.name);

    // Validate URL
    try {
      new URL(config.url);
    } catch {
      errors.push(`Invalid URL in test "${config.name}": ${config.url}`);
    }

    // Validate threshold
    if (config.threshold !== undefined) {
      if (config.threshold < 0 || config.threshold > 100) {
        errors.push(`Invalid threshold in test "${config.name}": ${config.threshold}. Must be 0-100`);
      }
    }

    // Validate viewport
    if (config.viewport) {
      if (config.viewport.width <= 0 || config.viewport.height <= 0) {
        errors.push(`Invalid viewport in test "${config.name}"`);
      }
    }

    // Validate ignore regions
    if (config.ignoreRegions) {
      config.ignoreRegions.forEach((region, idx) => {
        if (region.width <= 0 || region.height <= 0 || region.x < 0 || region.y < 0) {
          errors.push(`Invalid ignore region ${idx} in test "${config.name}"`);
        }
      });
    }
  });

  if (errors.length > 0) {
    Logger.error('Configuration validation failed:');
    errors.forEach(error => console.log(`  ❌ ${error}`));
    process.exit(1);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main(): Promise<void> {
  const options = parseArguments();

  // Show help and exit
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Load test configurations
  let configs = options.config 
    ? loadExternalConfig(options.config)
    : testConfigs;

  // Apply environment overrides
  configs = applyEnvironmentOverrides(configs);

  // Filter tests if pattern provided
  configs = filterConfigs(configs, options.filter);

  // Exit if no tests to run
  if (configs.length === 0) {
    Logger.error('No tests to run!');
    process.exit(1);
  }

  // Validate configurations
  validateConfigs(configs);

  // Print statistics
  if (options.verbose) {
    printStatistics(configs);
  }

  // Override mode from environment if set
  const mode = (process.env.VRT_MODE as ComparisonMode) || options.mode;

  // Initialize tester
  const tester = new VisualTester();

  try {
    // Run the tests
    const startTime = Date.now();
    const result = await tester.runTests(configs, mode);
    const duration = Date.now() - startTime;

    // Print final summary
    Logger.section('🎯 FINAL RESULTS');
    
    const successRate = result.total > 0 
      ? ((result.passed / result.total) * 100).toFixed(1)
      : '0.0';

    console.log(`Success Rate:   ${successRate}%`);
    console.log(`Duration:       ${(duration / 1000).toFixed(2)}s`);
    console.log(`Average/Test:   ${(duration / result.total).toFixed(0)}ms`);
    console.log('');

    // Exit with appropriate code
    if (result.failed > 0) {
      Logger.error(`${result.failed} test(s) failed! 💥`);
      Logger.info('Review the HTML report for details.');
      process.exit(1);
    }

    if (result.new > 0) {
      Logger.success(`${result.new} new baseline(s) created! 📸`);
    }
    
    Logger.success('All tests passed! ✨');
    process.exit(0);

  } catch (error) {
    Logger.error(`Test execution failed: ${error}`);
    if (options.verbose && error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection at:');
  console.error(promise);
  console.error('Reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  Logger.warning('\nReceived SIGINT, shutting down gracefully...');
  process.exit(130);
});

process.on('SIGTERM', () => {
  Logger.warning('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(143);
});

// ============================================================================
// EXECUTION
// ============================================================================

// Run the main function
main();

// ============================================================================
// EXAMPLE EXTERNAL CONFIG FILE (save as tests-config.json)
// ============================================================================

/*
[
  {
    "name": "homepage-desktop",
    "url": "https://example.com",
    "fullPage": true,
    "threshold": 0.1,
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  },
  {
    "name": "products-mobile",
    "url": "https://example.com/products",
    "fullPage": true,
    "threshold": 0.2,
    "viewport": {
      "width": 375,
      "height": 667
    },
    "waitForSelector": ".product-list",
    "waitForTimeout": 2000
  },
  {
    "name": "checkout-page",
    "url": "https://example.com/checkout",
    "fullPage": true,
    "threshold": 0.15,
    "viewport": {
      "width": 1920,
      "height": 1080
    },
    "ignoreRegions": [
      {
        "x": 0,
        "y": 0,
        "width": 300,
        "height": 250
      }
    ]
  }
]
*/