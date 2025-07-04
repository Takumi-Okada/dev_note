# Supabase セットアップガイド

このプロジェクトをSupabaseと連携させるための手順を説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 「New Project」をクリックして新しいプロジェクトを作成
3. プロジェクト名、データベースパスワードを設定

## 2. データベーステーブルの作成

Supabaseのダッシュボードで以下を実行：

1. 左サイドバーから「SQL Editor」を選択
2. `database/schema.sql`の内容をコピー&ペースト
3. 「Run」ボタンをクリックして実行

## 3. 環境変数の設定

1. Supabaseダッシュボードから「Settings」→「API」を選択
2. 以下の値をコピー：
   - Project URL
   - anon public key

3. `.env.local`ファイルを編集：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Row Level Security (RLS) 設定

個人開発アプリのため、現在は認証なしで全ての操作を許可する設定になっています。

本番環境では以下を検討してください：
- ユーザー認証の追加
- RLSポリシーの厳格化
- 非公開プロジェクトのアクセス制御

## 5. 画像ストレージ（オプション）

現在は画像URLを文字列として保存していますが、将来的にSupabase Storageを使用する場合：

1. Supabaseダッシュボードから「Storage」を選択
2. 新しいバケットを作成（例：`project-images`）
3. バケットのポリシーを設定
4. 画像アップロード機能を実装

## 6. 開発サーバーの起動

```bash
npm run dev
```

設定が正しく完了していれば、Supabaseからデータを取得・更新できるようになります。

## トラブルシューティング

### エラー: "Invalid API key"
- `.env.local`の値が正しいか確認
- 開発サーバーを再起動

### エラー: "Permission denied"
- RLSポリシーが正しく設定されているか確認
- `database/schema.sql`が正しく実行されているか確認

### データが表示されない
- データベーステーブルが正しく作成されているか確認
- ブラウザの開発者ツールでネットワークエラーを確認