import { useConvexAuth } from "convex/react";

export function useIsAdmin() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return { isAdmin: isAuthenticated, isLoading };
}
