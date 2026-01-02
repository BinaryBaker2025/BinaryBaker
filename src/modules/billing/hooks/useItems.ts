import { useEffect, useState } from "react";
import { listItems } from "../api";
import type { BillingItem } from "../types";
import { useAuthOrg } from "./useAuthOrg";

export type UseItemsState = {
  items: BillingItem[];
  loading: boolean;
  error: string | null;
  orgId: string | null;
};

export const useItems = (): UseItemsState => {
  const { orgId } = useAuthOrg();
  const [items, setItems] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!orgId) {
      setItems([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    listItems(orgId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setItems(data);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load items.");
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

  return { items, loading, error, orgId };
};
