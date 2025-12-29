import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

const portalHighlights = [
  {
    title: "Live project status",
    description: "Monitor milestones, approvals, and launch dates in real time."
  },
  {
    title: "Asset delivery",
    description: "Grab design files, specs, and handoff notes when they are ready."
  },
  {
    title: "Team collaboration",
    description: "Add teammates, collect feedback, and keep everyone aligned."
  },
  {
    title: "Billing snapshots",
    description: "Review invoices, retainers, and billing timelines in one view."
  }
];

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-1 hover:shadow-bb";
const buttonPrimary = `${buttonBase} bg-gradient-to-br from-deep-blue to-violet text-cream`;
const buttonGhost = `${buttonBase} border border-ink/20 bg-cream/70`;

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

export default function Portal() {
  const [authMode, setAuthMode] = useState("login");
  const [formValues, setFormValues] = useState(defaultForm);
  const [status, setStatus] = useState({ loading: false, error: "", message: "" });
  const navigate = useNavigate();

  const isRegister = authMode === "register";
  const normalizeRole = (role) => (allowedRoles.includes(role) ? role : defaultRole);
  const routeForRole = (role) => {
    const routes = {
      admin: "/admin",
      client: "/client",
      customer: "/customer"
    };

    return routes[role] || routes[defaultRole];
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
        const userRef = doc(db, "users", credential.user.uid);
        const snapshot = await getDoc(userRef);
        let resolvedRole = defaultRole;

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.role) {
            resolvedRole = normalizeRole(data.role);
          }
        } else {
          await setDoc(
            userRef,
            {
              role: resolvedRole,
              displayName: credential.user.displayName || "",
              email: credential.user.email || email,
              createdAt: serverTimestamp()
            },
            { merge: true }
          );
        }

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
    <div className="min-h-screen max-w-6xl mx-auto px-6 pb-12 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-6 py-4">
        <Link className="flex items-center gap-3 font-serif text-lg font-bold" to="/">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-deep-blue to-violet font-mono text-sm uppercase tracking-[0.12em] text-cream">
            BB
          </span>
          Binary Baker
        </Link>
        <div className="flex flex-wrap gap-3">
          <a className={buttonPrimary} href="/#contact">
            Request access
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
              Track every milestone from kickoff to launch.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Your project workspace keeps deliverables, approvals, and timelines in one organized hub.
              Login or register to stay synced with the Binary Baker team.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {portalHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-ink/10 bg-cream/90 p-4 shadow-soft"
                >
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs text-ink/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-ink/10 bg-cream/95 p-6 shadow-soft">
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
                <label className="grid gap-2 text-sm">
                  Full name
                  <input
                    className="w-full rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-blue/60"
                    type="text"
                    name="name"
                    placeholder="Avery Baker"
                    autoComplete="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}
              <label className="grid gap-2 text-sm">
                Email
                <input
                  className="w-full rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-blue/60"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                Password
                <input
                  className="w-full rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-blue/60"
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
                <label className="grid gap-2 text-sm">
                  Confirm password
                  <input
                    className="w-full rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-blue/60"
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
              <span>Secure access for active projects.</span>
              <a
                className="text-ink underline decoration-ink/30 underline-offset-4"
                href="mailto:hello@binarybaker.com"
              >
                Need help?
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
