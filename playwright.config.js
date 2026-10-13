import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
const production = process.env.SMOKE_PRODUCTION === '1';
const baseURL = production ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173';
export default defineConfig({
  testDir: './tests/browser', timeout: 60000, workers: 1,
  use: { baseURL, viewport: { width: 1600, height: 1000 }, launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] } },
  webServer: { command: production ? 'npm run preview -- --host 127.0.0.1' : 'npm run dev -- --host 127.0.0.1', url: baseURL, reuseExistingServer: true },
  reporter: 'list'
});
