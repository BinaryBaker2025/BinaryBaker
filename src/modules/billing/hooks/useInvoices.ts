import { useEffect, useState } from "react";
import { listInvoices } from "../api";
import type { Invoice } from "../types";
import { useAuthOrg } from "./useAuthOrg";

export type UseInvoicesState = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  orgId: string | null;
};

export const useInvoices = (): UseInvoicesState => {
  const { orgId } = useAuthOrg();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!orgId) {
      setInvoices([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    listInvoices(orgId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setInvoices(data);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load invoices.");
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

  return { invoices, loading, error, orgId };
};
