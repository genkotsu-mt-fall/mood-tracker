# MoodTracker Backend

## プロジェクト概要

投稿ごとに「誰に見せるか」を細かく決められる、軽量なSNSです。  
フォロー関係や鍵アカだけでは表現しきれない現実の人間関係・環境を反映できます。  
各投稿には気持ちを示す絵文字と、感情の浮き沈みを％で添えられ、受け手に文脈が伝わりやすくなります。  
SNS疲れを抑え、“自分を見つめ直す”ためのデジタルデトックスできるSNSを目指します。

## 特徴・ハイライト

- 投稿ごとに閲覧範囲を細かく設定可能
- 投稿に絵文字・感情パーセンテージを付与
- 文脈を意識したSNS体験
- いいねや共感よりも「自分を見つめ直す」ことを重視

## 技術スタック

- **フレームワーク**: NestJS 11
- **言語/ツール**: TypeScript 5, SWC, ts-node, ts-loader, tsconfig-paths
- **認証**: Passport (local/JWT), bcrypt, uuid
- **DB/ORM**: Prisma 6 (`prisma`, `@prisma/client`)
- **バリデーション**: class-validator, class-transformer, zod
- **ドキュメント**: @nestjs/swagger (OpenAPI 3)
- **ユーティリティ**: dotenv, reflect-metadata, rxjs
- **テスト**: Jest + ts-jest, supertest, @nestjs/testing
- **Lint/Format**: ESLint, Prettier

## リポジトリ構成

```text
backend/
  src/                     # アプリ本体（NestJS）
  prisma/                  # Prisma スキーマ・マイグレーション
  test/                    # E2E テストとテスト用ユーティリティ
  docker-compose.e2e.yml   # E2E 用 Docker
  Dockerfile.e2e           # E2E 用 Dockerfile
  .env                     # 環境変数（ローカル）
  .env.test                # テスト用環境変数
```

## アーキテクチャ概要

Controller（入出力・バリデーション）
→ UseCase（ドメインロジック）
→ Repository（Prisma 経由で永続化）
補助: Guard（認可）/ Validator（入力検証）/ Mapper（DTO変換）/ Type（型）

## 主要モジュール

- Auth: 認証/認可、現在ユーザー取得・更新
- User: 他ユーザーの参照
- Post: 投稿の作成/更新/削除
- PostQuery: 可視性を加味した投稿一覧/詳細の取得
- Follow: フォロー関係の作成/取得/削除
- UserFollow: ユーザー単位の followers / following 取得
- Group: 任意の閲覧グループ（作成/更新/削除/参照）
- GroupMember: グループへのユーザー追加/参照/削除
- UserGroup: 自分が所有するグループ一覧
- Visibility: 投稿の公開範囲ロジックまとめ
- Common: 共通DTO/Swagger/例外ハンドリング 等

## 設計方針・トレードオフ

- ドメイン循環参照を避けるため中間ドメインを設置し、責務分離を徹底
- 制約/前提条件や採用理由・代替案は随時READMEに追記

### 前提環境

- Dockerインストール済み
- 現状はVSCodeのdevcontainerでのみ動作（今後docker-compose追加予定）

### セットアップ手順

```bash
cd backend

# 依存インストール
npm ci

# DB スキーマ
npx prisma migrate deploy
npx prisma generate

# 開発起動
npm run start:dev
# Swagger: http://localhost:3000/api

```

## 環境変数

### 必須/任意一覧（`.env.example`）

.env.example

```env
DATABASE_URL="postgresql://user:pass@db:5432/moodtracker_db"
JWT_SECRET="super-secret-key"
JWT_EXPIRES_IN="3600s"
```

.env.test.example (E2Eテスト用)

```env
DATABASE_URL="postgresql://user_test:pass_test@backend-e2e-db:5432/moodtracker_db_test"
POSTGRES_USER="user_test"
POSTGRES_PASSWORD="pass_test"
POSTGRES_DB="moodtracker_db_test"
JWT_SECRET="super-secret-key_test"
JWT_EXPIRES_IN="3600s"
```

※devcontainer起動用に .env と .env.test も必要。二重管理のため今後改善予定。

## 実行スクリプト

```bash
npm run test
npm run test:e2e
```

## API ドキュメント

- Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)
- OpenAPI JSON: [http://localhost:3000/api-json](http://localhost:3000/api-json)

## 共通仕様

### 成功レスポンス

```json
{
  "success": true,
  "data": T | T[],
  "meta"?: {
    "page": number,
    "pageSize": number,
    "hasNext": boolean,
    "total"?: number
  }
}
```

### エラー形式

```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "fields"?: {
      "email": string[]
    },
    "details"?: string
  }
}
```

## 認証・認可

- JWT方式（今後拡張予定）

## 主要エンドポイント

> **共通**
> Base URL: `http://localhost:3000` / 認証: JWT（`Authorization: Bearer <token>`）
> ページング: `page`（1〜）, `limit`（1〜100）
> レスポンスは共通フォーマット（`success`, `data`, `meta?` / エラーは `success: false`, `error`）。詳細は Swagger を参照。

### Auth / Me

| メソッド | パス                       | 概要                                         | 認証 |
| -------- | -------------------------- | -------------------------------------------- | ---- |
| POST     | `/auth/signup`             | ユーザー新規登録                             | なし |
| POST     | `/auth/login`              | ログインしてアクセストークン取得             | なし |
| GET      | `/auth/me`                 | カレントユーザー取得                         | 🔒   |
| PUT      | `/auth/me`                 | カレントユーザー更新                         | 🔒   |
| GET      | `/auth/me/posts`           | 自分の投稿（ページング）                     | 🔒   |
| GET      | `/auth/me/following/posts` | 自分がフォロー中ユーザーの投稿（ページング） | 🔒   |
| GET      | `/auth/me/followers`       | 自分をフォローしているユーザー一覧           | 🔒   |
| GET      | `/auth/me/following`       | 自分がフォローしているユーザー一覧           | 🔒   |
| GET      | `/auth/me/groups`          | 自分が所有するグループ一覧                   | 🔒   |

### User

| メソッド | パス                   | 概要                                                 | 認証 |
| -------- | ---------------------- | ---------------------------------------------------- | ---- |
| GET      | `/user/{id}`           | 指定ユーザー取得                                     | 🔒   |
| GET      | `/user/{id}/posts`     | 指定ユーザーの投稿（閲覧権限でフィルタ、ページング） | 🔒   |
| GET      | `/user/{id}/followers` | 指定ユーザーのフォロワー一覧                         | 🔒   |
| GET      | `/user/{id}/following` | 指定ユーザーがフォローしているユーザー一覧           | 🔒   |

### Post / PostQuery

| メソッド | パス         | 概要                                   | 認証 |
| -------- | ------------ | -------------------------------------- | ---- |
| POST     | `/post`      | 投稿作成（感情・絵文字・公開設定など） | 🔒   |
| GET      | `/post`      | 自分に可視な投稿一覧（ページング）     | 🔒   |
| GET      | `/post/{id}` | 投稿詳細（可視な場合のみ）             | 🔒   |
| PUT      | `/post/{id}` | 投稿更新（**所有者のみ**）             | 🔒   |
| DELETE   | `/post/{id}` | 投稿削除（**所有者のみ**）             | 🔒   |

### Follow

| メソッド | パス           | 概要                               | 認証 |
| -------- | -------------- | ---------------------------------- | ---- |
| POST     | `/follow`      | フォロー作成（フォロー関係を張る） | 🔒   |
| GET      | `/follow/{id}` | フォロー関係の取得                 | 🔒   |
| DELETE   | `/follow/{id}` | フォロー関係の削除                 | 🔒   |

### Group / GroupMember

| メソッド | パス                  | 概要                           | 認証 |
| -------- | --------------------- | ------------------------------ | ---- |
| POST     | `/group`              | グループ作成                   | 🔒   |
| GET      | `/group/{id}`         | グループ取得                   | 🔒   |
| PUT      | `/group/{id}`         | グループ更新（**所有者のみ**） | 🔒   |
| DELETE   | `/group/{id}`         | グループ削除（**所有者のみ**） | 🔒   |
| GET      | `/group/{id}/members` | グループのメンバー一覧取得     | 🔒   |
| POST     | `/group-member`       | グループにメンバー追加         | 🔒   |
| GET      | `/group-member/{id}`  | グループメンバー情報取得       | 🔒   |
| DELETE   | `/group-member/{id}`  | グループメンバー削除           | 🔒   |

### その他

| メソッド | パス | 概要                              | 認証 |
| -------- | ---- | --------------------------------- | ---- |
| GET      | `/`  | シンプルな疎通/ヘルスチェック用途 | なし |

**補足**

- ページング系エンドポイントは `data: Post[]` と `meta: { page, pageSize, hasNext, total? }` を返します。
- 投稿作成・更新のボディには、`mood`, `intensity`, `emoji`, `privacyJson`, `crisisFlag` などを指定可能です。`crisisFlag` は必須。
- エラーは主に `400 Bad Request` / `401 Unauthorized` / `403 Forbidden` / `404 Not Found` を想定（`error.code` は `BAD_REQUEST` / `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` 等）。

## テスト戦略

- 初期段階はCRUD等のE2Eテスト中心
- ビジネスロジックが複雑化した段階で単体/結合テスト追加予定
- PostQueryドメインは重点的に単体・結合テスト実施
- E2Eテストはユーティリティやユースケースを活用し、シナリオ再現性・保守性を向上
