---
name: setup-convex
description: Initialize and configure Convex backend with schema and auth
---

# Setup Convex Backend

This skill handles the initialization of a Convex backend, including schema definition and authentication setup.

## Prerequisites

- Node.js installed
- Convex account

## Steps

### 1. Install Dependencies

```bash
npm install convex @clerk/nextjs
```

### 2. Initialize Project

Run the following command and follow the interactive prompts to log in and select/create a project.

```bash
npx convex dev
```

### 3. Define Schema (`convex/schema.ts`)

Create `convex/schema.ts` and use `defineSchema` and `defineTable` to model your data. Ensure to use strict validation with `v`.

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // ...
  }),
  // ...
});
```

### 4. Setup Authentication (`convex/auth.config.ts`)

For Clerk integration:

```typescript
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

### 5. Create API Endpoint

Create files in `convex/` (e.g., `convex/users.ts`) exporting `query` and `mutation` functions.

```typescript
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
```
