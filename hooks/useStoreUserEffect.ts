"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

/**
 * Hook that syncs the Clerk-authenticated user into the Convex `users` table.
 * Call this once near the top of your authenticated layout/page tree.
 *
 * Returns `isLoading` (true until Convex auth + store completes) and
 * `isAuthenticated` (true only after the user record exists in Convex).
 */
export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createUser() {
      const id = await storeUser({
        name: user?.fullName || user?.firstName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        imageUrl: user?.imageUrl,
      });
      setUserId(id);
    }

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
