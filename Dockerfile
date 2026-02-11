# ---- build stage ----
FROM node:22.12.0-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm build:ssr


# ---- runtime stage ----
FROM node:22.12.0-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --no-frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

EXPOSE 3000

CMD ["node", "server/index.js"]
