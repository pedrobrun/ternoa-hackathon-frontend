# Update if a dependency has been changed otherwise use cached modules
FROM node:16-alpine as deps
WORKDIR /app
# libc6-compat explanation : https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# python3 make g++ explanations:
# pnpm needs node-gyp to run which has these dependencies (https://github.com/nodejs/node-gyp#installation)
# see pnpm's node-gyp commits (https://github.com/pnpm/pnpm/search?q=node-gyp&type=commits)
RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update && apk upgrade
# Copy needed files
COPY package.json pnpm-lock.yaml ./
# Install PNPM
RUN npm install -g pnpm
# Install dependencies
RUN pnpm i --frozen-lockfile

# Build the app
FROM node:16-alpine as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Run NextJS with proper user rights for security reasons
FROM node:16-alpine AS run
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

# Reduce image size as much as possible
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
