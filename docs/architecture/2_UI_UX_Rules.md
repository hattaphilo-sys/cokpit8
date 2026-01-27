# 🎨 Phase 2: User Experience Blueprint - Design Rules

## 1. Core Visual Concept (デザインコンセプト)

**Theme**: "Futuristic Elegance & Kinetic Feedback" (未来的優雅さと動的なフィードバック)

- **Colors**: Deep Midnight Blue / Black gradients (背景：真夜中の青から黒へのグラデーション), Neon Cyan/Electric Purple (アクセント：ネオンシアン、エレクトリックパープル).
- **Materials**: Glassmorphism (すりガラスのようなぼかしと白の不透明度), Brushed Metal textures (ヘアライン加工された金属感).
- **Motion**: "Nuru-nuru" (Fluid, 60fps). ぬるぬるとした液体のような動き。ホバー、クリック、ロードなど、あらゆるインタラクションに対して必ず反応（フィードバック）を返すこと。
- **Typography**: Clean Sans-serif (Inter等を想定), Monospaced (データ表示には等幅フォントを使用).

## 2. Design Principles (デザイン原則)

1.  **Immersive First (没入感ファースト)**:
    - Admin Panelは単なる管理画面ではなく「コックピット」。
    - Client Dashboardは単なる確認画面ではなく、プロジェクトが演じられる「ステージ」。
2.  **Feedback Loop (即時フィードバック)**:
    - ユーザーのアクションには即座に、かつ満足感のある視覚的反応を返す（例：クリック時のボタンの発光、タスク完了時の紙吹雪エフェクトなど）。
3.  **Hierarchy by Light (光による優先順位)**:
    - 単にサイズや色だけでなく、光の効果（グロー、影）を使ってユーザーの視線を誘導する。重要な要素は「光らせる」。

## 3. Component Usage Guide (コンポーネント使用ガイド)

### Library x Custom Hybrid Strategy (ライブラリ×独自実装のハイブリッド戦略)

「既存ライブラリの最高のエフェクト」と「独自の美的センス」を融合させ、量産型ではないオリジナルの世界観を構築します。

#### A. Hero Components (Library Powered)

複雑なアニメーションや3D表現は、以下のライブラリを適材適所で採用し、「Wow」を確実に演出します。

1.  **The Atmosphere: Aurora Background** (Aceternity UI) - [Global]
    - ログイン画面やダッシュボードの背景に、深海のような揺らぎを与えます。
2.  **The Intelligence: Dynamic Island** (Cult UI) - [Global]
    - 非同期通信（保存、決済、ロード）の状態を、邪魔なモーダルではなく「賢い通知」として処理します。
3.  **The Cockpit: Bento Grid** (Aceternity UI) - [Admin]
    - プロジェクト一覧などの情報密度が高い画面を、Appleの広報素材のように美しく整理します。
4.  **The Navigation: Floating Dock** (Aceternity UI) - [Client]
    - クライアントが最も触れるナビゲーションに、macOSのような流体的な遊び心を加えます。
5.  **The Trigger: Shimmer Button** (Magic UI) - [Global]
    - 絶対に押してほしいボタン（決済、承認）のみに使用し、視線を強制的に誘導します。
6.  **The Interaction: File Upload** (Aceternity UI) - [Admin/Client]
    - ファイルをドラッグした瞬間にパーティクルが舞うような、リッチなアップロード体験を提供します。

#### B. Custom Design System (Original Implementation)

ライブラリに依存しない部分は、Tailwind CSS + Framer Motion で以下の「独自ルール」を徹底し、全体の統一感を作ります。

- **Glassmorphism 2.0**:
  - 単純なぼかしだけでなく、`backdrop-filter: blur(20px)` にノイズテクスチャと極細のホワイトボーダー(`1px solid rgba(255,255,255,0.1)`)を重ね、物理的なガラスの質感を再現します。
- **Neon Logic**:
  - 通常時は「光らせない」。ホバー時やアクティブ時のみ、`box-shadow` と `text-shadow` を同期させて「通電」したかのようなネオン発光表現を行います。
- **Input / Form Fields**:
  - 既製品は使いません。フォーカスするとラインが走る、入力完了するとチェックマークが弾けるなど、入力体験自体がエンタメになる独自のフォームコンポーネントを実装します。

### Micro-Interactions (マイクロインタラクション)

- **Hover**: わずかに拡大(1.02倍)し、強く発光させる。
- **Transition**: ページ遷移はスムーズに（フェードイン、下からのスライドアップ）。
- **Loading**: 単なる回転スピナーではなく、スケルトンスクリーン＋呼吸するようなグローエフェクトを使用。

## 4. Layout Structure (レイアウト構造)

- **Global**:
  - **Dashboard (Grid-based)**:
    - **Hero Section**: 進捗ステップバー（Progress Step Bar）。画面の中で最も支配的なビジュアル要素。
    - **Main Content**: カンバンボード（必要に応じて横スクロール）。
    - **Sidebar/Panel**: 詳細情報、チャット、ファイルリストなど。

## 5. Dark Mode Strategy (ダークモード戦略)

- **Default**: Dark Mode（デフォルトはダークモード）。SF的な世界観を構築するため。
- **Light Mode**: オプションとしてサポート。Appleのようなハイコントラストでクリーンな白/グレーの美学を採用しつつ、アクセントカラーで「テック感」を残す。
