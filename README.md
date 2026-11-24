# Portfolio 3D · Jules Crevoisier

Site en ligne : https://jules-crevoisier.fr

Portfolio immersif en three.js, construit avec Vite. three.js et les polices sont empaquetés et servis depuis le même serveur (aucun CDN, aucun service tiers).

## Développement

```
npm install
npm run dev
```

Puis ouvrir l'adresse affichée (http://localhost:5173).

## Build

```
npm run build
```

Le dossier `dist/` contient le site minifié, avec pour chaque fichier texte une version `.br` et `.gz` pré-compressée, plus `robots.txt` et `sitemap.xml`.

L'URL canonique (balise canonical, Open Graph, sitemap) vient de `VITE_SITE_URL` dans `.env`. Pour la changer au build : `VITE_SITE_URL=https://exemple.fr npm run build`, ou `docker build --build-arg VITE_SITE_URL=https://exemple.fr .`.

## Image Open Graph

`public/og.jpg` (1200×630) est une capture du site. Pour la régénérer après un changement visuel :

```
npm run build
npm run og-image
```

Le script utilise Edge (ou Chrome avec `BROWSER_CHANNEL=chrome`).

## Polices

Les fichiers `.woff2` de `fonts/` viennent de Google Fonts (sous-ensembles latin et latin-ext). Pour les re-télécharger : `node scripts/fetch-fonts.mjs`.

## Docker

```
docker build -t portfolio-3d .
docker run -p 8080:8080 portfolio-3d
```

Build multi-étapes : Node Alpine compile le site, puis l'image finale est [static-web-server](https://static-web-server.net) sur `scratch` (environ 15 Mo), lancée sans droits root sur le port 8080. Elle sert les fichiers pré-compressés, met en cache un an les fichiers versionnés de `assets/` et revalide toujours `index.html`. Configuration : `sws.toml`. Point de santé : `/health`.

## Fichiers

- `index.html`, `main.js` : le site.
- `src/base.js`, `src/tail.js` : les deux morceaux qui servent à générer `main.js` (non utilisés par le build).
- `fonts/` : polices auto-hébergées.
- `public/` : fichiers copiés tels quels (image Open Graph).
