import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";

const highlights = [
  {
    title: "Project timeline",
    description: "Follow milestones, approvals, and launch dates." 
  },
  {
    title: "Deliverables",
    description: "Download assets, notes, and handoff materials." 
  },
  {
    title: "Support",
    description: "Ask questions and get answers fast." 
  }
];

const actionButton =
  "inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream/70 px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-1 hover:shadow-bb";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/portal", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
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
          <button className={actionButton} type="button" onClick={handleSignOut}>
            Sign out
          </button>
          <Link
            className={actionButton}
            to="/portal"
          >
            Back to portal
          </Link>
        </div>
      </header>

      <main className="py-12">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">Customer</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Customer dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">
          Track your active bakes, review deliverables, and keep everything moving.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] border border-ink/10 bg-cream/90 p-6 shadow-soft"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
