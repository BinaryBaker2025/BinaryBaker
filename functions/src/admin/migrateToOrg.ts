import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import {
  FieldPath,
  FieldValue,
  getFirestore,
  Timestamp
} from "firebase-admin/firestore";

type MigrationOptions = {
  orgId: string;
  dryRun: boolean;
  projectId?: string;
};

type AdminUser = {
  uid: string;
  email?: string;
  displayName?: string;
  createdAtMillis?: number;
};

const DEFAULT_ORG_ID = "default";
const PAGE_SIZE = 400;

const parseBool = (value?: string) => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }
  return false;
};

const parseArgs = (): MigrationOptions => {
  const args = process.argv.slice(2);
  let orgId = DEFAULT_ORG_ID;
  let dryRun = false;
  let projectId: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith("--orgId=")) {
      orgId = arg.split("=")[1] || orgId;
    } else if (arg === "--orgId") {
      orgId = args[index + 1] || orgId;
      index += 1;
    } else if (arg.startsWith("--projectId=")) {
      projectId = arg.split("=")[1] || projectId;
    } else if (arg === "--projectId" || arg === "--project") {
      projectId = args[index + 1] || projectId;
      index += 1;
    } else if (arg.startsWith("--dryRun=")) {
      dryRun = parseBool(arg.split("=")[1]);
    } else if (arg === "--dryRun") {
      const nextValue = args[index + 1];
      if (nextValue && !nextValue.startsWith("--")) {
        dryRun = parseBool(nextValue);
        index += 1;
      } else {
        dryRun = true;
      }
    }
  }

  const envProjectId =
    projectId ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID;

  return { orgId, dryRun, projectId: envProjectId };
};

const readProjectIdFromFirebaseConfig = (): string | undefined => {
  const config = process.env.FIREBASE_CONFIG;
  if (!config) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(config);
    if (typeof parsed.projectId === "string") {
      return parsed.projectId;
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
};

const ensureFirestore = (projectId?: string) => {
  const resolvedProjectId = projectId || readProjectIdFromFirebaseConfig();
  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      projectId: resolvedProjectId
    });
  }
  return getFirestore();
};

