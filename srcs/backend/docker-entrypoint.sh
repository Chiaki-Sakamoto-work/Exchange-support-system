#!/bin/bash
set -e

# Rails 特有の問題: サーバーが異常終了したときに残る server.pid を削除する
if [ -f /usr/src/app/tmp/pids/server.pid ]; then
  rm -f /usr/src/app/tmp/pids/server.pid
fi

# 依存関係のチェックとインストール
if [ -f Gemfile ]; then
  bundle check || bundle install
fi

# 引数で渡されたコマンドを実行 (デフォルトは rails server)
exec "$@"
