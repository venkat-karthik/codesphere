# ── Stage 1: Build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source
COPY . .

# Build client (Vite → dist/public) + server (esbuild → dist/index.js)
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Create uploads dir for local PDF fallback
RUN mkdir -p server/uploads/pdfs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/roadmaps || exit 1

CMD ["node", "dist/index.js"]
