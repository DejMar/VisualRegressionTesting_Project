// ============================================================================
// File: src/reporters/html.reporter.ts
// ============================================================================

import * as fs from 'fs';
import * as path from 'path';
import { TestSuiteResult, ComparisonResult } from '../types/visual-regression.types';
import { PathUtils } from '../utils/path.utils';

export class HtmlReporter {
  generateReport(suiteResult: TestSuiteResult, outputPath: string): void {
    PathUtils.ensureDirectory(path.dirname(outputPath));

    const html = this.buildHtml(suiteResult);
    fs.writeFileSync(outputPath, html);
  }

  private buildHtml(suiteResult: TestSuiteResult): string {
    const passed = suiteResult.results.filter(r => r.passed && r.baselineExists);
    const failed = suiteResult.results.filter(r => !r.passed && r.baselineExists);
    const newTests = suiteResult.results.filter(r => !r.baselineExists);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Regression Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
               background: #f5f5f5; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                   gap: 15px; margin-top: 20px; }
        .stat { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 14px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .new { color: #007bff; }
        .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; 
                   box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section h2 { margin-bottom: 20px; color: #333; }
        .test-card { border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; 
                     margin-bottom: 20px; background: #fafafa; }
        .test-header { display: flex; justify-content: space-between; align-items: center; 
                       margin-bottom: 15px; }
        .test-name { font-size: 18px; font-weight: 600; color: #333; }
        .test-url { color: #666; font-size: 14px; margin-bottom: 10px; }
        .badge { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        .badge-info { background: #d1ecf1; color: #0c5460; }
        .images { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                  gap: 15px; margin-top: 15px; }
        .image-wrapper { text-align: center; }
        .image-wrapper img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .image-label { margin-top: 8px; font-size: 14px; font-weight: 500; color: #666; }
        .diff-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; 
                     margin: 10px 0; border-radius: 4px; }
        .no-tests { text-align: center; padding: 40px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📸 Visual Regression Test Report</h1>
            <div class="summary">
                <div class="stat">
                    <div class="stat-value">${suiteResult.total}</div>
                    <div class="stat-label">Total Tests</div>
                </div>
                <div class="stat">
                    <div class="stat-value passed">${suiteResult.passed}</div>
                    <div class="stat-label">Passed</div>
                </div>
                <div class="stat">
                    <div class="stat-value failed">${suiteResult.failed}</div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat">
                    <div class="stat-value new">${suiteResult.new}</div>
                    <div class="stat-label">New Baselines</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${suiteResult.executionTime}ms</div>
                    <div class="stat-label">Execution Time</div>
                </div>
            </div>
        </div>

        ${failed.length > 0 ? this.buildFailedSection(failed) : ''}
        ${passed.length > 0 ? this.buildPassedSection(passed) : ''}
        ${newTests.length > 0 ? this.buildNewSection(newTests) : ''}
    </div>
</body>
</html>`;
  }

  private buildFailedSection(results: ComparisonResult[]): string {
    return `
        <div class="section">
            <h2>❌ Failed Tests (${results.length})</h2>
            ${results.map(r => this.buildTestCard(r, 'failed')).join('')}
        </div>`;
  }

  private buildPassedSection(results: ComparisonResult[]): string {
    return `
        <div class="section">
            <h2>✅ Passed Tests (${results.length})</h2>
            ${results.map(r => this.buildTestCard(r, 'passed')).join('')}
        </div>`;
  }

  private buildNewSection(results: ComparisonResult[]): string {
    return `
        <div class="section">
            <h2>📸 New Baselines (${results.length})</h2>
            ${results.map(r => this.buildTestCard(r, 'new')).join('')}
        </div>`;
  }

  private buildTestCard(result: ComparisonResult, status: string): string {
    const badgeClass = status === 'passed' ? 'badge-success' : 
                       status === 'failed' ? 'badge-danger' : 'badge-info';
    const badgeText = status === 'passed' ? 'PASSED' : 
                      status === 'failed' ? 'FAILED' : 'NEW';

    return `
        <div class="test-card">
            <div class="test-header">
                <div class="test-name">${result.name}</div>
                <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="test-url">${result.url}</div>
            
            ${status === 'failed' ? `
                <div class="diff-info">
                    <strong>Difference:</strong> ${result.diffPercentage.toFixed(3)}% 
                    (${result.pixelDifference.toLocaleString()} pixels out of ${result.totalPixels.toLocaleString()})
                </div>
            ` : ''}

            <div class="images">
                ${result.baselinePath ? `
                    <div class="image-wrapper">
                        <img src="${path.relative(path.dirname(''), result.baselinePath)}" alt="Baseline">
                        <div class="image-label">Baseline</div>
                    </div>
                ` : ''}
                ${result.currentPath ? `
                    <div class="image-wrapper">
                        <img src="${path.relative(path.dirname(''), result.currentPath)}" alt="Current">
                        <div class="image-label">Current</div>
                    </div>
                ` : ''}
                ${status === 'failed' && result.diffPath ? `
                    <div class="image-wrapper">
                        <img src="${path.relative(path.dirname(''), result.diffPath)}" alt="Diff">
                        <div class="image-label">Difference</div>
                    </div>
                ` : ''}
            </div>
        </div>`;
  }
}