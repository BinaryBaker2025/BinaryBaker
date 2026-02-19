import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import {
  brandLink,
  buttonGhost,
  buttonPrimary,
  cardBase,
  inputBase,
  labelBase,
  pageHeader,
  pageShell,
  rowCard
} from "../styles/uiTokens.js";
import BrandLogo from "../components/BrandLogo.jsx";

const portalHighlights = [
  {
    title: "Project and quote status",
    description: "Track scoping, milestones, and delivery phases in one place."
  },
  {
    title: "Hosting and maintenance",
    description: "Review active hosting tier, maintenance plan, and support coverage."
  },
  {
    title: "Documents and deliverables",
    description: "Access files, approvals, and handoff notes without back-and-forth."
  },
  {
    title: "Billing snapshots",
    description: "Review invoices, payment milestones, and billing timelines in one view."
  }
];

const defaultRole = "customer";
const allowedRoles = ["admin", "client", "customer"];

const defaultForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const errorMessages = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/email-already-in-use": "That email is already registered.",
  "auth/weak-password": "Password must be at least 6 characters."
};

const formatRole = (role) => {
  if (!role) {
    return "";
  }

  return `${role.charAt(0).toUpperCase()}${role.slice(1)}`;
};

const normalizeRole = (role) => {
  if (!role || typeof role !== "string") {
    return defaultRole;
  }
  const normalized = role.trim().toLowerCase();
  return allowedRoles.includes(normalized) ? normalized : defaultRole;
};

const resolveRoleFromClaims = (claims = {}) => {
  if (claims.admin === true) {
    return "admin";
  }
  if (typeof claims.role === "string") {
    return normalizeRole(claims.role);
  }
  return "";
};

const resolveRoleFromProfile = (profile = {}) => {
  if (profile.isAdmin === true || profile.admin === true) {
    return "admin";
  }
  if (typeof profile.role === "string") {
    return normalizeRole(profile.role);
  }
  return "";
};

const routeForRole = (role) => {
  const routes = {
    admin: "/admin",
    client: "/client",
    customer: "/customer"
  };

  return routes[role] || routes[defaultRole];
};

export default function Portal() {
  const [authMode, setAuthMode] = useState("login");
  const [formValues, setFormValues] = useState(defaultForm);
  const [status, setStatus] = useState({ loading: false, error: "", message: "" });
  const navigate = useNavigate();

  const isRegister = authMode === "register";

  const resolveUserRole = async (user) => {
    if (!user) {
      return defaultRole;
    }

    const userRef = doc(db, "users", user.uid);
    const [snapshot, tokenResult] = await Promise.all([
      getDoc(userRef),
      getIdTokenResult(user)
    ]);
    const claimRole = resolveRoleFromClaims(tokenResult?.claims);
    let resolvedRole = claimRole || defaultRole;

    if (snapshot.exists()) {
      const data = snapshot.data();
      const profileRole = resolveRoleFromProfile(data);
      if (profileRole) {
        resolvedRole = claimRole || profileRole;
      }
    } else {
      await setDoc(
        userRef,
        {
          role: defaultRole,
          displayName: user.displayName || "",
          email: user.email || "",
          createdAt: serverTimestamp()
        },
        { merge: true }
      );
    }

    return resolvedRole;
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setStatus({ loading: false, error: "", message: "" });
    setFormValues((prev) => ({
      ...prev,
      password: "",
      confirmPassword: ""
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = (error) => {
    if (!error) {
      return "Unable to authenticate. Please try again.";
    }

    return errorMessages[error.code] || "Unable to authenticate. Please try again.";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      try {
        const resolvedRole = await resolveUserRole(user);
        navigate(routeForRole(resolvedRole), { replace: true });
      } catch (error) {
        console.error("Failed to resolve user role:", error);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", message: "" });

    const { name, email, password, confirmPassword } = formValues;

    if (isRegister && password !== confirmPassword) {
      setStatus({ loading: false, error: "Passwords do not match.", message: "" });
      return;
    }

    try {
      if (isRegister) {
        const selectedRole = defaultRole;
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            role: selectedRole,
            displayName: name.trim() || credential.user.displayName || "",
            email: credential.user.email || email,
            createdAt: serverTimestamp()
          },
          { merge: true }
        );
        setStatus({
          loading: false,
          error: "",
          message: `Account created as ${formatRole(selectedRole)}. Please sign in to access your portal.`
        });
        setAuthMode("login");
        setFormValues((prev) => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const resolvedRole = await resolveUserRole(credential.user);

        setStatus({
          loading: false,
          error: "",
          message: `Signed in as ${formatRole(resolvedRole)}.`
        });
        navigate(routeForRole(resolvedRole), { replace: true });
        setFormValues((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error), message: "" });
    }
  };

  return (
    <div className={pageShell}>
      <header className={pageHeader}>
        <Link className={brandLink} to="/">
          <BrandLogo />
        </Link>
        <div className="flex flex-wrap gap-3">
          <a className={buttonPrimary} href="/#contact">
            Request a quote
          </a>
          <Link className={buttonGhost} to="/">
            Back to site
          </Link>
        </div>
      </header>

      <main>
        <section className="grid items-start gap-10 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">
              Client Portal
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Manage projects, hosting, and support in one secure workspace.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Your portal keeps delivery progress, billing, and support context aligned to your selected
              plan. Sign in to stay synced with the Binary Baker team.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {portalHighlights.map((item) => (
                <div
                  key={item.title}
                  className={rowCard}
                >
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs text-ink/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} bg-cream/95`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex rounded-full bg-ink/5 p-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 transition ${
                    authMode === "login"
                      ? "bg-ink text-cream shadow-soft"
                      : "text-ink/60 hover:text-ink"
                  }`}
                  onClick={() => handleModeChange("login")}
                  disabled={status.loading}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 transition ${
                    authMode === "register"
                      ? "bg-ink text-cream shadow-soft"
                      : "text-ink/60 hover:text-ink"
                  }`}
                  onClick={() => handleModeChange("register")}
                  disabled={status.loading}
                >
                  Register
                </button>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
                {authMode === "login" ? "Welcome back" : "New here"}
              </span>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              {isRegister && (
                <label className={labelBase}>
                  Full name
                  <input
                    className={inputBase}
                    type="text"
                    name="name"
                    placeholder="Thando Mokoena"
                    autoComplete="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}
              <label className={labelBase}>
                Email
                <input
                  className={inputBase}
                  type="email"
                  name="email"
                  placeholder="thando@company.co.za"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={labelBase}>
                Password
                <input
                  className={inputBase}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
              </label>
              {isRegister && (
                <label className={labelBase}>
                  Confirm password
                  <input
                    className={inputBase}
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}
              {isRegister && (
                <p className="text-xs text-ink/60">
                  New accounts are created as Customers. Admins assign Client or Admin roles.
                </p>
              )}
              <button
                className={`${buttonPrimary} ${status.loading ? "cursor-not-allowed opacity-70" : ""}`}
                type="submit"
                disabled={status.loading}
              >
                {status.loading
                  ? "Working..."
                  : authMode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
              {status.error && (
                <p className="rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-sm text-ink">
                  {status.error}
                </p>
              )}
              {status.message && (
                <p className="rounded-[12px] border border-blue/30 bg-blue/10 px-3 py-2 text-sm text-ink">
                  {status.message}
                </p>
              )}
            </form>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/60">
              <span>Secure access for active projects and support history.</span>
              <a
                className="text-ink underline decoration-ink/30 underline-offset-4"
                href="mailto:bradley@binarybaker.co.za"
              >
                Need access help?
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
