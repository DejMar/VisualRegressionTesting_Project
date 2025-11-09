/**
 * Runs a visual smoke test for a single page by name and url,
 * using viewport-only, a lenient threshold, and default options.
 * Returns a promise resolving to the suite result.
 * 
 * @param tester an instance of VisualTester
 * @param name Name of the page (for artifact naming)
 * @param url URL of the page to test
 * @returns Promise<TestSuiteResult>
 */
export async function runSingleSmokeTest(
  tester: { runTests: Function },
  name: string,
  url: string
) {
  const smokeTestPages = [
    {
      name,
      url,
      fullPage: true,   // Faster - viewport only
      threshold: 0     // More lenient for smoke tests
    }
  ];
  return await tester.runTests(smokeTestPages, 'test');
}
