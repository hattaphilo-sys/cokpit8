# 🧠 Phase 3: Data & Logic Architecture - Database Schema

This document defines the data structure for **Convex**, establishing the foundation for `users`, `projects`, `tasks`, `files`, and `invoices`.

## 1. Schema Overview (Convex)

Values are defined using Convex's `v` validator.

### `users`

- **Purpose**: Stores authentication and profile data.
- **Definition**:
  ```typescript
  defineTable({
    clerkId: v.string(), // Indexed for fast lookup
    email: v.string(), // For notifications
    role: v.union(v.literal("admin"), v.literal("client")),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]);
  ```

### `projects`

- **Purpose**: Manages project lifecycle and states.
- **Definition**:
  ```typescript
  defineTable({
    clientId: v.id("users"), // Connects to Client
    title: v.string(),
    status: v.union(
      v.literal("hearing"),
      v.literal("concept"),
      v.literal("wireframe"),
      v.literal("design"),
      v.literal("delivery"),
    ),
    isPaymentPending: v.boolean(),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_client", ["clientId"]);
  ```

### `tasks`

- **Purpose**: Kanban items.
- **Definition**:
  ```typescript
  defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
    ),
    tags: v.array(v.string()),
    dueDate: v.optional(v.number()),
    order: v.number(), // For sorting in Kanban column
  }).index("by_project", ["projectId"]);
  ```

### `files`

- **Purpose**: Delivered artifacts.
- **Definition**:
  ```typescript
  defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    storageId: v.string(), // ID from Convex File Storage
    url: v.string(),
    type: v.string(), // MIME type
    size: v.number(),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_project", ["projectId"]);
  ```

### `invoices`

- **Purpose**: Billing records with dynamic amounts.
- **Definition**:
  ```typescript
  defineTable({
    projectId: v.id("projects"),
    title: v.string(), // e.g. "Initial Deposit", "Final Payment"
    amount: v.number(),
    currency: v.literal("jpy"),
    stripeInvoiceId: v.optional(v.string()), // Stripe ID
    clientSecret: v.optional(v.string()), // For Custom Payment Element
    status: v.union(v.literal("pending"), v.literal("paid")),
    issuedAt: v.number(),
    paidAt: v.optional(v.number()),
  }).index("by_project", ["projectId"]);
  ```

---

## 2. Logic Flow & Integrations

### A. Project Invitation Flow

1.  **Trigger**: Admin calls `api.projects.create`.
2.  **Action**: Convex creates `projects` record and a placeholder "invited" `users` record.
3.  **Integration**: Triggers `PROJECT_INVITE` webhook to n8n.
4.  **n8n Logic**:
    - Node 1: Receives Webhook.
    - Node 2: Sends Email via Resend/Gmail with Invitation Link.

### B. Payment Flow

1.  **Trigger**: Admin calls `api.invoices.create`.
2.  **Action**: Convex creates `invoices` record and sets `project.isPaymentPending = true`.
3.  **Integration**: Triggers `INVOICE_CREATED` webhook to n8n.
4.  **n8n Logic**:
    - Node 1: Receives Webhook.
    - Node 2: Calls Stripe API to create Invoice & Payment Link.
    - Node 3: Updates Convex `invoices` with `stripePaymentLink`.
    - Node 4: Emails Client.
5.  **Completion**: Client pays -> Stripe Webhook -> n8n -> Convex `api.invoices.markPaid`.
