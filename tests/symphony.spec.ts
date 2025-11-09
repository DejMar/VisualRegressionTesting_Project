import { VisualTestConfig } from "../src/types/visual-regression.types";
import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester'

const urlsToTest: VisualTestConfig[] = [
  {
    name: 'AP-homepage',
    url: 'https://www.authoritypartners.com',
    fullPage: true,
    threshold: 0.1
  },
  {
    name: 'symphony-homepage',
    url: 'https://www.symphony.is',
    fullPage: true,
    threshold: 0.1
  },
  {
    name: 'symphony-homepage-mobile',
    url: 'https://www.symphony.is',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.2
  },
  {
    name: 'symphony-who-we-are-page',
    url: 'https://www.symphony.is/who-we-are',
    fullPage: true,
    threshold: 0.1
  },
  {
    name: 'symphony-who-we-are-page-mobile',
    url: 'https://www.symphony.is/who-we-are',
    viewport: {
      width: 375,
      height: 667
    },
    fullPage: true,
    threshold: 0.2
  },
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