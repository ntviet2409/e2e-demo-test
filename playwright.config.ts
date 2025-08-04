import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

import logger from './src/lib/logger';

// Load the correct .env file based on the ENV variable
logger.info('Loading the correct .env file based on the ENV variable');
const env = process.env.ENV || 'dev'; // Default to 'dev' if ENV is not provided
const envFilePath = `.env.${env}`;
const isSemaphore = !!process.env.SEMAPHORE;

if (!fs.existsSync(envFilePath)) {
  throw new Error(`Environment file "${envFilePath}" not found. Please create one.`);
}
dotenv.config({ path: envFilePath });

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true, // Enable parallel test execution
  workers: process.env.CI ? 1 : 4, // Use 1 worker in CI for stability, 4 in development
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Increase retries in CI to handle flaky tests
  timeout: 240000, // 240 seconds global timeout for mobile tests
  maxFailures: 0, // Continue running all tests even if some fail (overridden by CLI --max-failures)
  outputDir: 'test-results', // Set output directory for screenshots, videos, and traces
  
  // Ensure all test results are aggregated in a single report
  metadata: {
    aggregateResults: true,
  },

  expect: {
    timeout: 30000, // 30 seconds timeout for `expect` statements
  },

  /* Reporter to use */
  reporter: [
    ['list'],
    // Include HTML only if not on Semaphore
    (isSemaphore ?  ['junit', { outputFile: 'playwright-report/report.xml' }] : ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' // Don't auto-open the report
    }]),
    // Add additional reporters for better aggregation
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],

  use: {
    baseURL: process.env.BASE_URL, // Use base URL from environment
    screenshot: 'only-on-failure', // Only capture screenshots when tests fail
    trace: process.env.CI ? 'on' : 'on-first-retry', // Always enable traces in CI for debugging
    video: 'retain-on-failure', // Capture video only for failed tests
    actionTimeout: process.env.CI ? 20000 : 15000, // Longer timeout for CI mobile tests
    navigationTimeout: process.env.CI ? 45000 : 30000, // Longer navigation timeout for CI
  },

  projects: [
    // Desktop Browsers - Chromium
    {
      name: 'OrangeHRM-Chrome-Desktop',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
        viewport: { width: 1920, height: 1080 },
        headless: process.env.HEADLESS !== 'false',
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
    
    // Desktop Browsers - Firefox
    {
      name: 'OrangeHRM-Firefox-Desktop',
      use: {
        ...devices['Desktop Firefox'],
        deviceScaleFactor: 1,
        viewport: { width: 1920, height: 1080 },
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Desktop Browsers - Safari (WebKit)
    {
      name: 'OrangeHRM-Safari-Desktop',
      use: {
        ...devices['Desktop Safari'],
        deviceScaleFactor: 1,
        viewport: { width: 1920, height: 1080 },
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Mobile Devices - Chrome Mobile
    {
      name: 'OrangeHRM-Chrome-Mobile',
      use: {
        ...devices['Pixel 5'],
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Mobile Devices - Safari Mobile
    {
      name: 'OrangeHRM-Safari-Mobile',
      use: {
        ...devices['iPhone 12'],
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Tablet Devices
    {
      name: 'OrangeHRM-iPad',
      use: {
        ...devices['iPad Pro'],
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Windows Specific (Edge)
    {
      name: 'OrangeHRM-Edge-Windows',
      use: {
        ...devices['Desktop Edge'],
        deviceScaleFactor: 1,
        viewport: { width: 1920, height: 1080 },
        headless: process.env.HEADLESS !== 'false',
      },
    },
    
    // Legacy project name for backward compatibility
    {
      name: 'OrangeHRM-UI-Tests',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
        viewport: { width: 1920, height: 1080 },
        headless: process.env.HEADLESS !== 'false',
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],

});