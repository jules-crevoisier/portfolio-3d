# syntax=docker/dockerfile:1

# --- Étape 1 : build Vite (three.js et polices empaquetés, fichiers pré-compressés gzip + brotli)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
ARG VITE_SITE_URL=https://jules-crevoisier.fr
ENV VITE_SITE_URL=${VITE_SITE_URL}
RUN npm run build

# --- Étape 2 : serveur statique minimal (binaire Rust sur image scratch, quelques Mo)
FROM joseluisq/static-web-server:2
COPY sws.toml /etc/sws.toml
COPY --from=build /app/dist /public
ENV SERVER_CONFIG_FILE=/etc/sws.toml
USER 65534:65534
EXPOSE 8080
