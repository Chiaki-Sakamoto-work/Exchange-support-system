FROM node:22-slim

ENV TZ=Asia/Tokyo

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl  openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json .

RUN --mount=type=cache,target=/root/.npm \
  npm ci

RUN chown -R node:node /usr/src/app
USER node

COPY docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

