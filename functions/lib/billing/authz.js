"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertRole = exports.assertMember = exports.assertAuth = exports.throwHttpsError = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const ensureFirestore = () => {
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    return (0, firestore_1.getFirestore)();
};
const normalizeRole = (value) => {
    const role = typeof value === "string" ? value.toLowerCase() : "";
    if (role === "owner" ||
        role === "admin" ||
        role === "finance" ||
        role === "sales" ||
        role === "viewer") {
        return role;
    }
    return null;
};
const throwHttpsError = (code, message, details) => {
    throw new https_1.HttpsError(code, message, details);
};
exports.throwHttpsError = throwHttpsError;
const assertAuth = (auth) => {
    const uid = auth?.uid;
    if (!uid) {
        (0, exports.throwHttpsError)("unauthenticated", "Authentication required.");
    }
    return uid;
};
exports.assertAuth = assertAuth;
const assertMember = async (orgId, uid) => {
    if (!orgId) {
        (0, exports.throwHttpsError)("invalid-argument", "orgId is required.");
    }
    if (!uid) {
        (0, exports.throwHttpsError)("unauthenticated", "Authentication required.");
    }
    const db = ensureFirestore();
    const memberRef = db.doc(`orgs/${orgId}/members/${uid}`);
    const snapshot = await memberRef.get();
    if (!snapshot.exists) {
        (0, exports.throwHttpsError)("permission-denied", "Membership required.");
    }
    const data = snapshot.data() || {};
    const role = normalizeRole(data.role);
    if (!role) {
        (0, exports.throwHttpsError)("permission-denied", "Invalid membership role.");
    }
    return {
        id: snapshot.id,
        orgId,
        ...data,
        role
    };
};
exports.assertMember = assertMember;
const assertRole = async (orgId, uid, allowedRoles) => {
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        (0, exports.throwHttpsError)("invalid-argument", "allowedRoles must be provided.");
    }
    const membership = await (0, exports.assertMember)(orgId, uid);
    const normalized = allowedRoles.map((role) => String(role).toLowerCase());
    if (!normalized.includes(membership.role)) {
        (0, exports.throwHttpsError)("permission-denied", "Insufficient role.");
    }
    return membership;
};
exports.assertRole = assertRole;
