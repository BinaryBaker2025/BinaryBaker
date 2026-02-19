import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import {
  brandLink,
  buttonGhost,
  cardBase,
  pageHeader,
  pageShell
} from "../styles/uiTokens.js";
import BrandLogo from "../components/BrandLogo.jsx";

const highlights = [
  {
    title: "Project status",
    description: "Review milestones, approvals, and launch dates."
  },
  {
    title: "Feedback loop",
    description: "Leave notes, approvals, and updates for the team."
  },
  {
    title: "Asset hub",
    description: "Access shared files and deliverables in one place."
  }
];

export default function ClientDashboard() {
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
    <div className={pageShell}>
      <header className={pageHeader}>
        <Link className={brandLink} to="/">
          <BrandLogo />
        </Link>
        <div className="flex flex-wrap gap-3">
          <button className={buttonGhost} type="button" onClick={handleSignOut}>
            Sign out
          </button>
          <Link className={buttonGhost} to="/portal">
            Back to portal
          </Link>
        </div>
      </header>

      <main className="py-12">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">Client</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Client dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">
          Stay synced on your deliverables, approvals, and the live project timeline.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className={cardBase}
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
