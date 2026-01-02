import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";
import type { BillingRole, OrgMembership } from "./types";

type ErrorCode = Parameters<typeof HttpsError>[0];

const ensureFirestore = () => {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
};

const normalizeRole = (value: unknown): BillingRole | null => {
  const role = typeof value === "string" ? value.toLowerCase() : "";
  if (
    role === "owner" ||
    role === "admin" ||
    role === "finance" ||
    role === "sales" ||
    role === "viewer"
  ) {
    return role as BillingRole;
  }
  return null;
};

export const throwHttpsError = (code: ErrorCode, message: string, details?: unknown) => {
  throw new HttpsError(code, message, details);
};

export const assertAuth = (auth: { uid?: string } | null): string => {
  if (!auth?.uid) {
    throwHttpsError("unauthenticated", "Authentication required.");
  }
  return auth.uid;
};

export const assertMember = async (orgId: string, uid: string): Promise<OrgMembership> => {
  if (!orgId) {
    throwHttpsError("invalid-argument", "orgId is required.");
  }
  if (!uid) {
    throwHttpsError("unauthenticated", "Authentication required.");
  }

  const db = ensureFirestore();
  const memberRef = db.doc(`orgs/${orgId}/members/${uid}`);
  const snapshot = await memberRef.get();

  if (!snapshot.exists) {
    throwHttpsError("permission-denied", "Membership required.");
  }

  const data = snapshot.data() || {};
  const role = normalizeRole(data.role);
  if (!role) {
    throwHttpsError("permission-denied", "Invalid membership role.");
  }

  return {
    id: snapshot.id,
    orgId,
    ...data,
    role
  } as OrgMembership;
};

export const assertRole = async (
  orgId: string,
  uid: string,
  allowedRoles: string[]
): Promise<OrgMembership> => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throwHttpsError("invalid-argument", "allowedRoles must be provided.");
  }

  const membership = await assertMember(orgId, uid);
  const normalized = allowedRoles.map((role) => String(role).toLowerCase());
  if (!normalized.includes(membership.role)) {
    throwHttpsError("permission-denied", "Insufficient role.");
  }
  return membership;
};
