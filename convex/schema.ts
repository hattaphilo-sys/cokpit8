import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("client")),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    clientId: v.id("users"),
    title: v.string(),
    status: v.union(
      v.literal("hearing"),
      v.literal("concept"),
      v.literal("wireframe"),
      v.literal("design"),
      v.literal("delivery")
    ),
    isPaymentPending: v.boolean(),
    createdAt: v.number(),
  }).index("by_clientId", ["clientId"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    tags: v.array(v.string()),
    dueDate: v.optional(v.number()),
  }).index("by_projectId", ["projectId"]),

  files: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    url: v.string(),
    type: v.string(),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_projectId", ["projectId"]),

  invoices: defineTable({
    projectId: v.id("projects"),
    amount: v.number(),
    currency: v.union(v.literal("jpy"), v.literal("usd")),
    stripePaymentLink: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid")),
    issuedAt: v.number(),
  }).index("by_projectId", ["projectId"]),
});
