# ---- build stage ----
FROM node:22.12.0-alpine AS build
WORKDIR /app

# deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# build
COPY . .
RUN pnpm build


# ---- runtime stage ----
FROM nginx:1.27-alpine

# SPA nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
