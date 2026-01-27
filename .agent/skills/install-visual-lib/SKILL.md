---
name: install-visual-lib
description: Setup procedure for Visual UI libraries (Aceternity, Magic UI) with Shadcn & Tailwind v3 compatibility
---

# Install Visual Lib (Aceternity / Magic UI) Setup

This skill handles the complex dependency management required to make modern visual libraries work with Next.js 15+ and React 19.

## 1. Core Utilities Setup

Ensure `cn` utility exists in `lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 2. Dependency Management (React 19 Fix)

If using Next.js 15+ (React 19), `lucide-react` and standard Shadcn init often fail due to peer deps.

**Action:**

1. Update `package.json` to force `lucide-react: "latest"`.
2. Downgrade Tailwind to v3 if visual libs require `tailwind.config.js` extension (most do).
   - `npm install tailwindcss@^3.4.1 postcss@^8 autoprefixer@^10`
   - Remove `@tailwindcss/postcss`.
3. Install Shadcn dependencies manually with legacy peer deps:
   ```bash
   npm install clsx tailwind-merge tailwindcss-animate class-variance-authority lucide-react@latest --legacy-peer-deps
   ```

## 3. Configuration

Ensure `tailwind.config.ts` includes `tailwindcss-animate` and colors.
Ensure `globals.css` uses `@tailwind` directives (v3 style), NOT `@import "tailwindcss"` (v4 style).
