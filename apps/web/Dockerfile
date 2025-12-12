FROM node:lts-alpine AS deps
RUN apk add --no-cache curl python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

FROM node:lts-alpine AS builder
RUN apk add --no-cache curl python3 make g++
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine AS runner
RUN apk add --no-cache curl
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
