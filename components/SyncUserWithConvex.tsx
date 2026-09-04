"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function SyncUserWithConvex() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    storeUser({
      name: user.fullName || user.firstName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      imageUrl: user.imageUrl,
    });
  }, [isAuthenticated, storeUser, user?.id]);

  return null;
}
