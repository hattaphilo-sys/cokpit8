import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper for auth checks
async function isAuthenticated(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user) throw new Error("User not found");
    return user;
}

export const list = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        const project = await ctx.db.get(args.projectId);
        if (!project) return []; // or throw

        // Admin or Owner
        const isOwner = project.clientId === user._id;
        const isAdmin = user.role === "admin";
        
        if (!isOwner && !isAdmin) {
             throw new Error("Unauthorized");
        }

        return await ctx.db
            .query("tasks")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .collect();
    },
});

export const create = mutation({
    args: { 
        projectId: v.id("projects"),
        title: v.string(),
        status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done"))
    },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        if (user.role !== "admin") throw new Error("Admin only");

        await ctx.db.insert("tasks", {
            projectId: args.projectId,
            title: args.title,
            status: args.status,
            tags: [], // Default empty
        });
    },
});

export const update = mutation({
    args: {
        taskId: v.id("tasks"),
        patch: v.object({
            title: v.optional(v.string()),
            description: v.optional(v.string()),
            status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done"))),
            tags: v.optional(v.array(v.string())),
            dueDate: v.optional(v.number()),
        })
    },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        // Contract: "Clients are Read-Only for Tasks in Phase 1."
        if (user.role !== "admin") throw new Error("Admin only (Phase 1)");
        
        await ctx.db.patch(args.taskId, args.patch);
    }
});
