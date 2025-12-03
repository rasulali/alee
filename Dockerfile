FROM oven/bun:1.3.3 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM oven/bun:1.3.3 AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000

COPY --from=builder /app ./

EXPOSE 8000

CMD ["bun", "run", "start"]
