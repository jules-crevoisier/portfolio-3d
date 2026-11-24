// Génère public/og.jpg (1200×630) en photographiant le site buildé.
// Prérequis : npm run build. Utilise Edge ou Chrome installé sur la machine.
//   npm run og-image
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const server = await preview({ preview: { port: 4179, strictPort: true } });
const channel = process.env.BROWSER_CHANNEL || 'msedge';
const browser = await chromium.launch({ channel, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4179/', { waitUntil: 'load' });
  // attend la fin de l'écran de chargement puis laisse l'animation d'entrée se poser
  await page.waitForFunction(() => { const l = document.getElementById('loader'); return !l || getComputedStyle(l).display === 'none' || getComputedStyle(l).opacity === '0' || l.classList.contains('done') || l.hidden; }, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(Number(process.env.OG_DELAY || 4000));
  await mkdir('public', { recursive: true });
  await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 86 });
  console.log('public/og.jpg écrit');
} finally {
  await browser.close();
  server.httpServer.close();
}
