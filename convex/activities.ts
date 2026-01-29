import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to log activities securely
export const log = internalMutation({
  args: {
    projectId: v.id("projects"),
    action: v.string(),
    entityId: v.string(),
    entityName: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activities", {
      projectId: args.projectId,
      action: args.action,
      entityId: args.entityId,
      entityName: args.entityName,
      userId: args.userId,
      createdAt: Date.now(),
    });
  },
});

export const getRecent = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const activities = await ctx.db
            .query("activities")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .order("desc")
            .take(20);

        // Enhance with user details
        const activitiesWithUser = await Promise.all(
            activities.map(async (activity) => {
                const user = await ctx.db.get(activity.userId);
                return {
                    ...activity,
                    userName: user?.name || "Unknown",
                    userAvatar: user?.avatarUrl,
                    userRole: user?.role
                };
            })
        );
        
        return activitiesWithUser;
    }
});
