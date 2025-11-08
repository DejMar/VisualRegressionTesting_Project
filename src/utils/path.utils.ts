// ============================================================================
// File: src/utils/path.utils.ts
// ============================================================================

import * as path from 'path';
import * as fs from 'fs';

export class PathUtils {
  static ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static getBaselinePath(name: string, baseDir: string): string {
    return path.join(baseDir, `${name}.png`);
  }

  static getCurrentPath(name: string, baseDir: string): string {
    return path.join(baseDir, `${name}.png`);
  }

  static getDiffPath(name: string, baseDir: string): string {
    return path.join(baseDir, `${name}-diff.png`);
  }

  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  static sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
}
