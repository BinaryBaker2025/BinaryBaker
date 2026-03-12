import { buttonBase } from "./uiTokens.js";

// Navigation
export const navLinkClass =
  "relative text-sm text-cream/70 transition-colors duration-200 hover:text-cream after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-blue after:transition-[width] after:duration-300 hover:after:w-full";
export const mobileNavLinkClass =
  "flex w-full items-center px-5 py-4 text-sm font-medium text-cream/75 transition-colors hover:bg-cream/[0.06] hover:text-cream border-b border-cream/[0.08] last:border-b-0";

// Typography
export const sectionEyebrowClass = "font-mono text-[0.63rem] uppercase tracking-[0.35em]";
export const sectionEyebrowLightClass = `${sectionEyebrowClass} text-blue`;
export const sectionEyebrowDarkClass = `${sectionEyebrowClass} text-cream/55`;
export const sectionHeadingClass = "mt-3 font-serif text-3xl leading-tight text-cream sm:text-4xl";
export const sectionBodyClass = "mt-3 text-[0.95rem] leading-relaxed text-cream/72";
export const sectionBodyDarkClass = "mt-3 text-[0.95rem] leading-relaxed text-cream/85";
export const sectionSubheadingClass = "font-semibold text-cream";
export const panelEyebrowDarkClass = "font-mono text-[0.63rem] uppercase tracking-[0.3em] text-cream/60";

// Surfaces
export const surfaceCardClass =
  "rounded-[14px] border border-cream/[0.14] bg-cream/[0.06]";
export const surfaceHoverClass =
  "rounded-[12px] border border-cream/[0.12] bg-cream/[0.05] transition-all duration-200 hover:border-blue/35 hover:bg-cream/[0.08]";
export const heroCardClass =
  "rounded-[16px] border border-blue/20 bg-gradient-to-br from-deep-blue to-violet p-7 text-cream sm:p-8";
export const splitPanelDarkClass =
  "rounded-[16px] border border-violet/20 bg-gradient-to-br from-[#0d1875] to-[#2b1a90] p-6 text-cream sm:p-8";
export const trustStripClass =
  "border-t border-cream/[0.10] py-5 text-center text-sm text-cream/55";

// CTA strip
export const ctaStripClass =
  "mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cream/[0.12] pt-6";
export const ctaStripPrimaryButtonClass =
  "inline-flex h-9 items-center rounded-[8px] border border-blue/40 bg-blue/[0.12] px-4 text-sm font-semibold text-blue transition hover:border-blue/55 hover:bg-blue/[0.18]";

// Buttons
export const gradientButtonClass = `${buttonBase} rounded-[8px] bg-gradient-to-r from-blue to-violet text-cream`;
export const invertButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[8px] bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream/90";
export const contactSubmitButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-blue px-5 py-3 text-sm font-semibold text-cream transition hover:bg-blue/90";

// Forms
export const contactInputClass =
  "h-11 w-full rounded-[8px] border border-cream/[0.18] bg-cream/[0.07] px-4 text-[0.95rem] text-cream placeholder:text-cream/40 transition focus:border-blue/60 focus:outline-none focus:ring-1 focus:ring-blue/25";
export const contactTextareaClass =
  "w-full rounded-[8px] border border-cream/[0.18] bg-cream/[0.07] px-4 py-3 text-[0.95rem] text-cream placeholder:text-cream/40 transition focus:border-blue/60 focus:outline-none focus:ring-1 focus:ring-blue/25 min-h-[120px] resize-y";
export const contactLabelClass = "grid gap-2 text-sm font-medium text-cream/72";
