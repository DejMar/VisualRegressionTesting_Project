// ============================================================================
// File: src/reporters/console.reporter.ts
// ============================================================================

import { ComparisonResult, TestSuiteResult } from '../types/visual-regression.types';
import { Logger } from '../utils/logger.utils';

export class ConsoleReporter {
  reportResult(result: ComparisonResult): void {
    if (!result.baselineExists) {
      Logger.newBaseline(result.name);
      return;
    }

    if (result.error) {
      Logger.error(`${result.name}: ${result.error}`);
      return;
    }

    if (result.passed) {
      Logger.success(`${result.name} - Diff: ${result.diffPercentage.toFixed(3)}%`);
    } else {
      Logger.error(
        `${result.name} - Diff: ${result.diffPercentage.toFixed(3)}% ` +
        `(${result.pixelDifference.toLocaleString()} pixels)`
      );
    }
  }

  reportSummary(suiteResult: TestSuiteResult): void {
    Logger.section('📊 VISUAL REGRESSION TEST SUMMARY');

    console.log(`Total Tests:    ${suiteResult.total}`);
    console.log(`✓ Passed:       ${suiteResult.passed}`);
    console.log(`✗ Failed:       ${suiteResult.failed}`);
    console.log(`📸 New:         ${suiteResult.new}`);
    console.log(`⏱ Time:         ${suiteResult.executionTime}ms`);

    console.log('='.repeat(70) + '\n');

    if (suiteResult.failed > 0) {
      Logger.section('❌ FAILED TESTS');
      suiteResult.results
        .filter(r => !r.passed && r.baselineExists)
        .forEach(r => {
          console.log(`\n${r.name}:`);
          console.log(`  URL: ${r.url}`);
          console.log(`  Difference: ${r.diffPercentage.toFixed(3)}%`);
          console.log(`  Pixels: ${r.pixelDifference.toLocaleString()}`);
          if (r.diffPath) {
            console.log(`  Diff Image: ${r.diffPath}`);
          }
        });
      console.log('\n' + '='.repeat(70) + '\n');
    }
  }
}
