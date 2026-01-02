import { useEffect, useState } from "react";
import { getInvoiceById } from "../api";
import type { Invoice } from "../types";
import { useAuthOrg } from "./useAuthOrg";

export type UseInvoiceState = {
  invoice: Invoice | null;
  loading: boolean;
  error: string | null;
  orgId: string | null;
};

export const useInvoice = (invoiceId: string | null): UseInvoiceState => {
  const { orgId } = useAuthOrg();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!orgId || !invoiceId) {
      setInvoice(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    getInvoiceById(orgId, invoiceId)
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setInvoice(data);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load invoice.");
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
  }, [orgId, invoiceId]);

  return { invoice, loading, error, orgId };
};
