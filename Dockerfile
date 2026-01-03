# ---- build stage ----
FROM node:22.12.0-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


# ---- runtime stage ----
FROM node:22.12.0-alpine
WORKDIR /app

# lightweight static file server
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
