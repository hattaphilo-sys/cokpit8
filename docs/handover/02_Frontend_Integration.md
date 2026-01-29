# 🚀 Frontend Integration Guide: Connecting to Convex

## 📊 Current Status

**Backend is Ready!**

- **Database**: The database is live and populated with the same Mock data you saw before.
- **API**: Secure endpoints (`api.projects`, `api.tasks`) are ready to serve real-time data.
- **Auth**: Clerk integration is configured on the backend side.

## 🎯 Goal

Replace static `MOCK_DATA` in your components with `useQuery` hooks to make the app dynamic and real-time.

## 🛠 Integration Steps

### 1. Setup Provider (`src/app/ConvexClientProvider.tsx`)

Ensure your app is wrapped with the Convex provider.

```tsx
"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

Then in `src/app/layout.tsx`:

```tsx
import ConvexClientProvider from "./ConvexClientProvider";
// ...
<html lang="en">
  <body>
    <ConvexClientProvider>{children}</ConvexClientProvider>
  </body>
</html>;
```

### 2. Replace Project List (e.g. Dashboard)

**Before:**

```tsx
import { MOCK_PROJECTS } from "@/lib/mock-data";
const projects = MOCK_PROJECTS;
```

**After:**

```tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dashboard() {
  const projects = useQuery(api.projects.list, {});

  if (projects === undefined) return <p>Loading...</p>;

  // Render projects...
}
```

### 3. Replace Task Board (Kanban)

**Before:**

```tsx
const tasks = MOCK_TASKS.filter((t) => t.projectId === currentId);
```

**After:**

```tsx
const tasks = useQuery(api.tasks.list, { projectId: params.projectId });
```

### 4. Implement Mutations (Interactions)

To update data (e.g. moving a card):

```tsx
import { useMutation } from "convex/react";

// Inside component
const updateStatus = useMutation(api.tasks.update);

const handleDragEnd = (taskId, newStatus) => {
  updateStatus({ taskId, patch: { status: newStatus } });
};
```

## 🧩 Type Safety

You don't need manual interfaces anymore!
Convex automatically generates types. You can import `Doc` generic:

```tsx
import { Doc, Id } from "../../convex/_generated/dataModel";

type Project = Doc<"projects">;
```

## ❓ Troubleshooting

- **"Loading..." forever?**: Check if you are logged in. The queries require authentication.
- **Permission Denied**: Ensure your user has the correct role (`admin` vs `client`).
