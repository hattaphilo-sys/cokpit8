import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireAdmin(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.db
      .query("users")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || user.role !== "admin") throw new Error("Unauthorized: Admin only");
    return user;
}

export const create = mutation({
    args: { 
        projectId: v.id("projects"),
        amount: v.number(),
        title: v.string(), // Title is not in Schema but in args? Schema has amount, currency...
        // API Contract: "api.invoices.create(projectId, amount, title)"
        // But Schema: "invoices" doesn't have "title". 
        // Maybe title goes into description or metadata, or schema needs update.
        // I will adhere to Schema for DB, but ignore Title or assuming it's meant to be stored?
        // Let's assume schema matches what was defined. Maybe we don't store title or we add it.
        // I will add it to DB schema if I could, but I must follow "Contracts". 
        // Contract Schema for Invoices doesn't have title. 
        // Contract API has title. 
        // I'll ignore title for DB persist or add it to "stripePaymentLink" metadata?
        // I'll stick to Schema.
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        // 1. Set project payment pending
        await ctx.db.patch(args.projectId, { isPaymentPending: true });

        // 2. Create Invoice record
        const invoiceId = await ctx.db.insert("invoices", {
            projectId: args.projectId,
            amount: args.amount,
            currency: "jpy", // Defaulting as needed or add to args
            stripePaymentLink: "", // Will be updated by n8n or action? 
            status: "pending",
            issuedAt: Date.now(),
        });

        // 3. Call Action to generate Stripe Link (via n8n?)
        // Contract: "Calls Stripe Payment Intent API ... via n8n or direct Action"
        // And "Triggers: n8n Webhook INVOICE_ISSUED"
        
        // Let's fetch the client email
        const client = await ctx.db.get(project.clientId);
        
        await ctx.scheduler.runAfter(0, internal.actions_n8n.sendInvoiceRequestedWebhook, {
            projectId: args.projectId,
            amount: args.amount,
            clientEmail: client?.email ?? "",
        });

        return invoiceId;
    }
});

export const getPending = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const invoice = await ctx.db
            .query("invoices")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .withIndex("by_projectId", (q: any) => q.eq("projectId", args.projectId))
            .filter((q) => q.eq(q.field("status"), "pending"))
            .first();
        return invoice;
    }
});
