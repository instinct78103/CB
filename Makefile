#!/usr/bin/make
NODE_VER := 22
THIS_DIR := $(shell pwd)
USER := $(shell id -u)
GROUP := $(shell id -g)
HOME := /nodejs
PROJECT_NAME ?= todo
npm := docker run -it --rm \
		-p 3000:3000 \
		--name $(PROJECT_NAME) \
		-v $(THIS_DIR):/nodejs \
		-v /etc/passwd:/etc/passwd:ro \
		-v /etc/group:/etc/group:ro \
		-u $(USER):$(USER) \
		-w $(HOME)/$(PROJECT_NAME) \
		--env HOME=$(HOME) \
		node:$(NODE_VER) npm

npm-install:
	$(npm) install

npm-dev:
	$(npm) run dev -- --host 0.0.0.0 --port 3000

npm-build:
	$(npm) run build