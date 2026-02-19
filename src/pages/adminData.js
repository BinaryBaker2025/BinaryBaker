export {
  brandBadge,
  brandLink,
  buttonBase,
  buttonGhost,
  buttonPrimary,
  buttonSubtle,
  cardBase,
  inputBase,
  labelBase,
  pageHeader,
  pageShell,
  pillBase,
  rowCard,
  textareaBase
} from "../styles/uiTokens.js";

export const projectServices = [
  "Lite - Showcase",
  "Starter - Business",
  "Business - Growth",
  "Advanced - Authority",
  "E-Commerce",
  "Custom Web App",
  "Hosting & Maintenance"
];
export const projectStages = [
  "Discovery",
  "Design sprint",
  "Prototype + UI",
  "Build + QA",
  "Launch"
];
export const projectStatuses = ["Planned", "In progress", "Review", "On hold", "Complete"];
export const clientStatuses = ["active", "inactive"];
export const accessLevels = ["Viewer", "Billing", "Full access", "Owner"];
export const invoiceStatuses = [
  "draft",
  "sent",
  "viewed",
  "partially_paid",
  "paid",
  "overdue",
  "void"
];
export const taskStatuses = ["Backlog", "In progress", "Review", "Done"];

export const projectStatusStyles = {
  Planned: "bg-ink/5 text-ink/70",
  "In progress": "bg-blue/15 text-deep-blue",
  Review: "bg-violet/15 text-violet",
  "On hold": "bg-amber-100 text-amber-700",
  Complete: "bg-emerald-100 text-emerald-700"
};

export const clientStatusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700"
};

export const invoiceStatusStyles = {
  draft: "bg-ink/5 text-ink/70",
  sent: "bg-blue/15 text-deep-blue",
  viewed: "bg-violet/15 text-violet",
  partially_paid: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-rose-100 text-rose-600",
  void: "bg-ink/10 text-ink/60"
};

export const accessStyles = {
  Viewer: "bg-ink/5 text-ink/70",
  Billing: "bg-blue/15 text-deep-blue",
  "Full access": "bg-violet/15 text-violet",
  Owner: "bg-amber-100 text-amber-700"
};
