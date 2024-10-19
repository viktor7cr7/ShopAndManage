import { defineConfig } from '@playwright/test';
import {config} from 'dotenv'
config({ path: './backend/.env' })

const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: baseUrl
  },
});
