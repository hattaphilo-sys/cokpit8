import { query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();
    return user;
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

import { mutation } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity or email
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before but perhaps they want to update their name/email?
      // For now, let's just return the existing user.
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name || user.name,
          email: identity.email || user.email, 
        });
      }
      return user._id;
    }

    // If it's a new user, create it!
    // We'll trust the first user to be Role=Client for now, 
    // real admin logic is typically "if email is @mycompany.com" or manual DB insert.
    // Let's default to "client" to be safe.
    return await ctx.db.insert("users", {
      name: identity.name || "Anonymous",
      email: identity.email!,
      clerkId: identity.subject,
      role: "client", // Default role
      avatarUrl: identity.pictureUrl,
    });
  },
});

export const setAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("setAdmin called without identity");
      return { success: false, error: "Unauthenticated" };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      console.warn("setAdmin called for non-existent user");
      return { success: false, error: "User record not found" };
    }

    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true, userId: user._id };
  },
});
