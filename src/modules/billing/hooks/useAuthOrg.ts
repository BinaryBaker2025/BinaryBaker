import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase.js";
import { getPrimaryMembership } from "../api";
import type { BillingRole } from "../types";

export type AuthOrgState = {
  userId: string | null;
  orgId: string | null;
  role: BillingRole | null;
  loading: boolean;
  error: string | null;
};

export const useAuthOrg = (): AuthOrgState => {
  const [state, setState] = useState<AuthOrgState>({
    userId: null,
    orgId: null,
    role: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) {
        return;
      }

      if (!user) {
        setState({ userId: null, orgId: null, role: null, loading: false, error: null });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null, userId: user.uid }));

      try {
        const membership = await getPrimaryMembership(user.uid);
        if (!isMounted) {
          return;
        }
        setState({
          userId: user.uid,
          orgId: membership?.orgId || null,
          role: membership?.role || null,
          loading: false,
          error: null
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setState({
          userId: user.uid,
          orgId: null,
          role: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load membership."
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return state;
};

// TODO: Support selecting an org when multiple memberships exist.
