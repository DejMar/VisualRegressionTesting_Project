// ============================================================================
// File: src/core/screenshot.capture.ts
// ============================================================================

import { Page, Browser, chromium } from '@playwright/test';
import { VisualTestConfig } from '../types/visual-regression.types';
import { DEFAULT_VIEWPORT, IMAGE_OPTIONS } from '../config/visual-regression.config';
import { PathUtils } from '../utils/path.utils';

export class ScreenshotCapture {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async captureScreenshot(
    config: VisualTestConfig,
    outputPath: string
  ): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const page = await this.browser.newPage({
      viewport: config.viewport || DEFAULT_VIEWPORT
    });

    try {
      await page.goto(config.url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      if (config.waitForSelector) {
        await page.waitForSelector(config.waitForSelector, { 
          timeout: 10000 
        });
      }

      if (config.waitForTimeout) {
        await page.waitForTimeout(config.waitForTimeout);
      }

      await this.hideIgnoredRegions(page, config.ignoreRegions);

      await page.screenshot({
        path: outputPath,
        fullPage: config.fullPage ?? true,
        ...IMAGE_OPTIONS
      });
    } finally {
      await page.close();
    }
  }

  private async hideIgnoredRegions(page: Page, regions?: Region[]): Promise<void> {
    if (!regions || regions.length === 0) return;

    await page.evaluate((regionsToHide) => {
      regionsToHide.forEach((region) => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${region.x}px`;
        div.style.top = `${region.y}px`;
        div.style.width = `${region.width}px`;
        div.style.height = `${region.height}px`;
        div.style.backgroundColor = '#808080';
        div.style.zIndex = '999999';
        document.body.appendChild(div);
      });
    }, regions);
  }
}