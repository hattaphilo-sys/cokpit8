# 📜 Phase 3: API & Data Contract (Convex)

This document serves as the **SINGLE SOURCE OF TRUTH** for both Frontend and Backend implementation.
All data access must utilize the Schema and Actions defined below.

## 1. Data Models (Schema)

### `users`

- **\_id**: `Id<"users">`
- **clerkId**: `string` (Indexed, Unique)
- **email**: `string`
- **role**: `"admin" | "client"`
- **name**: `string`
- **avatarUrl**: `string` (Optional)

### `projects`

- **\_id**: `Id<"projects">`
- **clientId**: `Id<"users">` (Indexed)
- **title**: `string`
- **status**: `"hearing" | "concept" | "wireframe" | "design" | "delivery"` (5 Steps)
- **isPaymentPending**: `boolean` (Default: false)
- **createdAt**: `number`

### `tasks`

- **\_id**: `Id<"tasks">`
- **projectId**: `Id<"projects">` (Indexed)
- **title**: `string`
- **description**: `string` (Optional)
- **status**: `"todo" | "in_progress" | "review" | "done"`
- **tags**: `string[]` (e.g., ["Urgent", "Bug"])
- **dueDate**: `number` (Optional)

### `files`

- **\_id**: `Id<"files">`
- **projectId**: `Id<"projects">` (Indexed)
- **name**: `string`
- **url**: `string` (Storage URL)
- **type**: `string` (MIME type)
- **uploadedBy**: `Id<"users">`
- **createdAt**: `number`

### `invoices`

- **\_id**: `Id<"invoices">`
- **projectId**: `Id<"projects">` (Indexed)
- **amount**: `number`
- **currency**: `"jpy" | "usd"`
- **stripePaymentLink**: `string`
- **status**: `"pending" | "paid"`
- **issuedAt**: `number`

---

## 2. API Functions (Public Interface)

### 🟢 Queries (Read)

- `api.users.current()`
  - **Returns**: `User | null`
  - **Auth**: Required

- `api.projects.listAdmin()`
  - **Returns**: `Project[]`
  - **Auth**: Admin Only

- `api.projects.getByUser(userId: Id<"users">)`
  - **Returns**: `Project | null`
  - **Auth**: Client can only fetch their own.

- `api.tasks.list(projectId: Id<"projects">)`
  - **Returns**: `Task[]`
  - **Auth**: Admin or Project Owner

- `api.files.list(projectId: Id<"projects">)`
  - **Returns**: `File[]`
  - **Auth**: Admin or Project Owner

### 🔵 Mutations (Write)

- `api.projects.create(title: string, clientEmail: string)`
  - **Description**: Creates a new project. If user with email doesn't exist, create a placeholder user (invited).
  - **Auth**: Admin Only
  - **Triggers**: Sends invitation email (via n8n webhook).

- `api.projects.updateStatus(projectId: Id<"projects">, status: ProjectStatus)`
  - **Auth**: Admin Only

- `api.tasks.create(projectId: Id<"projects">, title: string, status: TaskStatus)`
  - **Auth**: Admin Only

- `api.tasks.update(taskId: Id<"tasks">, patch: Partial<Task>)`
  - **Auth**: Admin or Project Owner (Clients can move cards?) -> **CONTRACT: Clients are Read-Only for Tasks in Phase 1.**
- `api.invoices.create(projectId: Id<"projects">, amount: number, title: string)`
  - **Description**: Generates a dynamic invoice for variable amounts.
  - **Auth**: Admin Only
  - **Side Effect**:
    1. Sets `project.isPaymentPending = true`.
    2. Sets `invoice.status = "pending"`.
    3. Calls **Stripe Payment Intent API** (via n8n or direct Action) to get `clientSecret`.
  - **Triggers**: n8n Webhook `INVOICE_ISSUED` (Sends email: "New Invoice Available. Check Dashboard.")

* `api.invoices.finalizePayment(invoiceId: Id<"invoices">, paymentIntentId: string)`
* **Auth**: Client (via Webhook or Client Action after Stripe confirm)
* **Action**: Verifies payment with Stripe, then updates `status="paid"` and `project.isPaymentPending=false`.

---

## 3. Webhook Events (n8n Integration)

The backend will emit the following events to n8n for processing:

1.  **Event**: `PROJECT_CREATED`
    - **Payload**: `{ email: string, projectId: string, inviteUrl: string }`
    - **Details**: Used to send invitation email to client.

2.  **Event**: `INVOICE_REQUESTED`
    - **Payload**: `{ projectId: string, amount: number, clientEmail: string }`
    - **Details**: Used to generate Stripe Payment Link and email it.
