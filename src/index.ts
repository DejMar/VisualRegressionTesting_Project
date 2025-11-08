// ============================================================================
// File: src/index.ts
// ============================================================================

export { VisualTester } from './core/visual.tester';
export { ScreenshotCapture } from './core/screenshot.capture';
export { ImageComparator } from './core/image.comparator';
export { ConsoleReporter } from './reporters/console.reporter';
export { HtmlReporter } from './reporters/html.reporter';
export { 
  VisualTestConfig, 
  ComparisonResult, 
  TestSuiteResult,
  ComparisonMode,
  Region 
} from './types/visual-regression.types';
