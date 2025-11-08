// ============================================================================
// File: src/config/visual-regression.config.ts
// ============================================================================

export const DEFAULT_VIEWPORT = {
    width: 1920,
    height: 1080
  };
  
  export const DEFAULT_THRESHOLD = 0.1; // 0.1% difference allowed
  
  export const PATHS = {
    baseline: './visual-tests/baseline',
    current: './visual-tests/current',
    diff: './visual-tests/diff',
    reports: './visual-tests/reports'
  };
  
  export const IMAGE_OPTIONS = {
    type: 'png' as const,
    animations: 'disabled' as const
  };
  
  export const COMPARISON_OPTIONS = {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.1,
    aaColorFactor: 1.0,
    diffColor: [255, 0, 0] as [number, number, number],
    diffColorAlt: [0, 255, 0] as [number, number, number]
  };