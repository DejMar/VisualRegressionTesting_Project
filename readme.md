# Visual Regression Testing Framework

A comprehensive visual regression testing framework built with Playwright and TypeScript.

## Features

- 📸 **Automated Screenshot Capture**: Capture full-page or viewport screenshots
- 🔍 **Pixel-Perfect Comparison**: Compare images with configurable threshold
- 📊 **Detailed Reports**: Generate HTML and console reports
- 🎯 **Flexible Configuration**: Support for different viewports, wait conditions, and ignore regions
- 🚀 **Multiple Modes**: Test, Update, and Compare modes
- 📱 **Responsive Testing**: Test multiple viewport sizes
- 🎨 **Visual Diff Highlighting**: Generate diff images showing exact differences

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

### 1. Define Test Configurations

Create your test configurations in \`src/cli/run-visual-tests.ts\`:

\`\`\`typescript
const testConfigs: VisualTestConfig[] = [
  {
    name: 'homepage',
    url: 'https://example.com',
    fullPage: true,
    threshold: 0.1  // 0.1% difference allowed
  },
  {
    name: 'products-page',
    url: 'https://example.com/products',
    fullPage: true,
    waitForSelector: '.product-list',
    threshold: 0.15
  },
  {
    name: 'homepage-mobile',
    url: 'https://example.com',
    viewport: { width: 375, height: 667 },
    fullPage: true,
    threshold: 0.2
  }
];
\`\`\`

### 2. Run Tests

**Create/Update Baseline Images:**
\`\`\`bash
npm run test:update
\`\`\`

**Run Visual Regression Tests:**
\`\`\`bash
npm run test:run
# or
npm test
\`\`\`

**Compare Only (no baseline update):**
\`\`\`bash
npm run test:compare
\`\`\`

### 3. View Reports

After running tests, open the generated HTML report:
\`\`\`bash
open visual-tests/reports/report-[timestamp].html
\`\`\`

## Configuration Options

### VisualTestConfig

\`\`\`typescript
interface VisualTestConfig {
  name: string;                    // Unique test name
  url: string;                     // URL to test
  viewport?: {                     // Custom viewport size
    width: number;
    height: number;
  };
  waitForSelector?: string;        // Wait for element before screenshot
  waitForTimeout?: number;         // Additional wait time (ms)
  fullPage?: boolean;              // Capture full page or viewport only
  threshold?: number;              // Allowed difference percentage (0-100)
  ignoreRegions?: Region[];        // Areas to ignore in comparison
}
\`\`\`

### Example: Ignore Dynamic Regions

\`\`\`typescript
{
  name: 'homepage-no-ads',
  url: 'https://example.com',
  ignoreRegions: [
    { x: 0, y: 0, width: 300, height: 250 },      // Top ad
    { x: 800, y: 500, width: 300, height: 600 }   // Sidebar ad
  ]
}
\`\`\`

## Modes

### Test Mode (default)
- Captures current screenshots
- Compares with baselines
- Creates baselines if they don't exist
- Generates reports

### Update Mode
- Updates all baseline images
- Use when intentional changes are made

### Compare Mode
- Only compares without creating new baselines
- Fails if baseline doesn't exist

## Programmatic Usage

\`\`\`typescript
import { VisualTester } from './src/core/visual.tester';
import { VisualTestConfig } from './src/types/visual-regression.types';

const configs: VisualTestConfig[] = [
  {
    name: 'my-page',
    url: 'https://mysite.com',
    threshold: 0.1
  }
];

const tester = new VisualTester();
const result = await tester.runTests(configs, 'test');

console.log(\`Passed: \${result.passed}, Failed: \${result.failed}\`);
\`\`\`

## CI/CD Integration

### GitHub Actions Example

\`\`\`yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
        
      - name: Run visual regression tests
        run: npm test
        
      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: visual-tests/diff/
          
      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-report
          path: visual-tests/reports/
\`\`\`

## Best Practices

1. **Commit Baselines**: Keep baseline images in version control
2. **Reasonable Thresholds**: Set thresholds based on your needs (0.1-0.5% typical)
3. **Wait for Content**: Use \`waitForSelector\` for dynamic content
4. **Ignore Dynamic Elements**: Use \`ignoreRegions\` for timestamps, ads, etc.
5. **Multiple Viewports**: Test critical pages on different screen sizes
6. **Regular Updates**: Update baselines when making intentional design changes

## Cleaning Up

\`\`\`bash
# Clean current and diff images
npm run clean

# Clean everything including baselines
npm run clean:all
\`\`\`

## Troubleshooting

### Tests Failing with Small Differences
- Increase the threshold value
- Check for animations or dynamic content
- Use \`ignoreRegions\` for problematic areas

### Images Not Matching Dimensions
- Ensure consistent viewport settings
- Check that fullPage setting is the same

### Slow Test Execution
- Reduce the number of tests run in parallel
- Use viewport screenshots instead of fullPage when possible
- Add specific \`waitForSelector\` instead of long timeouts

## License

MITfullPage: true,
    threshold: 0.2
  }
];

test.describe('Visual Regression Tests', () => {
  test('should pass visual regression tests', async () => {
    const tester = new VisualTester();
    const result = await tester.runTests(testConfigs, 'test');
    
    expect(result.failed).toBe(0);
    expect(result.passed + result.new).toBe(result.total);
  });

  test('should update baselines when in update mode', async () => {
    const tester = new VisualTester();
    const result = await tester.runTests(testConfigs, 'update');
    
    expect(result.total).toBe(testConfigs.length);
  });
});
