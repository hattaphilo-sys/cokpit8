import { mutation } from "./_generated/server";
// import { v } from "convex/values";
import { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS, MOCK_FILES, MOCK_INVOICE } from "../src/lib/mock-data";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Clear existing data (Optional: for safety, maybe just append or check duplicates? For now, we assume fresh)
    // Actually, let's not delete to be safe, but since this is specific seeding, we can check if data exists.
    // However, for simplicity in this task, I will just insert. 
    // Ideally we should use a "reset" flag or something.

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userIdMap = new Map<string, any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectIdMap = new Map<string, any>();

    // 2. Insert Users
    for (const mockUser of MOCK_USERS) {
      // Check if user exists by email to prevent duplicates if run multiple times
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", mockUser.email))
        .first();

      if (existingUser) {
        userIdMap.set(mockUser._id, existingUser._id);
      } else {
        const id = await ctx.db.insert("users", {
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            avatarUrl: mockUser.avatarUrl,
            clerkId: undefined, // Will be linked later
        });
        userIdMap.set(mockUser._id, id);
      }
    }

    // 3. Insert Projects
    for (const mockProject of MOCK_PROJECTS) {
      const realClientId = userIdMap.get(mockProject.clientId);
      if (!realClientId) continue; // Should not happen if users seeded

      // Check existence? Harder without unique key other than ID. Maybe title + client?
      // We will just insert for now.
      const id = await ctx.db.insert("projects", {
          clientId: realClientId,
          title: mockProject.title,
          status: mockProject.status,
          isPaymentPending: mockProject.isPaymentPending,
          createdAt: mockProject.createdAt,
      });
      projectIdMap.set(mockProject._id, id);
    }

    // 4. Insert Tasks
    for (const mockTask of MOCK_TASKS) {
        const realProjectId = projectIdMap.get(mockTask.projectId);
        if (!realProjectId) continue;
        
        await ctx.db.insert("tasks", {
            projectId: realProjectId,
            title: mockTask.title,
            status: mockTask.status,
            tags: mockTask.tags,
            dueDate: mockTask.dueDate,
            order: MOCK_TASKS.indexOf(mockTask),
        });
    }

    // 5. Insert Files
    for (const mockFile of MOCK_FILES) {
        const realProjectId = projectIdMap.get(mockFile.projectId);
        const realUploaderId = userIdMap.get(mockFile.uploadedBy);
        if (!realProjectId || !realUploaderId) continue;

        // Note: mockFile.url is a local path string. 
        // Convex `storageId` expects a valid storage ID.
        // We cannot easily mock a storageId because it needs actual file upload.
        // For this migration, we might have to use a placeholder string or fail schema validation if we use `v.id("_storage")`?
        // Schema says `storageId: v.string()`, so any string is fine.
        // We will store the mock URL as `storageId` for now, but UI will break if it tries to `system.storage.getUrl`.
        // OR we can change schema to optional storageId and allow url? 
        // The onboarding Doc schema says `storageId: v.string()`.
        
        await ctx.db.insert("files", {
            projectId: realProjectId,
            name: mockFile.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            category: (mockFile.category as any) === "deliverable" || (mockFile.category as any) === "artifact" ? "artifact" : "general",
            type: mockFile.type,
            size: mockFile.size,
            uploadedBy: realUploaderId,
            uploadedAt: mockFile.uploadedAt,
            storageId: mockFile.url, // Using the mock URL string as placeholder
        });
    }

    // 6. Insert Invoices (MOCK_INVOICE is single object?)
    // In mock-data.ts: export const MOCK_INVOICE = { ... }
    // We should treat it as one invoice to insert.
    if (MOCK_INVOICE) {
         const realProjectId = projectIdMap.get(MOCK_INVOICE.projectId);
         if (realProjectId) {
             await ctx.db.insert("invoices", {
                 projectId: realProjectId,
                 amount: MOCK_INVOICE.amount,
                 currency: MOCK_INVOICE.currency,
                 stripePaymentLink: MOCK_INVOICE.stripePaymentLink,
                 status: MOCK_INVOICE.status,
                 issuedAt: MOCK_INVOICE.issuedAt
             });
         }
    }
  },
});
