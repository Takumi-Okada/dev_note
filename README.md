# DevNote - 個人開発プロジェクトポートフォリオ

個人開発者向けのポートフォリオアプリケーション。開発したプロジェクトを整理・公開し、技術力をアピールできるプラットフォームです。

## 特徴

- **プロジェクト管理**: 開発プロジェクトの一元管理
- **画像管理**: 複数画像のアップロード・表示
- **マークダウン対応**: リアルタイムプレビュー付きエディター
- **管理者認証**: パスワード保護された管理画面
- **SEO最適化**: OGP・Twitter Card対応
- **レスポンシブデザイン**: モバイル対応

## 技術スタック

- **フロントエンド**: Next.js 15.3.4, React 19, TypeScript
- **スタイリング**: Tailwind CSS 4
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **デプロイ**: Vercel

## プロジェクト構成

```
├── app/                    # Next.js App Router
│   ├── admin/             # 管理者画面
│   ├── projects/          # プロジェクト詳細ページ
│   └── api/               # API Routes
├── components/            # 共通コンポーネント
├── lib/                   # API・ユーティリティ
├── types/                 # TypeScript型定義
└── public/               # 静的ファイル
```

## 使用方法

### 公開サイト
- `/` - ポートフォリオ一覧
- `/projects/[id]` - プロジェクト詳細

### 管理画面
- `/admin` - 管理者ダッシュボード
- `/admin/projects` - プロジェクト管理
- `/admin/projects/new` - 新規プロジェクト作成
- `/admin/projects/[id]/edit` - プロジェクト編集
