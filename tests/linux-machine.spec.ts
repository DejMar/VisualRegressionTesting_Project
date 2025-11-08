import { test, expect } from '@playwright/test';
import { VisualTester } from '../src/core/visual.tester';
import { VisualTestConfig } from '../src/types/visual-regression.types';

const urlsToTest: VisualTestConfig[] = [
    {
      name: 'macos-machine-homepage',
      url: 'https://www.protonvpn.com',
      fullPage: true,
      threshold: 0.1
    }
  ];

test.describe('macOS Environment Visual Tests', () => {
    let tester: VisualTester;
  
    test.beforeAll(async () => {
      tester = new VisualTester();
    });
  
    test('should pass visual tests simulating macOS environment', async () => {
      // Simulate macOS-like environment by setting user agent and OS-specific viewport if needed
      // Here, we add a new config with a common macOS Chrome user agent
      const macUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  
      const macConfigs: VisualTestConfig[] = urlsToTest.map(cfg => ({
        ...cfg,
        userAgent: macUserAgent,
        // Optionally, define a typical macOS screen size (e.g., 1440x900)
        viewport: cfg.viewport || { width: 1440, height: 900 }
      }));
  
      const result = await tester.runTests(macConfigs, 'test');
      expect(result.failed).toBe(0);
    });
  });