FROM ruby:3.3-slim

# Rails開発に必要なシステムパッケージのインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev curl git pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Tokyo
ENV BUNDLE_PATH=/usr/local/bundle
WORKDIR /usr/src/app

# Gemfile, Gemfile.lock をコピーしてインストール
# (まだファイルがない場合は空のファイルを作成するか、後で rails new する)
COPY Gemfile* ./
RUN if [ -f Gemfile ]; then bundle install; fi

# Rails サーバー起動用の PID ファイル対策
RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app
USER appuser

COPY docker-entrypoint.sh /usr/local/bin/
# 権限を確実に付与（rootで実行されるため）
USER root
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
USER appuser

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0"]
