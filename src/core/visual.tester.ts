// ============================================================================
// File: src/core/visual.tester.ts
// ============================================================================

import { 
    VisualTestConfig, 
    ComparisonResult, 
    TestSuiteResult, 
    ComparisonMode 
  } from '../types/visual-regression.types';
  import { PATHS } from '../config/visual-regression.config';
  import { ScreenshotCapture } from './screenshot.capture';
  import { ImageComparator } from './image.comparator';
  import { PathUtils } from '../utils/path.utils';
  import { ConsoleReporter } from '../reporters/console.reporter';
  import { HtmlReporter } from '../reporters/html.reporter';
  import { Logger } from '../utils/logger.utils';
  
  export class VisualTester {
    private capture: ScreenshotCapture;
    private comparator: ImageComparator;
    private consoleReporter: ConsoleReporter;
    private htmlReporter: HtmlReporter;
  
    constructor() {
      this.capture = new ScreenshotCapture();
      this.comparator = new ImageComparator();
      this.consoleReporter = new ConsoleReporter();
      this.htmlReporter = new HtmlReporter();
      this.initializeDirectories();
    }
  
    private initializeDirectories(): void {
      PathUtils.ensureDirectory(PATHS.baseline);
      PathUtils.ensureDirectory(PATHS.current);
      PathUtils.ensureDirectory(PATHS.diff);
      PathUtils.ensureDirectory(PATHS.reports);
    }
  
    async runTests(
      configs: VisualTestConfig[],
      mode: ComparisonMode = 'test'
    ): Promise<TestSuiteResult> {
      const startTime = Date.now();
      
      Logger.section(`🚀 Running Visual Regression Tests (Mode: ${mode.toUpperCase()})`);
      
      await this.capture.initialize();
  
      const results: ComparisonResult[] = [];
  
      try {
        for (const config of configs) {
          Logger.info(`Processing: ${config.name}`);
          const result = await this.runSingleTest(config, mode);
          results.push(result);
          this.consoleReporter.reportResult(result);
        }
      } finally {
        await this.capture.cleanup();
      }
  
      const suiteResult = this.buildSuiteResult(results, Date.now() - startTime);
      
      this.consoleReporter.reportSummary(suiteResult);
      
      const reportPath = `${PATHS.reports}/report-${Date.now()}.html`;
      this.htmlReporter.generateReport(suiteResult, reportPath);
      Logger.success(`HTML report generated: ${reportPath}`);
  
      return suiteResult;
    }
  
    private async runSingleTest(
      config: VisualTestConfig,
      mode: ComparisonMode
    ): Promise<ComparisonResult> {
      const sanitizedName = PathUtils.sanitizeFileName(config.name);
  
      try {
        if (mode === 'update') {
          return await this.updateBaseline(config, sanitizedName);
        }
  
        const currentPath = PathUtils.getCurrentPath(sanitizedName, PATHS.current);
        await this.capture.captureScreenshot(config, currentPath);
  
        const baselinePath = PathUtils.getBaselinePath(sanitizedName, PATHS.baseline);
        
        if (!PathUtils.fileExists(baselinePath)) {
          if (mode === 'test') {
            PathUtils.ensureDirectory(PATHS.baseline);
            const baselinePath = PathUtils.getBaselinePath(sanitizedName, PATHS.baseline);
            await this.capture.captureScreenshot(config, baselinePath);
          }
          
          return {
            name: config.name,
            url: config.url,
            passed: true,
            diffPercentage: 0,
            pixelDifference: 0,
            totalPixels: 0,
            baselineExists: false,
            timestamp: new Date(),
            currentPath
          };
        }
  
        return this.comparator.compare(config);
      } catch (error) {
        return {
          name: config.name,
          url: config.url,
          passed: false,
          diffPercentage: 0,
          pixelDifference: 0,
          totalPixels: 0,
          baselineExists: false,
          timestamp: new Date(),
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  
    private async updateBaseline(
      config: VisualTestConfig,
      sanitizedName: string
    ): Promise<ComparisonResult> {
      const baselinePath = PathUtils.getBaselinePath(sanitizedName, PATHS.baseline);
      await this.capture.captureScreenshot(config, baselinePath);
  
      return {
        name: config.name,
        url: config.url,
        passed: true,
        diffPercentage: 0,
        pixelDifference: 0,
        totalPixels: 0,
        baselineExists: true,
        timestamp: new Date(),
        baselinePath
      };
    }
  
    private buildSuiteResult(
      results: ComparisonResult[],
      executionTime: number
    ): TestSuiteResult {
      const passed = results.filter(r => r.passed && r.baselineExists).length;
      const failed = results.filter(r => !r.passed && r.baselineExists).length;
      const newBaselines = results.filter(r => !r.baselineExists).length;
  
      return {
        total: results.length,
        passed,
        failed,
        new: newBaselines,
        results,
        executionTime
      };
    }
  }
  