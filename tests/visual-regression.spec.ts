// ============================================================================
// File: tests/visual-regression.spec.ts
// ============================================================================

import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester';
import { VisualTestConfig } from '../src/types/visual-regression.types';

/**
 * Visual Regression Test Suite
 * 
 * This file contains Playwright tests for visual regression testing.
 * Simply add your URLs below with configuration options.
 */

// ============================================================================
// YOUR TEST CONFIGURATIONS - ADD YOUR URLS HERE
// ============================================================================

const urlsToTest: VisualTestConfig[] = [
  // Example 1: Basic homepage test
  {
    name: 'ap-homepage',
    url: 'https://www.authoritypartners.com',
    fullPage: true,
    threshold: 0.1
  },

  // Example 2: Page with custom viewport (mobile)
  {
    name: 'ap-homepage-mobile',
    url: 'https://www.authoritypartners.com',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.2
  },

  // Example 3: Page that waits for specific element
  {
    name: 'ap-services-page',
    url: 'https://authoritypartners.com/services/',
    //waitForSelector: '.products-grid',  // Wait for this element to load
    fullPage: true,
    threshold: 0.15
  },

  // Example 4: Page with ignored dynamic regions
  {
    name: 'homepage-no-ads',
    url: 'https://www.authoritypartners.com',
    fullPage: true,
    threshold: 0.1,
    ignoreRegions: [
      // Ignore ad banner at top
      { x: 0, y: 0, width: 300, height: 250 },
      // Ignore sidebar ads
      { x: 1000, y: 500, width: 300, height: 600 }
    ]
  },

  // Example 5: Viewport-only screenshot (not full page)
  {
    name: 'above-the-fold',
    url: 'https://www.authoritypartners.com/about/',
    fullPage: false,  // Only capture visible viewport
    viewport: {
      width: 1920,
      height: 1080
    },
    threshold: 0.1
  },

  // Example 6: Page with additional wait time
  {
    name: 'dashboard',
    url: 'https://authoritypartners.com/',
    //waitForSelector: '.chart-container',
    waitForTimeout: 3000,  // Wait additional 3 seconds for animations
    fullPage: true,
    threshold: 0.2
  }
];

// ============================================================================
// QUICK ADD TEMPLATES
// ============================================================================

// TEMPLATE 1: Desktop Page
/*
{
  name: 'page-name-desktop',
  url: 'https://your-site.com/page',
  fullPage: true,
  threshold: 0.1
}
*/

// TEMPLATE 2: Mobile Page
/*
{
  name: 'page-name-mobile',
  url: 'https://your-site.com/page',
  viewport: { width: 375, height: 667 },
  fullPage: true,
  threshold: 0.2
}
*/

// TEMPLATE 3: Tablet Page
/*
{
  name: 'page-name-tablet',
  url: 'https://your-site.com/page',
  viewport: { width: 768, height: 1024 },
  fullPage: true,
  threshold: 0.15
}
*/

// TEMPLATE 4: Page with Wait
/*
{
  name: 'page-name',
  url: 'https://your-site.com/page',
  waitForSelector: '.main-content',
  waitForTimeout: 2000,
  fullPage: true,
  threshold: 0.1
}
*/

// TEMPLATE 5: Page with Ignored Regions
/*
{
  name: 'page-name-no-dynamic',
  url: 'https://your-site.com/page',
  fullPage: true,
  threshold: 0.1,
  ignoreRegions: [
    { x: 0, y: 0, width: 300, height: 250 }
  ]
}
*/

// ============================================================================
// TEST SUITE
// ============================================================================

test.describe('Visual Regression Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should run visual regression tests for all configured URLs', async () => {
    const result = await tester.runTests(urlsToTest, 'test');
    
    // Assert all tests passed (or were new baselines)
    expect(result.failed).toBe(0);
    expect(result.passed + result.new).toBe(result.total);
  });
});

// ============================================================================
// INDIVIDUAL URL TESTS (Optional - for parallel execution)
// ============================================================================

test.describe('Individual Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  // Generate individual test for each URL
  urlsToTest.forEach((config) => {
    test(`Visual test: ${config.name}`, async () => {
      const result = await tester.runTests([config], 'test');
      
      expect(result.failed).toBe(0);
    });
  });
});

// ============================================================================
// GROUPED TESTS BY DEVICE TYPE
// ============================================================================

test.describe('Desktop Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should pass all desktop viewport tests', async () => {
    const desktopTests = urlsToTest.filter(
      config => !config.viewport || config.viewport.width >= 1024
    );

    if (desktopTests.length === 0) {
      test.skip();
      return;
    }

    const result = await tester.runTests(desktopTests, 'test');
    expect(result.failed).toBe(0);
  });
});

test.describe('Mobile Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should pass all mobile viewport tests', async () => {
    const mobileTests = urlsToTest.filter(
      config => config.viewport && config.viewport.width < 768
    );

    if (mobileTests.length === 0) {
      test.skip();
      return;
    }

    const result = await tester.runTests(mobileTests, 'test');
    expect(result.failed).toBe(0);
  });
});

