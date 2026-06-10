FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable
RUN corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate

EXPOSE 4000

CMD ["pnpm", "dev"]