const toMillis = (value: unknown): number | undefined => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  if (typeof (value as { toMillis?: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  const valueAny = value as { seconds?: number; _seconds?: number; nanoseconds?: number };
  if (typeof valueAny.seconds === "number") {
    return valueAny.seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
  }
  if (typeof valueAny._seconds === "number") {
    return valueAny._seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
  }
  const date = new Date(value as string | number);
  if (!Number.isNaN(date.getTime())) {
    return date.getTime();
  }
  return undefined;
};

const resolveUid = (docId: string, data: Record<string, unknown>): string | null => {
  const candidate =
    (typeof data.uid === "string" && data.uid) ||
    (typeof data.authUid === "string" && data.authUid) ||
    (typeof data.userId === "string" && data.userId) ||
    docId;

  if (candidate.includes("@") && candidate === docId) {
    return null;
  }
  return candidate;
};

const isAdminUser = (data: Record<string, unknown>): boolean => {
  const roleRaw = typeof data.role === "string" ? data.role.trim().toLowerCase() : "";
  const isAdmin =
    data.isAdmin === true || data.admin === true || roleRaw === "admin";
  return isAdmin;
};

const getNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
};

const toMinor = (value: unknown): number | undefined => {
  const numberValue = getNumber(value);
  if (numberValue == null) {
    return undefined;
  }
  return Math.round(numberValue * 100);
};

const getFirstNumber = (values: unknown[]): number | undefined => {
  for (const value of values) {
    const numberValue = getNumber(value);
    if (numberValue != null) {
      return numberValue;
    }
  }
  return undefined;
};

const normalizeInvoiceData = (data: Record<string, unknown>) => {
  const payload = { ...data };
  const totalsRaw =
    typeof payload.totals === "object" && payload.totals !== null ? payload.totals : {};
  const totals = { ...(totalsRaw as Record<string, unknown>) };

  if (totals.totalMinor == null) {
    const totalMajor = getFirstNumber([
      totals.total,
      payload.total,
      payload.amount,
      payload.totalAmount
    ]);
    const totalMinor = toMinor(totalMajor);
    if (totalMinor != null) {
      totals.totalMinor = totalMinor;
    }
  }

  if (totals.subtotalMinor == null) {
    const subtotalMajor = getFirstNumber([totals.subtotal, payload.subtotal]);
    const subtotalMinor = toMinor(subtotalMajor);
    if (subtotalMinor != null) {
      totals.subtotalMinor = subtotalMinor;
    }
  }

  if (totals.taxTotalMinor == null) {
    const taxMajor = getFirstNumber([totals.taxTotal, payload.taxTotal, payload.tax]);
    const taxMinor = toMinor(taxMajor);
    if (taxMinor != null) {
      totals.taxTotalMinor = taxMinor;
    }
  }

  if (totals.discountTotalMinor == null) {
    const discountMajor = getFirstNumber([
      totals.discountTotal,
      payload.discountTotal,
      payload.discount
    ]);
    const discountMinor = toMinor(discountMajor);
    if (discountMinor != null) {
      totals.discountTotalMinor = discountMinor;
    }
  }

  payload.totals = totals;

  if (payload.amountPaidMinor == null) {
    const paidMinor = toMinor(payload.amountPaid ?? payload.paid);
    if (paidMinor != null) {
      payload.amountPaidMinor = paidMinor;
    }
  }

  if (payload.balanceDueMinor == null) {
    const balanceMinor = toMinor(payload.balanceDue ?? payload.balance);
    if (balanceMinor != null) {
      payload.balanceDueMinor = balanceMinor;
    }
  }

  return payload;
};

const withTimestamps = (data: Record<string, unknown>) => {
  const payload = { ...data };
  if (payload.createdAt == null) {
    payload.createdAt = FieldValue.serverTimestamp();
  }
  if (payload.updatedAt == null) {
    payload.updatedAt = FieldValue.serverTimestamp();
  }
  return payload;
};

const copyCollection = async ({
  source,
  target,
  dryRun,
  transform,
  projectId
}: {
  source: string;
  target: string;
  dryRun: boolean;
  transform?: (data: Record<string, unknown>) => Record<string, unknown>;
  projectId?: string;
}) => {
  const db = ensureFirestore(projectId);
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let totalCopied = 0;

  while (true) {
    let queryRef = db.collection(source).orderBy(FieldPath.documentId()).limit(PAGE_SIZE);
    if (lastDoc) {
      queryRef = queryRef.startAfter(lastDoc);
    }
    const snapshot = await queryRef.get();
    if (snapshot.empty) {
      break;
    }

    totalCopied += snapshot.size;
    if (!dryRun) {
      const batch = db.batch();
      snapshot.docs.forEach((docSnap) => {
        const raw = docSnap.data() as Record<string, unknown>;
        const payload = withTimestamps(transform ? transform(raw) : raw);
        batch.set(db.doc(`${target}/${docSnap.id}`), payload, { merge: true });
      });
      await batch.commit();
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
  }

  return totalCopied;
};

const loadAdminUsers = async (
  projectId?: string
): Promise<{ admins: AdminUser[]; skipped: number }> => {
  const db = ensureFirestore(projectId);
  const admins: AdminUser[] = [];
  const seen = new Set<string>();
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let skipped = 0;

  while (true) {
    let queryRef = db.collection("users").orderBy(FieldPath.documentId()).limit(PAGE_SIZE);
    if (lastDoc) {
      queryRef = queryRef.startAfter(lastDoc);
    }
    const snapshot = await queryRef.get();
    if (snapshot.empty) {
      break;
    }

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      if (!isAdminUser(data)) {
        return;
      }
      const uid = resolveUid(docSnap.id, data);
      if (!uid) {
        skipped += 1;
        return;
      }
      if (seen.has(uid)) {
        return;
      }
      seen.add(uid);
      admins.push({
        uid,
        email: typeof data.email === "string" ? data.email : undefined,
        displayName:
          typeof data.displayName === "string" ? data.displayName : undefined,
        createdAtMillis: toMillis(data.createdAt)
      });
    });

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
  }

  return { admins, skipped };
};

