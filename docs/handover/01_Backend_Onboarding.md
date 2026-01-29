# 🦅 Backend Onboarding: Mock to Realtime DB

このドキュメントは、Frontend Mock実装からBackend (Convex) 実装へ移行するための引継ぎ資料です。
backend-specialist.md に従い、以下の仕様でバックエンドを構築してください。

## 1. 🎯 Objective

現在の `src/lib/mock-data.ts` を廃止し、**Convex** によるリアルタイムデータベースへ完全移行する。
Admin Portal および Client Portal の両方で、データの作成・更新が即座に反映される状態を目指す。

## 2. 💾 Database Schema (Convex)

以下のスキーマ定義（`convex/schema.ts`）を使用してください。
※ `users` テーブルには Clerk 認証用の `clerkId` (tokenIdentifier) を追加する必要があります。

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("client")),
    clerkId: v.optional(v.string()), // 認証連携用
    avatarUrl: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    clientId: v.id("users"), // Foreign Key
    title: v.string(),
    status: v.union(
      v.literal("hearing"),
      v.literal("concept"),
      v.literal("wireframe"),
      v.literal("design"),
      v.literal("delivery"),
    ),
    isPaymentPending: v.boolean(),
    createdAt: v.number(),
  }).index("by_client", ["clientId"]), // クライアントごとのプロジェクト取得用

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
    ),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
  }).index("by_project", ["projectId"]),

  files: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    category: v.union(v.literal("artifact"), v.literal("shared_file")),
    type: v.union(
      v.literal("pdf"),
      v.literal("image"),
      v.literal("video"),
      v.literal("document"),
      v.literal("other"),
    ),
    storageId: v.string(), // Convex File Storage ID
    size: v.number(),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_category", ["projectId", "category"]),
});
```

## 3. 🔑 Authentication Strategy (Clerk)

- `convex/auth.config.ts` は既に存在するか確認し、なければ作成すること。
- フロントエンドは既に `<ConvexClientProvider>` でラップされている想定だが、未実装なら `src/app/ConvexClientProvider.tsx` を作成すること。

## 4. 🚚 Migration Plan (Initial Data Seeding)

`src/lib/mock-data.ts` のデータを初期投入するための Mutation (`convex/seed.ts`) を作成し、実行してください。

1. **Create Users**: `MOCK_USERS` を元にユーザー作成。
2. **Create Projects**: 作成したUser IDを `clientId` にマッピングしてプロジェクト作成。
3. **Create Tasks**: 作成したProject IDを `projectId` にマッピングしてタスク作成。

## 5. 🛠 Implementation Steps

1. **Setup**: `npx convex dev` の実行とプロジェクト接続。
2. **Schema**: `convex/schema.ts` の実装。
3. **Auth**: Clerk連携の設定。
4. **Seed**: 初期データの投入。
5. **API**: 以下のQuery/Mutationを `convex/projects.ts`, `convex/users.ts` 等に実装。
   - `api.projects.list(userId)`: Adminは全件、Clientは自分の案件のみ。
   - `api.projects.get(projectId)`
   - `api.projects.updateStatus(projectId, status)`
   - `api.tasks.list(projectId)`
   - `api.tasks.create(projectId, ...)`

## 6. ⚠️ Critical Notes

- フロントエンドの変更（API呼び出しへの置換）は、バックエンドの実装完了後に実施するため、まずはBackend側で正常にQueryが動作することを確認してください（Convex Dashboardでの確認）。
- **File Upload** は Convex File Storage を使用しますが、手順が複雑なため、まずは Schema と通常のデータのCRUDを優先してください。
