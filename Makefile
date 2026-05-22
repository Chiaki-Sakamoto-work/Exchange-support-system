SHELL = zsh

RED    := \033[31m
ORANGE := \033[38;5;208m
YELLOW := \033[33m
GREEN  := \033[32m
CYAN   := \033[36m
BLUE   := \033[34m
PURPLE := \033[35m
RESET  := \033[0m

##----Directory Location----##
SRCDIR = ./srcs/
##--------------------------##

##------ Next.js (App) 操作 ------##
.PHONY: all build up down restart setup logs
all: build up restart art

build:
	cd ${SRCDIR} && docker compose build

up:
	cd ${SRCDIR} && docker compose up -d

down:
	cd ${SRCDIR} && docker compose down

# .env を書き換えた時などにサクッと再起動する用
restart:
	cd ${SRCDIR} && docker compose restart app

setup: db-migrate restart

# エラーが起きた時にログを見る用
logs:
	cd ${SRCDIR} && docker compose logs -f app


##------ Supabase 操作 (※Docker Desktop推奨) ------##
.PHONY: db-setup db-up db-down

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
.PHONY: db-migrate db-reset

db-migrate:
	cd ${SRCDIR} && docker compose exec app npx prisma migrate dev
	# schema.prisma の変更をローカルDBに反映する（マイグレーション）

db-reset:
	cd ${SRCDIR} && docker compose exec app npx prisma migrate reset


##------ お掃除 ------##
.PHONY: clean

# Next.jsもSupabaseも全部落として、コンテナを綺麗にする
clean: down db-down
	cd ${SRCDIR} && docker compose down -v


##------ lint & format ------##
.PHONY: lint format

lint:
	cd ${SRCDIR} && docker compose exec app npm run check && \
		docker compose exec app npm run typecheck

format:
	cd ${SRCDIR} && docker compose exec app npm run check:fix


##------ アスキーアート ------##
.PHONY: art

art:
	@echo "$(RED)                                        $(RESET)"
	@echo "$(ORANGE) __                 __                  $(RESET)"
	@echo "$(YELLOW)/\\_\\    ___    ___ /\\_\\    ___    ___   $(RESET)"
	@echo "$(GREEN)/\\/ \\  /'___\\ / __\`/\\/ \\  /'___\\ / __\` $(RESET)"
	@echo "$(CYAN) \\ \\ \\/\\ \\__//\\ \\L\\ \\ \\ \\/\\ \\__//\\ \\L\\ \\ $(RESET)"
	@echo "$(BLUE)  \\ \\_\\ \\____\\ \\____/\\ \\_\\ \\____\\ \\____/$(RESET)"
	@echo "$(PURPLE)   \\/_/\\/____/\\/___/  \\/_/\\/____/\\/___/ $(RESET)"
