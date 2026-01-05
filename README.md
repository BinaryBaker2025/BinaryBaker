# Binary Baker Org Migration

## Migration (single-tenant -> org-based)
1) Build the migration script:
```
npm --prefix functions run build
```

2) Dry run (no writes):
```
node functions/lib/admin/migrateToOrg.js --orgId default --projectId binarybaker2025 --dryRun true
```

3) Execute migration:
```
node functions/lib/admin/migrateToOrg.js --orgId default --projectId binarybaker2025 --dryRun false
```

Notes:
- The script copies top-level `clients`, `invoices`, `projects`, `tasks`, and `assignments` into `orgs/{orgId}/...`.
- It creates `orgs/{orgId}` and `orgs/{orgId}/settings/main` if missing.
- It creates membership docs for admin users found in `/users` (role == "admin" or isAdmin == true).

## Add a New Org/Admin
1) Create `orgs/{orgId}` and `orgs/{orgId}/settings/main`.
2) Create membership docs at `orgs/{orgId}/members/{uid}` with:
```
{
  uid,
  email,
  displayName,
  role: "owner" | "admin" | "finance" | "sales" | "viewer",
  status: "active"
}
```
3) Use the orgId in app queries: `orgs/{orgId}/clients`, `orgs/{orgId}/projects`, etc.

## Firestore Rules
- Org data is isolated under `orgs/{orgId}` and requires an active membership doc.
- Old top-level collections are denied after migration.
