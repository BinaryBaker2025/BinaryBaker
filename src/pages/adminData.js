export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-1 hover:shadow-bb";
export const buttonPrimary = `${buttonBase} bg-gradient-to-br from-deep-blue to-violet text-cream`;
export const buttonGhost = `${buttonBase} border border-ink/20 bg-cream/70`;

export const cardBase = "rounded-[22px] border border-ink/10 bg-cream/90 p-6 shadow-soft";
export const rowCard = "rounded-[16px] border border-ink/10 bg-white/70 p-4";
export const inputBase =
  "w-full rounded-[12px] border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-blue/60";
export const textareaBase = `${inputBase} min-h-[96px]`;
export const labelBase = "grid gap-2 text-sm";
export const pillBase =
  "inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em]";

export const projectServices = ["Proof + Mix", "Oven Build", "Icing + Launch", "Batch Ops"];
export const projectStages = [
  "Discovery",
  "Design sprint",
  "Prototype + UI",
  "Build + QA",
  "Launch"
];
export const projectStatuses = ["Planned", "In progress", "Review", "On hold", "Complete"];
export const clientStatuses = ["Active", "Invited", "Paused"];
export const accessLevels = ["Viewer", "Billing", "Full access", "Owner"];
export const invoiceStatuses = ["Draft", "Sent", "Paid", "Overdue"];
export const taskStatuses = ["Backlog", "In progress", "Review", "Done"];

export const projectStatusStyles = {
  Planned: "bg-ink/5 text-ink/70",
  "In progress": "bg-blue/15 text-deep-blue",
  Review: "bg-violet/15 text-violet",
  "On hold": "bg-amber-100 text-amber-700",
  Complete: "bg-emerald-100 text-emerald-700"
};

export const clientStatusStyles = {
  Active: "bg-emerald-100 text-emerald-700",
  Invited: "bg-blue/15 text-deep-blue",
  Paused: "bg-amber-100 text-amber-700"
};

export const invoiceStatusStyles = {
  Draft: "bg-ink/5 text-ink/70",
  Sent: "bg-blue/15 text-deep-blue",
  Paid: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-rose-100 text-rose-600"
};

export const accessStyles = {
  Viewer: "bg-ink/5 text-ink/70",
  Billing: "bg-blue/15 text-deep-blue",
  "Full access": "bg-violet/15 text-violet",
  Owner: "bg-amber-100 text-amber-700"
};
