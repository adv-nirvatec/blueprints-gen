FROM node:22-alpine AS base
WORKDIR /app

# Install all dependencies (build needs devDeps like Tailwind PostCSS)
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build

# Prune devDeps after build to keep image lean
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
