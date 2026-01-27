# 🔭 Phase 1: Project Vision & Scope

## 1. Project Overview

**Project Name**: C0KPIT (Temporary Code Name)
**Concept**: "The Ultimate Delivery Experience"
クライアントの思想・哲学・アイデアを2時間で形にするデザインセッションの「納品場所」であり、それ自体が最強の「ポートフォリオ」兼「クロージングツール」となる、極上のプロジェクトダッシュボード。

## 2. Core Value (Why we build this)

- **Emotional Impact (The "Wow" Factor)**:
  - クライアントに「まじかよ。俺もこれ欲しい。」と言わせる圧倒的なビジュアル品質。
  - 未来的・SF的・ラグジュアリーな世界観で、提供するサービスの付加価値を最大化する。
- **Trust & Assurance**:
  - 認証、決済、タスク管理が「実際に動いている」ことを見せつけ、技術力への信頼を勝ち取る。
- **Seamless Delivery**:
  - 成果物（仕様書・UIプロトタイプ）をスムーズに共有し、ネクストアクション（決済など）へ誘導する。

## 3. Target User & Persona

- **Admin (Service Provider)**:
  - **Goal**: プロジェクトの進行管理、成果物のアップロード、請求・決済の管理をストレスなく行いたい。
  - **Needs**: 直感的な管理画面、自由度の高いCMS機能。
- **Client (Service Receiver)**:
  - **Goal**: 自分のアイデアが形になっていく過程を確認し、安心感と高揚感を得たい。
  - **Needs**: 美しい進捗表示、分かりやすいタスク確認、スムーズな支払体験。

## 4. Key Features (Scope)

- **Authentication & Role Management**:
  - Secure Login (Auth)
  - Role Separation (Admin vs Client)
- **Client Dashboard (The "Stage")**:
  - **Visual Progress**: 進捗確認ステップバー（Animated/Interactive/5 Steps）。
  - **Kanban Board**: Drag & Drop可能なタスクボード。詳細（期限、コメント、タグ）へのアクセス。
  - **Deliverables**: ファイルのダウンロード、クイックプレビュー、URL共有。
  - **Payment Integration**: Adminが請求書発行時のみ出現する決済ボタンとモーダル。

* **Admin Console (The "Control Room")**:
  - **Project Management**: 新規作成（**要メールアドレス登録**）、削除、クライアント名・プロジェクト名変更。
    - ※ Adminが登録したメールアドレスのみでClientはログイン可能（招待制運用）。

- **Progress Control**: ステップバーの手動更新。
- **Task & File Management**: タスク追加・削除、ファイルアップロード・削除。
- **Billing**: 請求書発行、決済機能のトグル。
- **Memo**: 管理者用メモ機能。
- **General**:
  - Light/Dark Mode (基本はDark推奨だが切り替え対応)

## 5. Design Philosophy (Aesthetic Direction)

- **Keywords**: Futuristic, SF, Mechanic, Digital, Neon/Beam, Glassmorphism, Luxury, "Nuru-nuru" (Liquid Motion).
- **Reference Libraries**: Aceternity UI, Magic UI, Build UI, Cult UI, Vaul.
- **Animation Tools**: Rive, Spline, Lottie, GSAP, Framer Motion.
