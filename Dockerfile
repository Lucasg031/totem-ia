# ── Totem IA — Dockerfile para Render ────────────────────────────
# Build: frontend → backend → runtime único
# ──────────────────────────────────────────────────────────────────

# 1. Build do frontend
FROM node:20-alpine AS frontend
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-/api}
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# 2. Build do backend
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# 3. Runtime final
FROM node:20-alpine
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production

COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/node_modules ./node_modules
COPY --from=backend /app/backend/package*.json ./
COPY --from=frontend /app/frontend/dist ./frontend/dist

EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
