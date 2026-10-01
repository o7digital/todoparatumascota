import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const chromeInstalled = existsSync('/Applications/Google Chrome.app') || process.env.PLAYWRIGHT_CHANNEL === 'chrome';
export default defineConfig({testDir:'./tests',timeout:60000,workers:1,use:{baseURL:'http://127.0.0.1:4323',browserName:'chromium',...(chromeInstalled ? {channel:'chrome'} : {}),reducedMotion:'reduce'},webServer:{command:'npm run build && node scripts/serve-preview.mjs',url:'http://127.0.0.1:4323',reuseExistingServer:true},reporter:'list'});
