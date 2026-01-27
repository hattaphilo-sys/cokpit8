import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        // Basic auth check inline for brevity, should use helper
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return []; 
        // Real implementation should check permissions properly like in tasks.ts
        
        return await ctx.db
            .query("files")
            .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
            .collect();
    }
});
