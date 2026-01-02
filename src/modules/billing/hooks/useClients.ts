import { useEffect, useState } from "react";
import { listClients } from "../api";
import type { BillingClient } from "../types";
import { useAuthOrg } from "./useAuthOrg";

export type UseClientsState = {
  clients: BillingClient[];
  loading: boolean;
  error: string | null;
  orgId: string | null;
};

export const useClients = (): UseClientsState => {
  const { orgId } = useAuthOrg();
  const [clients, setClients] = useState<BillingClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!orgId) {
      setClients([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    listClients(orgId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setClients(data);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load clients.");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orgId]);

  return { clients, loading, error, orgId };
};
