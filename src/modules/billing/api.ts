import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase.js";
import type { BillingClient, BillingItem, Invoice, OrgMembership } from "./types";

const mapDoc = <T>(snapshot: { id: string; data: () => unknown }): T => {
  return { id: snapshot.id, ...(snapshot.data() as object) } as T;
};

const mapMembership = (snapshot: {
  id: string;
  data: () => unknown;
  ref: { parent: { parent?: { id: string } } };
}): OrgMembership => {
  const orgId = snapshot.ref.parent.parent?.id || "";
  return { orgId, id: snapshot.id, ...(snapshot.data() as object) } as OrgMembership;
};

export const getUserMemberships = async (uid: string): Promise<OrgMembership[]> => {
  const membershipQuery = query(
    collectionGroup(db, "members"),
    where("uid", "==", uid)
  );
  const snapshot = await getDocs(membershipQuery);
  return snapshot.docs.map((docSnap) => mapMembership(docSnap));
};

export const getPrimaryMembership = async (uid: string): Promise<OrgMembership | null> => {
  const membershipQuery = query(
    collectionGroup(db, "members"),
    where("uid", "==", uid),
    limit(1)
  );
  const snapshot = await getDocs(membershipQuery);
  if (snapshot.empty) {
    return null;
  }
  return mapMembership(snapshot.docs[0]);
};

export const listClients = async (orgId: string): Promise<BillingClient[]> => {
  const clientQuery = query(collection(db, "orgs", orgId, "clients"));
  const snapshot = await getDocs(clientQuery);
  return snapshot.docs.map((docSnap) => mapDoc<BillingClient>(docSnap));
};

export const listItems = async (orgId: string): Promise<BillingItem[]> => {
  const itemsQuery = query(collection(db, "orgs", orgId, "items"));
  const snapshot = await getDocs(itemsQuery);
  return snapshot.docs.map((docSnap) => mapDoc<BillingItem>(docSnap));
};

export const listInvoices = async (orgId: string): Promise<Invoice[]> => {
  const invoiceQuery = query(collection(db, "orgs", orgId, "invoices"));
  const snapshot = await getDocs(invoiceQuery);
  return snapshot.docs.map((docSnap) => mapDoc<Invoice>(docSnap));
};

export const getInvoiceById = async (
  orgId: string,
  invoiceId: string
): Promise<Invoice | null> => {
  const invoiceRef = doc(db, "orgs", orgId, "invoices", invoiceId);
  const snapshot = await getDoc(invoiceRef);
  if (!snapshot.exists()) {
    return null;
  }
  return mapDoc<Invoice>({ id: snapshot.id, data: () => snapshot.data() });
};

// TODO: Add create/update/delete API helpers with validation.