test.describe('Tablet Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should pass all tablet viewport tests', async () => {
    const tabletTests = urlsToTest.filter(
      config => config.viewport && 
                config.viewport.width >= 768 && 
                config.viewport.width < 1024
    );

    if (tabletTests.length === 0) {
      test.skip();
      return;
    }

    const result = await tester.runTests(tabletTests, 'test');
    expect(result.failed).toBe(0);
  });
});

// ============================================================================
// UPDATE BASELINE TESTS
// ============================================================================

test.describe('Update Baselines', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  // Only run this when you want to update baselines
  test.skip('Update all baseline images', async () => {
    const result = await tester.runTests(urlsToTest, 'update');
    
    console.log(`Updated ${result.total} baseline image(s)`);
    expect(result.total).toBe(urlsToTest.length);
  });

  // Update only specific test baselines
  test.skip('Update specific baseline images', async () => {
    const testsToUpdate = urlsToTest.filter(
      config => config.name.includes('homepage')  // Update only homepage tests
    );

    const result = await tester.runTests(testsToUpdate, 'update');
    
    console.log(`Updated ${result.total} baseline image(s)`);
    expect(result.total).toBe(testsToUpdate.length);
  });
});

// ============================================================================
// CUSTOM TEST SCENARIOS
// ============================================================================

test.describe('Critical Path Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should pass visual tests for critical user journeys', async () => {
    // Define your critical pages
    const criticalPages: VisualTestConfig[] = [
      {
        name: 'critical-ap-homepage',
        url: 'https://authoritypartners.com',
        fullPage: true,
        threshold: 0.1  // Stricter threshold for critical pages
      },
      {
        name: 'critical-stories-page',
        url: 'https://authoritypartners.com/stories/',
        fullPage: true,
        threshold: 0.1
      }
    ];

    const result = await tester.runTests(criticalPages, 'test');
    
    // Critical tests must pass
    expect(result.failed).toBe(0);
    expect(result.passed + result.new).toBe(result.total);
  });
});

// ============================================================================
// SMOKE TEST - Quick validation of most important pages
// ============================================================================

test.describe('Visual Smoke Test', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test('should quickly validate key pages', async () => {
    // Quick smoke test with only critical pages
    const smokeTestPages: VisualTestConfig[] = [
      {
        name: 'smoke-homepage',
        url: 'https://www.apple.com',
        fullPage: false,  // Faster - viewport only
        threshold: 0.2   // More lenient for smoke tests
      }
    ];

    const result = await tester.runTests(smokeTestPages, 'test');
    expect(result.failed).toBe(0);
  });
});

// ============================================================================
// HELPER: Dynamic URL generation
// ============================================================================

/**
 * Generate visual tests for multiple similar URLs
 * Useful for testing multiple product pages, blog posts, etc.
 */
function generateTestsForUrls(baseUrl: string, paths: string[]): VisualTestConfig[] {
  return paths.map(path => ({
    name: `${path.replace(/\//g, '-')}`,
    url: `${baseUrl}${path}`,
    fullPage: true,
    threshold: 0.1
  }));
}

// Example usage:
test.describe('Blog Pages Visual Tests', () => {
  let tester: VisualTester;

  test.beforeAll(async () => {
    tester = new VisualTester();
  });

  test.skip('should test multiple blog posts', async () => {
    const blogPosts = generateTestsForUrls('https://example.com/blog', [
      '/post-1',
      '/post-2',
      '/post-3'
    ]);

    const result = await tester.runTests(blogPosts, 'test');
    expect(result.failed).toBe(0);
  });
});

// ============================================================================
// NOTES AND BEST PRACTICES
// ============================================================================

/*
CONFIGURATION OPTIONS EXPLAINED:

name (required):
  - Unique identifier for the test
  - Used for baseline image filename
  - Should be descriptive and lowercase with dashes

url (required):
  - Full URL to test
  - Must include protocol (https://)

fullPage (optional, default: true):
  - true: Capture entire scrollable page
  - false: Capture only visible viewport

viewport (optional):
  - Custom viewport size
  - Default: { width: 1920, height: 1080 }
  - Common sizes:
    * Mobile: { width: 375, height: 667 }
    * Tablet: { width: 768, height: 1024 }
    * Desktop: { width: 1920, height: 1080 }

threshold (optional, default: 0.1):
  - Acceptable difference percentage (0-100)
  - 0.1 = 0.1% difference allowed
  - Lower = stricter comparison
  - Higher = more lenient

waitForSelector (optional):
  - CSS selector to wait for before capturing
  - Useful for dynamic content
  - Example: '.product-list', '#main-content'

waitForTimeout (optional):
  - Additional wait time in milliseconds
  - Use for animations or lazy loading
  - Example: 2000 (2 seconds)

ignoreRegions (optional):
  - Array of rectangular regions to ignore
  - Useful for dynamic content (ads, timestamps, etc.)
  - Format: { x, y, width, height }
  - Coordinates are in pixels from top-left

RUNNING TESTS:

1. Create baselines (first time):
   npm test

2. Run visual regression tests:
   npm test

3. Update baselines after design changes:
   Remove .skip from "Update all baseline images" test and run

4. Run specific test groups:
   npx playwright test --grep "Desktop"
   npx playwright test --grep "Mobile"

5. Run in headed mode to debug:
   npx playwright test --headed

6. Generate report:
   npx playwright show-report
*/