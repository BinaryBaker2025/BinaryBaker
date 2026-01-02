const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret, defineString } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { Resend } = require("resend");

initializeApp();

const auth = getAuth();
const db = getFirestore();

const resendApiKey = defineSecret("RESEND_API_KEY");
const resendFrom = defineString("RESEND_FROM", {
  default: "Binary Baker <hello@binarybaker.com>"
});
const portalUrl = defineString("CLIENT_PORTAL_URL", {
  default: "https://yourdomain.com/portal"
});

const buildInviteEmail = ({ name, resetLink }) => {
  const safeName = name || "there";
  return {
    subject: "Set up your Binary Baker client portal",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${safeName},</p>
        <p>Your Binary Baker client portal is ready. Use the link below to set your password and access your dashboard.</p>
        <p><a href="${resetLink}" target="_blank" rel="noreferrer">Set your password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        <p>Thanks,<br/>Binary Baker</p>
      </div>
    `
  };
};

exports.inviteClientOnCreate = onDocumentCreated(
  { document: "orgs/{orgId}/clients/{clientId}", retry: false, secrets: [resendApiKey] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      return;
    }

    const client = snapshot.data();
    const emails = Array.isArray(client?.emails) ? client.emails : [];
    const primaryEmail = emails[0] || client?.email;
    if (!client || !primaryEmail) {
      return;
    }

    if (client.inviteSentAt) {
      return;
    }

    const resendKey = resendApiKey.value();
    if (!resendKey) {
      await snapshot.ref.set(
        {
          inviteStatus: "failed",
          inviteError: "RESEND_API_KEY is not configured.",
          inviteUpdatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      return;
    }

    const email = String(primaryEmail).trim().toLowerCase();
    const displayName = client.contactName || client.name || client.companyName || "";
    const resend = new Resend(resendKey);
    const fromAddress = resendFrom.value();
    const portalLink = portalUrl.value();

    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          userRecord = await auth.createUser({
            email,
            displayName,
            emailVerified: false,
            disabled: false
          });
        } else {
          throw error;
        }
      }

      await db.doc(`users/${userRecord.uid}`).set(
        {
          role: "client",
          displayName: userRecord.displayName || displayName,
          email,
          createdAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      const resetLink = await auth.generatePasswordResetLink(email, {
        url: portalLink,
        handleCodeInApp: false
      });

      const emailContent = buildInviteEmail({
        name: displayName || "there",
        resetLink
      });

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      await snapshot.ref.set(
        {
          inviteStatus: "sent",
          inviteSentAt: FieldValue.serverTimestamp(),
          inviteEmail: email,
          authUid: userRecord.uid
        },
        { merge: true }
      );
    } catch (error) {
      await snapshot.ref.set(
        {
          inviteStatus: "failed",
          inviteError: error?.message || "Failed to send invite.",
          inviteUpdatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      throw error;
    }
  }
);
