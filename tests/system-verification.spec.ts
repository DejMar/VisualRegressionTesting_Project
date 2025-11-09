import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester';
import { VisualTestConfig } from '../src/types/visual-regression.types';

const urlsToTest: VisualTestConfig[] = [
  {
    name: 'sv-homepage',
    url: 'https://systemverification.com/',
    fullPage: true,
    threshold: 0.1
  },
  {
    name: 'sv-homepage-mobile',
    url: 'https://systemverification.com/',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.2
  },
  {
    name: 'sv-solutions-quality-insights-page',
    url: 'https://systemverification.com/solutions/quality-insights',
    //waitForSelector: '.products-grid',  // Wait for this element to load
    fullPage: true,
    threshold: 0.15
  },
  {
    name: 'sv-solutions-quality-insights-page-mobile',
    url: 'https://systemverification.com/solutions/quality-insights',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.1,
  },
  {
    name: 'sv-solutions-quality-management-page',
    url: 'https://systemverification.com/solutions/quality-management',
    //waitForSelector: '.products-grid',  // Wait for this element to load
    fullPage: true,
    threshold: 0.15
  },
  {
    name: 'sv-solutions-quality-management-page-mobile',
    url: 'https://systemverification.com/solutions/quality-management',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.1,
  }
];

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
