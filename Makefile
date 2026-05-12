SHELL = bash

##----Directory Location----##
SRCDIR = ./srcs/
##--------------------------##

##------ Next.js (App) 操作 ------##
all: build up db-gene restart

build:
	cd ${SRCDIR} && docker compose build

up:
	cd ${SRCDIR} && docker compose up -d

down:
	cd ${SRCDIR} && docker compose down

# .env を書き換えた時などにサクッと再起動する用
restart:
	cd ${SRCDIR} && docker compose restart app

setup: db-gene db-migrate restart

# エラーが起きた時にログを見る用
logs:
	cd ${SRCDIR} && docker compose logs -f app

##------ Supabase 操作 (※Docker Desktop推奨) ------##
# Supabase の初期化（初回のみ）
db-setup:
	cd ${SRCDIR} && supabase init

# Supabase ローカル環境の起動
db-up:
	cd ${SRCDIR} && supabase start

# Supabase ローカル環境の停止
db-down:
	cd ${SRCDIR} && supabase stop


##------ Prisma 操作 ------##
db-gene:
	cd ${SRCDIR} && docker compose exec app npx prisma generate

db-migrate:
	cd ${SRCDIR} && docker compose exec app npx prisma migrate dev
# schema.prisma の変更をローカルDBに反映する（マイグレーション）
db-push:
	cd ${SRCDIR} && docker compose exec app npx prisma db push


##------ お掃除 ------##
# Next.jsもSupabaseも全部落として、コンテナを綺麗にする
clean: down db-down
	cd ${SRCDIR} && docker compose down -v


##------ lint & format ------##
lint:
	cd ${SRCDIR} && docker compose exec app npm run check && \
		docker compose exec app npm run typecheck

format:
	cd ${SRCDIR} && docker compose exec npm run check:fix

