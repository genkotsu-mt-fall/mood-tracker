# FROM oven/bun:latest
FROM node:slim

# 必要なツールを追加
# procpsはNestJSのホットロードのため
# RUN apt-get update && apt-get install -y git curl unzip procps \
        # && curl -fsSL https://bun.sh/install | bash
RUN apt-get update && apt-get install -y git procps

# Safe Chain を入れてシェル連携
RUN npm i -g @aikidosec/safe-chain && safe-chain setup

# これで RUN が bash -lc に
SHELL ["/bin/bash", "-lc"]

WORKDIR /workspace