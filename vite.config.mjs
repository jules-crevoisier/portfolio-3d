import { defineConfig, loadEnv } from 'vite';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { minify } from 'html-minifier-terser';

// Génère robots.txt et sitemap.xml à partir de VITE_SITE_URL, puis pré-compresse
// (gzip + brotli) les fichiers texte pour que le serveur statique les serve tels quels.
function seoAndCompress(siteUrl) {
  let outDir;
  return {
    name: 'seo-and-compress',
    apply: 'build',
    configResolved(c) { outDir = c.build.outDir; },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
      });
    },
    async closeBundle() {
      // minifie index.html (CSS et scripts en ligne compris)
      const html = join(outDir, 'index.html');
      // la feuille des polices (~4 Ko) est mise en ligne : une requête bloquante de moins avant le premier affichage
      let page = readFileSync(html, 'utf8').replace(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g, (m, f) => {
        const css = readFileSync(join(outDir, f), 'utf8'); rmSync(join(outDir, f)); return `<style>${css}</style>`;
      });
      writeFileSync(html, page);
      writeFileSync(html, await minify(readFileSync(html, 'utf8'), {
        collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
        minifyCSS: true, minifyJS: { module: false, compress: true, mangle: true }, keepClosingSlash: false,
      }));
      const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
      for (const f of walk(outDir)) {
        if (!/\.(html|js|css|svg|xml|txt|json)$/.test(f)) continue;
        const buf = readFileSync(f);
        if (buf.length < 1024) continue;
        writeFileSync(f + '.gz', gzipSync(buf, { level: 9 }));
        writeFileSync(f + '.br', brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: buf.length } }));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL).replace(/\/$/, '');
  return {
    build: {
      target: 'es2022',
      assetsInlineLimit: 0,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 800, // three.js seul pèse ~500 ko minifié (~130 ko en brotli)
      modulePreload: { polyfill: false },
      // three.js dans son propre fichier : il reste en cache quand seul le code du site change
      rolldownOptions: { output: { advancedChunks: { groups: [{ name: 'three', test: /node_modules[\/]three/ }] } } },
    },
    plugins: [seoAndCompress(siteUrl)],
  };
});
