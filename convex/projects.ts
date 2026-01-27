import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// --- Helpers ---
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user || user.role !== "admin") throw new Error("Unauthorized: Admin only");
  return user;
}

// --- Queries ---
export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("projects").collect();
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    // Check requester
    const requester = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
        .unique();
    if (!requester) return null;

    // Allow Admin or the user themselves
    if (requester.role !== "admin" && requester._id !== args.userId) {
        throw new Error("Unauthorized");
    }

    // Fetch project
    const project = await ctx.db
      .query("projects")
      .withIndex("by_clientId", (q: any) => q.eq("clientId", args.userId))
      .first(); // Assuming 1 project per client for now based on contract return type
      
    return project;
  },
});

// --- Mutations ---
export const create = mutation({
  args: { title: v.string(), clientEmail: v.string() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    // Find or Invite User
    let user = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.clientEmail))
      .first();

    if (!user) {
        // Create placeholder user
        // Note: clerkId is required. We use a temp placeholder until they sign up/we link them.
        const tempClerkId = `invited_${Date.now()}`;
        const userId = await ctx.db.insert("users", {
            clerkId: tempClerkId,
            email: args.clientEmail,
            role: "client",
            name: "Invited Client",
            avatarUrl: "",
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
    // We use internal scheduler to call the action
    await ctx.scheduler.runAfter(0, internal.actions_n8n.sendProjectCreatedWebhook, {
        email: args.clientEmail,
        projectId: projectId,
        inviteUrl: "https://tbd.com",
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
      await requireAdmin(ctx);
      await ctx.db.patch(args.projectId, { status: args.status });
    },
  });
