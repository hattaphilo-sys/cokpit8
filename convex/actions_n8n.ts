import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const N8N_URL = process.env.N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook";

export const sendProjectCreatedWebhook = internalAction({
  args: { email: v.string(), projectId: v.id("projects"), inviteUrl: v.string() },
  handler: async (ctx, args) => {
    console.log("Triggering n8n webhook: PROJECT_CREATED", args);
    const res = await fetch(`${N8N_URL}/project-created`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
        throw new Error(`n8n webhook failed: ${res.statusText}`);
    }
  },
});

export const sendInvoiceRequestedWebhook = internalAction({
    args: { projectId: v.id("projects"), amount: v.number(), clientEmail: v.string() },
    handler: async (ctx, args) => {
      console.log("Triggering n8n webhook: INVOICE_REQUESTED", args);
      const res = await fetch(`${N8N_URL}/invoice-requested`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!res.ok) {
          throw new Error(`n8n webhook failed: ${res.statusText}`);
      }
    },
  });
