// ============================================================================
// File: src/utils/image.utils.ts
// ============================================================================

import { PNG } from 'pngjs';
import * as fs from 'fs';
import pixelmatch from 'pixelmatch';

export class ImageUtils {
  static readImage(filePath: string): PNG {
    return PNG.sync.read(fs.readFileSync(filePath));
  }

  static saveImage(filePath: string, png: PNG): void {
    fs.writeFileSync(filePath, PNG.sync.write(png));
  }

  static compareImages(
    img1Path: string,
    img2Path: string,
    diffPath: string,
    threshold: number = 0.1
  ): { diffPixels: number; totalPixels: number; diffPercentage: number } {
    const img1 = this.readImage(img1Path);
    const img2 = this.readImage(img2Path);

    const { width, height } = img1;
    
    if (img2.width !== width || img2.height !== height) {
      throw new Error(
        `Image dimensions don't match: ${width}x${height} vs ${img2.width}x${img2.height}`
      );
    }

    const diff = new PNG({ width, height });
    const totalPixels = width * height;

    const diffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold }
    );

    this.saveImage(diffPath, diff);

    const diffPercentage = (diffPixels / totalPixels) * 100;

    return { diffPixels, totalPixels, diffPercentage };
  }

  static getDimensions(filePath: string): { width: number; height: number } {
    const img = this.readImage(filePath);
    return { width: img.width, height: img.height };
  }
}