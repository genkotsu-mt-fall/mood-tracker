FROM mcr.microsoft.com/playwright:v1.55.0-noble

# Safe Chain をインストール＆セットアップ
RUN npm i -g @aikidosec/safe-chain && safe-chain setup

# RUN で bash のログインシェルを使う
SHELL ["/bin/bash", "-lc"]

WORKDIR /workspace/frontend
