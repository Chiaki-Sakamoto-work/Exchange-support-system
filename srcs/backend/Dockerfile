FROM ruby:3.3-slim

RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev libyaml-dev libvips curl git pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Tokyo
ENV BUNDLE_PATH=/usr/local/bundle
WORKDIR /usr/src/app

COPY Gemfile* ./
RUN bundle install

RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app
USER appuser

COPY docker-entrypoint.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
USER appuser

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
