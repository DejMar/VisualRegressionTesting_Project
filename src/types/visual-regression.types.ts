// ============================================================================
// File: src/types/visual-regression.types.ts
// ============================================================================

export interface VisualTestConfig {
    url: string;
    name: string;
    viewport?: {
      width: number;
      height: number;
    };
    waitForSelector?: string;
    waitForTimeout?: number;
    fullPage?: boolean;
    threshold?: number;
    ignoreRegions?: Region[];
  }
  
  export interface Region {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface ComparisonResult {
    name: string;
    url: string;
    passed: boolean;
    diffPercentage: number;
    pixelDifference: number;
    totalPixels: number;
    baselineExists: boolean;
    timestamp: Date;
    baselinePath?: string;
    currentPath?: string;
    diffPath?: string;
    error?: string;
  }
  
  export interface TestSuiteResult {
    total: number;
    passed: number;
    failed: number;
    new: number;
    results: ComparisonResult[];
    executionTime: number;
  }

  export type ComparisonMode = 'update' | 'compare' | 'test';
