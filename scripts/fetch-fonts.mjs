// Télécharge les polices Google Fonts (sous-ensembles latin et latin-ext) dans fonts/
// et génère fonts/fonts.css. À relancer seulement si la liste des polices change :
//   node scripts/fetch-fonts.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const CSS_URL = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Cinzel:wght@700&family=Cinzel+Decorative:wght@900&family=Sedgwick+Ave+Display&family=Spectral:ital,wght@0,400;0,500;1,400&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const KEEP = new Set(['latin', 'latin-ext']);

const css = await (await fetch(CSS_URL, { headers: { 'user-agent': UA } })).text();
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*{[^}]+})/g)];
await mkdir('fonts', { recursive: true });

let out = '/* Polices auto-hébergées (SIL Open Font License), générées par scripts/fetch-fonts.mjs */\n';
for (const [, subset, block] of blocks) {
  if (!KEEP.has(subset)) continue;
  const family = block.match(/font-family:\s*'([^']+)'/)[1];
  const style = block.match(/font-style:\s*(\w+)/)[1];
  const weight = block.match(/font-weight:\s*([\d ]+)/)[1].trim().replace(' ', '-');
  const url = block.match(/url\(([^)]+)\)/)[1];
  const file = `${family.toLowerCase().replace(/ /g, '-')}-${weight}-${style}-${subset}.woff2`;
  await writeFile(`fonts/${file}`, Buffer.from(await (await fetch(url)).arrayBuffer()));
  out += block.replace(url, `./${file}`) + '\n';
  console.log(file);
}
await writeFile('fonts/fonts.css', out);
