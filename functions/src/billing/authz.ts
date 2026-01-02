import { HttpsError } from "firebase-functions/v2/https";
import type { BillingRole, OrgMembership } from "./types";

export const assertAuth = (auth: { uid?: string } | null): string => {
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }
  return auth.uid;
};

const roleRank: Record<BillingRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
  viewer: 0
};

export const hasRole = (role: BillingRole, minimum: BillingRole): boolean => {
  return roleRank[role] >= roleRank[minimum];
};

export const assertOrgRole = (
  membership: OrgMembership | null | undefined,
  minimumRole: BillingRole
) => {
  if (!membership) {
    throw new HttpsError("permission-denied", "Membership required.");
  }
  if (!hasRole(membership.role, minimumRole)) {
    throw new HttpsError("permission-denied", "Insufficient role.");
  }
};

// TODO: Implement membership lookups with Firestore in a shared helper.
