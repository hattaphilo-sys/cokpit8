import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Helper for auth checks
async function isAuthenticated(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user) throw new Error("User not found");
    return user;
}

export const list = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        const project = await ctx.db.get(args.projectId);
        if (!project) return [];

        const isOwner = project.clientId === user._id;
        const isAdmin = user.role === "admin";
        
        if (!isOwner && !isAdmin) throw new Error("Unauthorized");

        return await ctx.db
            .query("tasks")
            .withIndex("by_project", (q: any) => q.eq("projectId", args.projectId))
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
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        const isOwner = project.clientId === user._id;
        const isAdmin = user.role === "admin";

        if (!isAdmin && !isOwner) throw new Error("Unauthorized");

        const taskId = await ctx.db.insert("tasks", {
            projectId: args.projectId,
            title: args.title,
            status: args.status,
            tags: [], 
            order: 0,
        });

        // Log
        await ctx.runMutation(internal.activities.log, {
            projectId: args.projectId,
            action: "task_created",
            entityId: taskId,
            entityName: args.title,
            userId: user._id,
        });

        return taskId;
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
        const task = await ctx.db.get(args.taskId);
        if (!task) throw new Error("Task not found");

        const project = await ctx.db.get(task.projectId);
        if (!project) throw new Error("Project not found");

        const isOwner = project.clientId === user._id;
        const isAdmin = user.role === "admin";
        
        if (!isAdmin && !isOwner) throw new Error("Unauthorized");
        
        await ctx.db.patch(args.taskId, args.patch);
        
        // Log
        let action = "task_updated";
        if (args.patch.status === "done" && task.status !== "done") {
             action = "task_completed";
        }
        
        await ctx.runMutation(internal.activities.log, {
            projectId: task.projectId,
            action: action,
            entityId: args.taskId,
            entityName: args.patch.title || task.title,
            userId: user._id,
        });
    }
});

export const deleteTask = mutation({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        const task = await ctx.db.get(args.taskId);
        if (!task) throw new Error("Task not found");

        const project = await ctx.db.get(task.projectId);
        if (!project) throw new Error("Project not found");

        const isOwner = project.clientId === user._id;
        const isAdmin = user.role === "admin";

        if (!isAdmin && !isOwner) throw new Error("Unauthorized");

        await ctx.db.delete(args.taskId);

        // Log
        await ctx.runMutation(internal.activities.log, {
            projectId: task.projectId,
            action: "task_deleted",
            entityId: args.taskId,
            entityName: task.title,
            userId: user._id,
        });
    }
});
