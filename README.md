## クリーンアーキテクチャで REST API を実装してみる

このプロジェクトでは、Hono + Prisma + neverThrow を用いてイベントの CRUD を実装し、クリーンアーキテクチャに基づいた設計を体験・学習します。  
また、業務で gRPC や GraphQL を使用する機会があったため、それらと REST API の設計・依存関係の違いを比較する目的も含まれています。

---

### 起動方法

1. `.env.example` を `.env` にコピーする

2. パッケージのインストール

```bash
npm install
```

3. Docker で PostgreSQL と API を起動

```bash
docker compose up
```

これで開発環境が立ち上がります。

---

### 初期データ

初期データ投入スクリプトは `seed.ts` にあります。

以下を実行してください：

```bash
npm run seed
```

---

### ディレクトリ構成

```
src/
├── adapter/                 # 外部との接点。HTTPハンドラやDB接続など
│   ├── handler/             # Hono を使ったルーティング、リクエスト処理
│   ├── repository/          # Prisma を使ったDBアクセスの実装
│   └── schema/              # Zod によるAPIの入出力スキーマ定義（OpenAPI連携）
│
├── domain/                  # アプリケーションの中心的なビジネスルール
│   ├── entity/              # Entity（ドメインモデル）
│   ├── constructor/         # Entityの生成・バリデーションロジック
│
├── useCase/                 # ユースケースの実装（ビジネスロジックの具体化）
│   ├── inputPort/           # ユースケースを外部に公開するインターフェース
│   ├── outputPort/          # ユースケースが依存する外部との接点（Repositoryなど）のインターフェース
│   └── interactor/          # ユースケースの実装クラス（Interactor）
│
├── type.ts                  # Hono の Context に渡す型（AppType）など
└── index.ts                 # エントリーポイント（サーバー起動）
```

---

### クリーンアーキテクチャにおける interface の役割

本プロジェクトでは、責務ごとの依存関係の分離を意識し、interface（Port）を使って依存性逆転の原則を実現しています。

- InputPort：handler から usecase（ユースケース）を呼び出すためのインターフェース
- OutputPort：usecase から DB（Prisma）などの外部リソースを操作するためのインターフェース

これにより、ビジネスロジック（Interactor）は技術的な実装に依存せず、テストや拡張が容易になります。

---

### SOLID 原則との対応

- **単一責任の原則**：handler, interactor, repository, schema など各層で責務が明確に分離されています。
- **オープン・クローズド原則**：Interactor や Repository の実装を差し替えても他層に影響を与えずに拡張できます。
- **リスコフの置換原則**：IEventRepository や IEventUseCase などのインターフェースを満たす実装であれば入れ替え可能です。
- **インターフェース分離の原則**：必要最小限のメソッドのみを持つ小さなインターフェースに分離されています。
- **依存関係逆転の原則**：Interactor は実装ではなく抽象（OutputPort）に依存し、adapter 層が依存を注入します。

---

### 参考資料

- https://hono.dev/examples/zod-openapi
- https://zenn.dev/praha/articles/d1d6462a27e37e
