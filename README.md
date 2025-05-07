# タスク管理システム

シンプルで使いやすいタスク管理システムです。タスクの作成、編集、削除、ステータス管理が可能です。

![タスク管理システム](https://github.com/yasigawa/geniki_otameshi/assets/screenshots/task_management_screenshot.png)

## 機能

- タスクの作成、表示、編集、削除
- タスクステータスの管理（未着手、進行中、完了）
- タスクリストからの直接ステータス更新
- カラフルなUI
- レスポンシブデザイン

## 技術スタック

### フロントエンド
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui コンポーネント

### バックエンド
- FastAPI (Python)
- インメモリデータベース

## インストール方法

### 前提条件
- Node.js (v14以上)
- Python (v3.10以上)
- npm または yarn

### バックエンドのセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yasigawa/geniki_otameshi.git
cd geniki_otameshi

# バックエンドディレクトリに移動
cd backend/task_management_api

# 依存関係のインストール
pip install fastapi uvicorn psycopg

# サーバーの起動
python -m uvicorn app.main:app --reload
```

サーバーは http://localhost:8000 で起動します。

### フロントエンドのセットアップ

```bash
# リポジトリのルートから
cd frontend/task_management_ui

# 依存関係のインストール
npm install
# または
yarn install

# 開発サーバーの起動
npm run dev
# または
yarn dev
```

フロントエンドは http://localhost:5173 で起動します。

## 使用方法

### タスクの作成

1. 「新規タスク」ボタンをクリック
2. タイトル、説明、ステータスを入力
3. 「保存」ボタンをクリック

### タスクの編集

1. タスクカードの「編集」ボタンをクリック
2. 情報を更新
3. 「保存」ボタンをクリック

### タスクの削除

1. タスクカードの「削除」ボタンをクリック

### タスクステータスの変更

タスクカード内のステータスボタン（未着手、進行中、完了）をクリックすることで、直接ステータスを変更できます。

## API仕様

### エンドポイント

| メソッド | URL | 説明 |
|---------|-----|------|
| GET | /healthz | ヘルスチェック |
| GET | /tasks | すべてのタスクを取得 |
| POST | /tasks | 新しいタスクを作成 |
| GET | /tasks/{task_id} | 特定のタスクを取得 |
| PUT | /tasks/{task_id} | タスクを更新 |
| DELETE | /tasks/{task_id} | タスクを削除 |

### データモデル

```json
{
  "id": 1,
  "title": "プロジェクト計画",
  "description": "新しいプロジェクトの計画を立てる必要があります。",
  "status": "todo",
  "created_at": "2025-05-07T11:16:00",
  "updated_at": "2025-05-07T11:17:00"
}
```

## 注意事項

- インメモリデータベースを使用しているため、サーバー再起動時にデータは消去されます。
- 本番環境での使用には、永続的なデータベース（PostgreSQL、MySQLなど）の設定が必要です。

## 開発者向け情報

### プロジェクト構造

```
geniki_otameshi/
├── backend/
│   └── task_management_api/
│       ├── app/
│       │   ├── main.py      # FastAPIアプリケーション
│       │   ├── models.py    # データモデル
│       │   └── database.py  # データベース操作
│       └── pyproject.toml   # 依存関係
└── frontend/
    └── task_management_ui/
        ├── public/          # 静的ファイル
        ├── src/             # ソースコード
        │   ├── components/  # Reactコンポーネント
        │   ├── hooks/       # カスタムフック
        │   ├── lib/         # ユーティリティ関数
        │   └── types/       # TypeScript型定義
        ├── package.json     # 依存関係
        └── .env             # 環境変数
```

### 貢献方法

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

[MIT](https://opensource.org/licenses/MIT)
