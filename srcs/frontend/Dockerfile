FROM node:24-slim

ENV TZ=Asia/Tokyo

WORKDIR /usr/src/app

COPY package*.json .

RUN --mount=type=cache,target=/root/.npm \
  npm ci

RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app
USER appuser

COPY docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dev"]
