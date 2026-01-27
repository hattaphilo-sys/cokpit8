# 🗺️ Phase 2: User Experience Blueprint - Sitemap & Wireframes

## 1. Sitemap (Routes) - サイトマップ（ページ遷移）

### 🌍 Application Root (`/`)

- **LP / Login**: ログインエリア (Client / Admin 共用)
  - `POST /auth/login` (Auth provider callback)

### 👤 Client Portal (`/portal`)

- **Dashboard** (`/portal/[project_id]`):
  - **Hero**: Animated Progress Steps (Your Journey) - 5段階アニメーションステップバー
  - **Main**: Task Board (Kanban View) - ドラッグ＆ドロップ可能なカンバン
  - **Action Area**:
    - File Downloads (Deliverables) - 成果物の閲覧・ダウンロード
    - Payment Modal (Visible if Invoice Issued) - 決済ボタン（請求書発行時のみ）
  - **Details**: Task Detail Overlay (Drawer/Modal) - タスクの詳細ドロワー

### 🛠️ Admin Console (`/admin`)

- **Dashboard** (`/admin/dashboard`):
  - **Overview**: Active Projects List (Card Grid) - 全プロジェクト一覧
  - **Quick Actions**: Create New Project - 新規プロジェクト作成
- **Project Detail** (`/admin/projects/[id]`):
  - **Progress Control**: Manual Step Updater - ステップ進行の手動更新
  - **CMS**: Task Management (Kanban Editor) - タスク管理（カンバン編集）
  - **File Manager**: Upload Area (Drag & Drop) - ファイルアップロード
  - **Billing**: Invoice Generator / Payment Toggle - 請求書発行・決済トグル
- **Settings** (`/admin/settings`):
  - Profile, API Keys, General Config. - ユーザー設定、APIキー管理など。

## 2. Wireframe Concepts (Key Screens) - 画面構成案

### A. Login Screen (Entrance) - ログイン画面

- **Visual**:
  - Full-screen: **Aceternity Aurora Background**.
  - Centered Card: **Custom Glassmorphism 2.0** (Noise texture + Thin border).
  - Logo: **Aceternity Text Generate Effect**.
  - Inputs: **Custom Neon Logic** (Glow on focus).

### B. Client Dashboard (The "Stage") - クライアント向けダッシュボード

- **Global**:
  - Top Notification: **Cult UI Dynamic Island** (Status updates, Payment alerts).
- **Top (Hero)**:
  - Project Title (Large, Thin font).
  - **5-Step Progress Bar** (Aceternity styling, interactive).
- **Middle (Kanban)**:
  - Beautifully animated Kanban board.
  - Cards: **Custom Glassmorphism** with subtle glow on hover.
- **Bottom / Overlay**:
  - **Navigation**: **Aceternity Floating Dock** (Home, Chat, Files, Logout).
  - **Payment Modal**:
    - Action: **Magic UI Shimmer Button** ("Pay Now").
    - Container: **Custom Glassmorphism 2.0**.

### C. Admin Project Control (The "Cockpit") - 管理者向けプロジェクト操作

- **Main Area**:
  - **Dashboard View**: **Aceternity Bento Grid** (Project Overview).
  - **Task Management**: Drag & Drop Kanban (Custom implementation).
  - **File Upload**: **Aceternity File Upload** (Particle effect).
  - **Invoicing**: **Magic UI Shimmer Button** ("Send Invoice").

## 3. Navigation Flow (ナビゲーションフロー)

1.  **Login** -> Identify Role (Admin vs Client). - ログイン後、役割（管理者かクライアントか）を判定。
2.  **IF Admin**: Redirect to `/admin/dashboard`. - 管理者なら `/admin/dashboard` へ。
3.  **IF Client**: Redirect to `/portal/[assigned_project_id]`. - クライアントなら `/portal/[プロジェクトID]` へリダイレクト。
    - (Client is strictly scoped to their assigned project) - クライアントは自分のプロジェクト以外にはアクセス不可。
