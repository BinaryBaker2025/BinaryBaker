import { Link } from "react-router-dom";
import QuickSummary from "../QuickSummary.jsx";
import {
  heroCardClass,
  sectionBodyClass,
  sectionEyebrowDarkClass,
  sectionEyebrowLightClass,
  splitPanelDarkClass,
} from "../../styles/marketingTokens.js";
import { buttonGhost, buttonPrimary } from "../../styles/uiTokens.js";

export default function HeroSplitSection({
  eyebrow,
  title,
  description,
  quickSummary,
  primaryAction,
  secondaryAction,
  panel,
}) {
  return (
    <section className="reveal grid items-center gap-10 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
      <div>
        <p className={sectionEyebrowLightClass}>{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-[3.2rem]">
          {title}
        </h1>
        <p className={`${sectionBodyClass} max-w-2xl`}>{description}</p>
        {Array.isArray(quickSummary) && quickSummary.length ? (
          <div className="mt-5 max-w-2xl">
            <QuickSummary lines={quickSummary} />
          </div>
        ) : null}
        {(primaryAction || secondaryAction) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {primaryAction ? (
              <Link className={buttonPrimary} to={primaryAction.to}>
                {primaryAction.label}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link className={buttonGhost} to={secondaryAction.to}>
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        )}
      </div>

      <div className={panel ? splitPanelDarkClass : heroCardClass}>
        {panel ? (
          <>
            <p className={sectionEyebrowDarkClass}>{panel.eyebrow}</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-cream">{panel.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">{panel.body}</p>
            {Array.isArray(panel.points) && panel.points.length ? (
              <ul className="mt-5 space-y-2.5 text-sm text-cream/70">
                {panel.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue/55" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
