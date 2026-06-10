FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json ./
RUN pnpm install

COPY . .
RUN pnpm prisma generate

EXPOSE 4000

CMD ["pnpm", "dev"]
