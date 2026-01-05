import { onAuthStateChanged } from "firebase/auth";
import { collectionGroup, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase.js";
import { getOrgId } from "../utils/org.js";

export const useOrg = () => {
  const [state, setState] = useState({
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

      setState((prev) => ({ ...prev, userId: user.uid, loading: true, error: null }));

      try {
        const fallbackOrgId = getOrgId();
        if (fallbackOrgId) {
          const memberRef = doc(db, "orgs", fallbackOrgId, "members", user.uid);
          const memberSnap = await getDoc(memberRef);
          if (memberSnap.exists()) {
            const data = memberSnap.data();
            setState({
              userId: user.uid,
              orgId: fallbackOrgId,
              role: data.role || null,
              loading: false,
              error: null
            });
            return;
          }
        }

        const membershipQuery = query(
          collectionGroup(db, "members"),
          where("uid", "==", user.uid),
          limit(1)
        );
        const snapshot = await getDocs(membershipQuery);
        if (!isMounted) {
          return;
        }

        if (snapshot.empty) {
          setState({
            userId: user.uid,
            orgId: null,
            role: null,
            loading: false,
            error: "No org membership found."
          });
          return;
        }

        const memberDoc = snapshot.docs[0];
        const orgId = memberDoc.ref.parent.parent?.id || null;
        const data = memberDoc.data();
        setState({
          userId: user.uid,
          orgId,
          role: data.role || null,
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
          error: error instanceof Error ? error.message : "Failed to load org membership."
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
