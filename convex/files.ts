import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Helper for auth checks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isAuthenticated(ctx: { auth: { getUserIdentity: () => Promise<any> }, db: any }) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
        .query("users")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
        .unique();
    if (!user) throw new Error("User not found");
    return user;
}

// 1. Generate Upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  await isAuthenticated(ctx);
  return await ctx.storage.generateUploadUrl();
});

// 2. Save File Metadata
export const saveFile = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    storageId: v.optional(v.string()), // Optional for links
    url: v.optional(v.string()), // Optional for links
    type: v.string(),
    size: v.optional(v.number()), // Optional for links
    category: v.union(v.literal("general"), v.literal("artifact")),
  },
  handler: async (ctx, args) => {
    const user = await isAuthenticated(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const isAdmin = user.role === "admin";
    const isOwner = project.clientId === user._id;

    // Authorization Logic
    if (args.category === "artifact") {
      // Artifacts can ONLY be uploaded by Admin
      if (!isAdmin) throw new Error("Only admins can upload artifacts.");
    } else {
      // General files can be uploaded by Admin or Project Owner
      if (!isAdmin && !isOwner) throw new Error("Unauthorized to upload files.");
    }

    const fileId = await ctx.db.insert("files", {
      ...args,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
      // Initial status for artifacts
      status: args.category === "artifact" ? "pending" : undefined,
    });

    // Log
    await ctx.runMutation(internal.activities.log, {
        projectId: args.projectId,
        action: "file_uploaded",
        entityId: fileId,
        entityName: args.name,
        userId: user._id,
    });

    return fileId;
  },
});

// 3. List Files (with URL generation)
export const list = query({
  args: { 
    projectId: v.id("projects"),
    category: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const user = await isAuthenticated(ctx);
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    // Auth check: Admin or Owner
    const isAdmin = user.role === "admin";
    const isOwner = project.clientId === user._id;
    if (!isAdmin && !isOwner) throw new Error("Unauthorized");

    let files;
    if (args.category) {
      files = await ctx.db
        .query("files")
        .withIndex("by_category", (q) => 
          q.eq("projectId", args.projectId).eq("category", args.category as "general" | "artifact")
        )
        .collect();
    } else {
      files = await ctx.db
        .query("files")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect();
    }

    // Generate signed URLs for all files
    return await Promise.all(
      files.map(async (file) => {
        let url = file.url;
        // Check if storageId is a valid look-alike (not a mock path or relative URL)
        if (file.storageId && !file.storageId.startsWith("/") && !file.storageId.includes(".")) {
          try {
            const storageUrl = await ctx.storage.getUrl(file.storageId);
            if (storageUrl) url = storageUrl;
          } catch (e) {
            console.warn(`Failed to get URL for storageId: ${file.storageId}, using fallback.`, e);
          }
        }
        return {
          ...file,
          url: url || "", // Ensure url is at least an empty string
        };
      })
    );
  },
});

// 4. Update Artifact Status (Approve/Reject)
export const updateArtifactStatus = mutation({
  args: {
    fileId: v.id("files"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await isAuthenticated(ctx);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error("File not found");
    
    if (file.category !== "artifact") throw new Error("Cannot approve non-artifact files");

    const project = await ctx.db.get(file.projectId);
    if (!project) throw new Error("Project not found");

    const isAdmin = user.role === "admin";
    const isOwner = project.clientId === user._id;

    if (!isAdmin && !isOwner) throw new Error("Unauthorized");

    await ctx.db.patch(args.fileId, {
      status: args.status,
      approvalInfo: {
        approvedBy: user._id,
        approvedAt: Date.now(),
        comment: args.comment,
      },
    });

    // Log
    const action = args.status === "approved" ? "deliverable_approved" : "deliverable_changes_requested";
    await ctx.runMutation(internal.activities.log, {
        projectId: file.projectId,
        action: action,
        entityId: args.fileId,
        entityName: file.name,
        userId: user._id,
    });
  },
});

// 5. Delete File
export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    handler: async (ctx, args) => {
        const user = await isAuthenticated(ctx);
        const file = await ctx.db.get(args.fileId);
        if (!file) throw new Error("File not found");

        const isAdmin = user.role === "admin";
        
        if (!isAdmin) {
             if (file.category === "general" && file.uploadedBy === user._id) {
                 // OK
             } else {
                 throw new Error("Unauthorized to delete");
             }
        }

        if (file.storageId) {
            await ctx.storage.delete(file.storageId);
        }

        await ctx.db.delete(args.fileId);

        // Log
        await ctx.runMutation(internal.activities.log, {
            projectId: file.projectId,
            action: "file_deleted",
            entityId: args.fileId,
            entityName: file.name,
            userId: user._id,
        });
    }
});
