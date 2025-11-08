import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester';
import { VisualTestConfig } from '../src/types/visual-regression.types';

test.describe('Visual Smoke Test', () => {
    let tester: VisualTester;
  
    test.beforeAll(async () => {
      tester = new VisualTester();
    });
  
    test('Verify AP Homepage', async () => {
      // Quick smoke test with only critical pages
      const smokeTestPages: VisualTestConfig[] = [
        {
          name: 'authority-partners-homepage',
          url: 'https://www.authoritypartners.com',
          fullPage: false,  // Faster - viewport only
          threshold: 0.2   // More lenient for smoke tests
        }
      ];
  
      const result = await tester.runTests(smokeTestPages, 'test');
      expect(result.failed).toBe(0);
    });

    test('Verify AP Services Page', async () => {
      // Quick smoke test with only critical pages
      const smokeTestPages: VisualTestConfig[] = [
        {
          name: 'authority-partners-services-page',
          url: 'https://www.authoritypartners.com/services/',
          fullPage: false,  // Faster - viewport only
          threshold: 0.2   // More lenient for smoke tests
        }
      ];
  
      const result = await tester.runTests(smokeTestPages, 'test');
      expect(result.failed).toBe(0);
    });

    test('Verify AP Insights Page', async () => {
      // Quick smoke test with only critical pages
      const smokeTestPages: VisualTestConfig[] = [
        {
          name: 'authority-partners-insights-page',
          url: 'https://www.authoritypartners.com/insights/',
          fullPage: false,  // Faster - viewport only
          threshold: 0.2   // More lenient for smoke tests
        }
      ];
  
      const result = await tester.runTests(smokeTestPages, 'test');
      expect(result.failed).toBe(0);
    });
  });