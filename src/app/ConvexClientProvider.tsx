"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function UserSync({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const setAdmin = useMutation(api.users.setAdmin);

  useEffect(() => {
    if (isAuthenticated) {
      storeUser().then(() => {
        // Auto-promote to admin in development
        setAdmin().catch(console.error);
      });
    }
  }, [isAuthenticated, storeUser, setAdmin]);

  return <>{children}</>;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync>{children}</UserSync>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