const ensureOrgDocuments = async (orgId: string, dryRun: boolean, projectId?: string) => {
  const db = ensureFirestore(projectId);
  const orgRef = db.doc(`orgs/${orgId}`);
  const settingsRef = db.doc(`orgs/${orgId}/settings/main`);
  const [orgSnap, settingsSnap] = await Promise.all([orgRef.get(), settingsRef.get()]);

  if (!dryRun) {
    if (!orgSnap.exists) {
      await orgRef.set(
        {
          name: orgId === DEFAULT_ORG_ID ? "Default org" : orgId,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }

    if (!settingsSnap.exists) {
      await settingsRef.set(
        {
          companyName: orgId === DEFAULT_ORG_ID ? "Binary Baker" : "New org",
          currency: "ZAR",
          timezone: "Africa/Johannesburg",
          locale: "en-ZA",
          invoicePrefix: "INV-",
          nextInvoiceNumber: 1,
          taxMode: "exclusive",
          defaultPaymentTermsDays: 30,
          allowPartialPayments: true,
          migratedFromSingleTenant: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }
  }
};

const writeMembers = async (
  orgId: string,
  admins: AdminUser[],
  dryRun: boolean,
  projectId?: string
) => {
  const db = ensureFirestore(projectId);
  const sorted = [...admins].sort((a, b) => {
    const aTime = a.createdAtMillis ?? 0;
    const bTime = b.createdAtMillis ?? 0;
    return aTime - bTime;
  });
  let created = 0;

  if (dryRun) {
    return { created: 0, ownerUid: sorted[0]?.uid || null };
  }

  const batch = db.batch();
  sorted.forEach((admin, index) => {
    const role = index === 0 ? "owner" : "admin";
    const memberRef = db.doc(`orgs/${orgId}/members/${admin.uid}`);
    batch.set(
      memberRef,
      {
        uid: admin.uid,
        email: admin.email || "",
        displayName: admin.displayName || "",
        role,
        status: "active",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    created += 1;
  });
  if (created > 0) {
    await batch.commit();
  }

  return { created, ownerUid: sorted[0]?.uid || null };
};

const markMigrated = async (orgId: string, dryRun: boolean, projectId?: string) => {
  if (dryRun) {
    return;
  }
  const db = ensureFirestore(projectId);
  await db.doc(`orgs/${orgId}/settings/main`).set(
    {
      migratedFromSingleTenant: true,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
};

const runMigration = async () => {
  const options = parseArgs();
  const { orgId, dryRun, projectId } = options;

  console.log(
    JSON.stringify(
      {
        message: "Starting single-tenant migration",
        orgId,
        dryRun,
        projectId: projectId || null
      },
      null,
      2
    )
  );

  await ensureOrgDocuments(orgId, dryRun, projectId);

  const { admins, skipped } = await loadAdminUsers(projectId);
  const memberResult = await writeMembers(orgId, admins, dryRun, projectId);

  const collections = [
    { name: "clients", transform: undefined },
    { name: "invoices", transform: normalizeInvoiceData },
    { name: "projects", transform: undefined },
    { name: "tasks", transform: undefined },
    { name: "assignments", transform: undefined }
  ];

  const copyResults: Record<string, number> = {};
  for (const collection of collections) {
    const total = await copyCollection({
      source: collection.name,
      target: `orgs/${orgId}/${collection.name}`,
      dryRun,
      transform: collection.transform,
      projectId
    });
    copyResults[collection.name] = total;
  }

  await markMigrated(orgId, dryRun, projectId);

  console.log(
    JSON.stringify(
      {
        message: "Migration complete",
        orgId,
        dryRun,
        membersCreated: memberResult.created,
        ownerUid: memberResult.ownerUid,
        adminDocsSkipped: skipped,
        collections: copyResults
      },
      null,
      2
    )
  );
};

if (require.main === module) {
  runMigration().catch((error) => {
    console.error("Migration failed", error);
    process.exitCode = 1;
  });
}
