import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase.js";
import { getPrimaryMembership } from "../api";
import type { BillingRole } from "../types";

export type AuthOrgState = {
  userId: string | null;
  orgId: string | null;
  role: BillingRole | null;
  loading: boolean;
  error: string | null;
};

export const useAuthOrg = (orgIdOverride: string | null = null): AuthOrgState => {
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
        if (orgIdOverride) {
          const memberRef = doc(db, "orgs", orgIdOverride, "members", user.uid);
          const snapshot = await getDoc(memberRef);
          if (!isMounted) {
            return;
          }
          if (!snapshot.exists()) {
            setState({
              userId: user.uid,
              orgId: orgIdOverride,
              role: null,
              loading: false,
              error: "Membership not found for org."
            });
            return;
          }
          const data = snapshot.data();
          setState({
            userId: user.uid,
            orgId: orgIdOverride,
            role: data.role || null,
            loading: false,
            error: null
          });
          return;
        }

        const membership = await getPrimaryMembership(user.uid);
        if (!isMounted) {
          return;
        }
        setState({
          userId: user.uid,
          orgId: membership?.orgId || null,
          role: membership?.role || null,
          loading: false,
          error: membership ? null : "No org membership found."
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
  }, [orgIdOverride]);

  return state;
};

// TODO: Support selecting an org when multiple memberships exist.
