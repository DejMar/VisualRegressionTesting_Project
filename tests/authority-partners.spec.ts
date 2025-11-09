import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester';
import { runSingleSmokeTest } from '../src/core/methods';

test.describe('Visual Smoke Test', () => {
    let tester: VisualTester;
  
    test.beforeAll(async () => {
      tester = new VisualTester();
    });
  
    test('Verify AP Homepage', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-homepage',
        'https://www.authoritypartners.com'
      );
      expect(result.failed).toBe(0);
    });

    test('Verify AP Services Page', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-services-page',
        'https://www.authoritypartners.com/services/'
      );
      expect(result.failed).toBe(0);
    });

    test('Verify AP Insights Page', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-insights-page',
        'https://www.authoritypartners.com/insights/'
      );
      expect(result.failed).toBe(0);
    });

    test('Verify AP Stories Page', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-stories-page',
        'https://www.authoritypartners.com/stories/'
      );
      expect(result.failed).toBe(0);
    });

    test('Verify AP Careers Page', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-careers-page',
        'https://www.authoritypartners.com/careers/'
      );
      expect(result.failed).toBe(0);
    });

    test('Verify AP About Us Page', async () => {
      const result = await runSingleSmokeTest(
        tester,
        'authority-partners-about-page',
        'https://www.authoritypartners.com/about/'
      );
      expect(result.failed).toBe(0);
    });
  });

  