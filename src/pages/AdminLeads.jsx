import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../firebase.js";
import {
  buttonPrimary,
  cardBase,
  inputBase,
  labelBase,
  pillBase,
  textareaBase
} from "./adminData";

const leadStatuses = ["new", "in_review", "replied", "closed"];
const inquiryTypes = ["system_quote", "general_enquiry", "support"];
const budgetRangeLabels = {
  under_5k: "Lite - Showcase",
  "5k_15k": "Starter - Business",
  "15k_50k": "Business - Growth",
  "50k_100k": "Advanced - Authority",
  "100k_plus": "E-Commerce or Custom Web App",
  not_sure: "Not sure yet"
};

const statusStyles = {
  new: "bg-blue/15 text-deep-blue",
  in_review: "bg-violet/15 text-violet",
  replied: "bg-emerald-100 text-emerald-700",
  closed: "bg-ink/10 text-ink/60"
};

const formatLabel = (value) => {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatTimestamp = (value) => {
  if (!value) {
    return "Unknown";
  }
  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString();
  }
  if (typeof value?.seconds === "number") {
    return new Date(value.seconds * 1000).toLocaleString();
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString();
  }
  return "Unknown";
};

const resolveSummary = (lead) => {
  if (lead.inquiryType === "system_quote") {
    return lead.requirementsSummary || "No requirements summary provided.";
  }
  return lead.message || "No message provided.";
};

const resolveStatus = (value) => {
  return leadStatuses.includes(value) ? value : "new";
};

const formatBudgetRange = (value) => {
  return budgetRangeLabels[value] || formatLabel(value || "not specified");
};

export default function AdminLeads() {
  const { inquiries = [], orgId } = useOutletContext();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((lead) => {
      const typeMatches = typeFilter === "all" || lead.inquiryType === typeFilter;
      const statusMatches =
        statusFilter === "all" || resolveStatus(lead.status) === statusFilter;
      return typeMatches && statusMatches;
    });
  }, [inquiries, statusFilter, typeFilter]);

  const getDraft = (lead) => {
    return (
      drafts[lead.id] || {
        status: resolveStatus(lead.status),
        adminNotes: lead.adminNotes || ""
      }
    );
  };

  const updateDraft = (leadId, patch) => {
    setDrafts((prev) => ({
      ...prev,
      [leadId]: {
        ...(prev[leadId] || {}),
        ...patch
      }
    }));
  };

  const handleSave = async (lead) => {
    if (!orgId) {
      setFeedback({ type: "error", message: "Assign this user to an org to manage leads." });
      return;
    }

    const draft = getDraft(lead);
    const nextStatus = resolveStatus(draft.status);
    const nextNotes = String(draft.adminNotes || "").trim();

    setSavingId(lead.id);
    setFeedback({ type: "", message: "" });

    try {
      await updateDoc(doc(db, "orgs", orgId, "inquiries", lead.id), {
        status: nextStatus,
        adminNotes: nextNotes,
        updatedAt: serverTimestamp()
      });
      setFeedback({ type: "success", message: `Lead ${lead.fullName || lead.id} saved.` });
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to save lead updates." });
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Leads</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
          Review quote requests and website enquiries.
        </h1>
        <p className="mt-3 text-ink/70">
          Track inbound requests, update status, and capture internal follow-up notes.
        </p>
      </section>

      <section className={cardBase}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelBase}>
            Filter by inquiry type
            <select
              className={inputBase}
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All types</option>
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </label>
          <label className={labelBase}>
            Filter by status
            <select
              className={inputBase}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {feedback.message && (
        <p
          className={`rounded-[14px] px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.message}
        </p>
      )}

      <section className="grid gap-5">
        {filteredInquiries.length === 0 && (
          <div className={cardBase}>
            <p className="text-sm text-ink/60">No leads found for the current filters.</p>
          </div>
        )}

        {filteredInquiries.map((lead) => {
          const draft = getDraft(lead);
          const status = resolveStatus(draft.status);
          return (
            <article key={lead.id} className={cardBase}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{lead.fullName || "Unknown contact"}</h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {lead.companyName || "No company"} / {formatLabel(lead.inquiryType)}
                  </p>
                </div>
                <span className={`${pillBase} ${statusStyles[status]}`}>{formatLabel(status)}</span>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-ink/70 sm:grid-cols-2 lg:grid-cols-3">
                <p>
                  <span className="font-semibold text-ink">Email:</span>{" "}
                  <a href={`mailto:${lead.email}`} className="underline decoration-ink/30 underline-offset-4">
                    {lead.email || "N/A"}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-ink">Phone / WhatsApp:</span>{" "}
                  {lead.phone || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-ink">Preferred contact:</span>{" "}
                  {formatLabel(lead.preferredContactMethod || "email")}
                </p>
                <p>
                  <span className="font-semibold text-ink">Submitted:</span>{" "}
                  {formatTimestamp(lead.submittedAt || lead.createdAt)}
                </p>
                {lead.inquiryType === "system_quote" && (
                  <>
                    <p>
                      <span className="font-semibold text-ink">System type:</span>{" "}
                      {lead.systemType === "other"
                        ? lead.systemTypeOther || "Other"
                        : formatLabel(lead.systemType || "not specified")}
                    </p>
                    <p>
                      <span className="font-semibold text-ink">Preferred plan / timeline:</span>{" "}
                      {formatBudgetRange(lead.budgetRange)} /{" "}
                      {formatLabel(lead.timeline || "not specified")}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-5 rounded-[14px] border border-ink/10 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Request details</p>
                <p className="mt-2 text-sm text-ink/80">{resolveSummary(lead)}</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)]">
                <label className={labelBase}>
                  Status
                  <select
                    className={inputBase}
                    value={status}
                    onChange={(event) => updateDraft(lead.id, { status: event.target.value })}
                  >
                    {leadStatuses.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {formatLabel(statusOption)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelBase}>
                  Internal notes
                  <textarea
                    className={textareaBase}
                    value={draft.adminNotes || ""}
                    onChange={(event) => updateDraft(lead.id, { adminNotes: event.target.value })}
                    placeholder="Capture follow-up notes, next actions, and owner."
                  ></textarea>
                </label>
              </div>

              <div className="mt-4">
                <button
                  className={`${buttonPrimary} ${
                    savingId === lead.id ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  type="button"
                  disabled={savingId === lead.id}
                  onClick={() => handleSave(lead)}
                >
                  {savingId === lead.id ? "Saving..." : "Save lead updates"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
