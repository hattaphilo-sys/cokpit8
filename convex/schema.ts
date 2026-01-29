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
    description: v.optional(v.string()), // 詳細説明を追加
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
    ),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    order: v.optional(v.number()), // カンバン内での並び順
  }).index("by_project", ["projectId"]),

  files: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    storageId: v.optional(v.string()), // Convex File Storage ID (Optional for links)
    url: v.optional(v.string()), // External URL (for links)
    type: v.string(), // MIME type or "link"
    size: v.optional(v.number()), // Optional for links

    
    // Categorization
    category: v.union(v.literal("general"), v.literal("artifact")),
    
    // Approval Workflow (Only for artifacts)
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    approvalInfo: v.optional(
      v.object({
        approvedBy: v.id("users"),
        approvedAt: v.number(),
        comment: v.optional(v.string())
      })
    ),

    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_category", ["projectId", "category"]),

  invoices: defineTable({
    projectId: v.id("projects"),
    amount: v.number(),
    currency: v.union(v.literal("jpy"), v.literal("usd")),
    stripePaymentLink: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid")),
    issuedAt: v.number(),
  }).index("by_projectId", ["projectId"]),

  // Activities (Audit Log)
  activities: defineTable({
    projectId: v.id("projects"),
    action: v.string(), // "task_completed", "file_uploaded", "project_status_updated", "deliverable_approved"
    entityId: v.string(), 
    entityName: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]),
});
