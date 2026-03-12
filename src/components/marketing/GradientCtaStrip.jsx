import { Link } from "react-router-dom";
import { ctaStripClass, ctaStripPrimaryButtonClass } from "../../styles/marketingTokens.js";

export default function GradientCtaStrip({ text, actionTo, actionLabel }) {
  return (
    <div className={`reveal ${ctaStripClass}`}>
      <p className="text-sm text-cream/50">{text}</p>
      <Link className={ctaStripPrimaryButtonClass} to={actionTo}>
        {actionLabel}
      </Link>
    </div>
  );
}

