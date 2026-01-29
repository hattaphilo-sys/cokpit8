import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// --- Helpers ---
async function isAuthenticated(ctx: { auth: { getUserIdentity: () => Promise<any> }, db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

// --- Queries ---

// api.projects.list(userId?: Id<"users">)
export const list = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const user = await isAuthenticated(ctx);

    if (user.role === "admin") {
      if (args.userId) {
        // Admin filtering by specific user
        return await ctx.db
          .query("projects")
          .withIndex("by_client", (q) => q.eq("clientId", args.userId!))
          .collect();
      } else {
        // Admin viewing all
        return await ctx.db.query("projects").collect();
      }
    } else {
      // Client: Can only see own projects
      // We ignore args.userId or could error if they try to see others, but returning own is safer/easier default
      return await ctx.db
        .query("projects")
        .withIndex("by_client", (q) => q.eq("clientId", user._id))
        .collect();
    }
  },
});

// api.projects.get(projectId)
export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await isAuthenticated(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project) return null;

    if (user.role !== "admin" && project.clientId !== user._id) {
      throw new Error("Unauthorized");
    }

    return project;
  },
});

// --- Mutations ---

export const create = mutation({
  args: { title: v.string(), clientEmail: v.string() },
  handler: async (ctx, args) => {
    const requester = await isAuthenticated(ctx);
    if (requester.role !== "admin") throw new Error("Admin only");

    // Find or Invite User
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.clientEmail))
      .first();

    if (!user) {
        // Create placeholder user (invited)
        // clerkId is optional now in schema, so we can omit it or use undefined
        const userId = await ctx.db.insert("users", {
            email: args.clientEmail,
            role: "client",
            name: "Invited Client",
            avatarUrl: "",
            // clerkId left undefined
        });
        user = (await ctx.db.get(userId))!;
    }
    
    const projectId = await ctx.db.insert("projects", {
      clientId: user._id,
      title: args.title,
      status: "hearing",
      isPaymentPending: false,
      createdAt: Date.now(),
    });

    // Trigger n8n
    await ctx.scheduler.runAfter(0, internal.actions_n8n.sendProjectCreatedWebhook, {
        email: args.clientEmail,
        projectId: projectId,
        inviteUrl: "https://tbd.com", // This should probably be generated dynamically
    });

    return projectId;
  },
});

export const updateStatus = mutation({
    args: { 
        projectId: v.id("projects"), 
        status: v.union(
            v.literal("hearing"),
            v.literal("concept"),
            v.literal("wireframe"),
            v.literal("design"),
            v.literal("delivery")
        ) 
    },
    handler: async (ctx, args) => {
      const user = await isAuthenticated(ctx);
      if (user.role !== "admin") throw new Error("Admin only");
      
      await ctx.db.patch(args.projectId, { status: args.status });

      // Log Activity
      await ctx.runMutation(internal.activities.log, {
        projectId: args.projectId,
        action: "project_status_updated",
        entityId: args.projectId,
        entityName: `Status changed to ${args.status.toUpperCase()}`,
        userId: user._id,
      });
    },
  });
