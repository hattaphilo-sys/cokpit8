---
name: deploy-vercel-github
description: Vercelに新しいプロジェクトをGitHubからインポートしてデプロイする手順
---

# Vercel Deployment via GitHub

GitHubリポジトリをソースとしてVercelにこのプロジェクトをデプロイするための手順です。

## 1. 前提条件

- リポジトリがGitHubにプッシュされていること
- Vercelアカウントが必要
- 必要な環境変数（`.env.local`）の値が手元にあること

## 2. デプロイ手順

### ステップ 1: 新規プロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Add New..." -> "Project" をクリック
3. "Import Git Repository" で対象のリポジトリ（例: `cokpit8`）を見つけて "Import" をクリック

### ステップ 2: プロジェクト設定

1. **Project Name**: 任意の名前（デフォルトでリポジトリ名）
2. **Framework Preset**: `Next.js` が自動選択されていることを確認
3. **Root Directory**: 通常はデフォルト（`./`）のまま

### ステップ 3: 環境変数の設定 (Environment Variables)

`.env.local` にある重要な変数をすべて追加します。
特に以下の変数は必須です：

- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

※ 値はプレースホルダーではなく、実際のキーを入力してください。

### ステップ 4: デプロイ実行

1. "Deploy" ボタンをクリック
2. ビルドが完了するまで待機（通常1〜2分）
3. エラーが出た場合はログを確認し、修正して `git push` すれば自動再デプロイされます

## 3. トラブルシューティング

### ビルドエラー (TypeScript/ESLint)

Vercelのビルドプロセスは `next build` を実行します。
ローカルで `npm run build` を実行し、事前にエラーがないか確認してください。
よくあるエラー：

- `Implicit any` 型エラー
- 未使用の変数（ESLint）
- コンポーネントの型不整合

### 環境変数関連のエラー

環境変数が不足していると、ビルド時または実行時にエラーになります。
Convexを使用する場合、ビルド時にもConvexへの接続が必要な場合があります。
