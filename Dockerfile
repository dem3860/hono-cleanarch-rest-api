FROM node:20-bullseye AS builder
WORKDIR /app

COPY . ./
RUN npm ci
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20-bullseye AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/package.json ./package.json
COPY --from=builder --chown=hono:nodejs /app/prisma ./prisma

USER hono
EXPOSE 8787

CMD ["node", "/app/dist/src/index.js"]
