import { useEffect, useId } from "react";

const closeButton =
  "inline-flex items-center justify-center rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-semibold text-ink/60 transition hover:text-ink hover:shadow-soft";

export default function Dialog({ open, title, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[24px] border border-ink/10 bg-cream p-6 shadow-soft"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 id={titleId} className="text-lg font-semibold">
            {title}
          </h3>
          <button className={closeButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
