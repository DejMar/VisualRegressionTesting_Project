// ============================================================================
// File: src/core/image.comparator.ts
// ============================================================================

import { ComparisonResult, VisualTestConfig } from '../types/visual-regression.types';
import { PATHS, DEFAULT_THRESHOLD } from '../config/visual-regression.config';
import { PathUtils } from '../utils/path.utils';
import { ImageUtils } from '../utils/image.utils';

export class ImageComparator {
  compare(config: VisualTestConfig): ComparisonResult {
    const sanitizedName = PathUtils.sanitizeFileName(config.name);
    const baselinePath = PathUtils.getBaselinePath(sanitizedName, PATHS.baseline);
    const currentPath = PathUtils.getCurrentPath(sanitizedName, PATHS.current);
    const diffPath = PathUtils.getDiffPath(sanitizedName, PATHS.diff);

    const result: ComparisonResult = {
      name: config.name,
      url: config.url,
      passed: false,
      diffPercentage: 0,
      pixelDifference: 0,
      totalPixels: 0,
      baselineExists: PathUtils.fileExists(baselinePath),
      timestamp: new Date(),
      baselinePath,
      currentPath,
      diffPath
    };

    if (!result.baselineExists) {
      result.error = 'No baseline image found';
      return result;
    }

    try {
      const threshold = config.threshold ?? DEFAULT_THRESHOLD;
      const comparison = ImageUtils.compareImages(
        baselinePath,
        currentPath,
        diffPath,
        threshold
      );

      result.pixelDifference = comparison.diffPixels;
      result.totalPixels = comparison.totalPixels;
      result.diffPercentage = comparison.diffPercentage;
      result.passed = comparison.diffPercentage <= threshold;

      if (result.passed) {
        PathUtils.deleteFile(diffPath);
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      result.passed = false;
    }

    return result;
  }
}