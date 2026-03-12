const whatsappNumberDisplay = "+27 61 101 1669";
const whatsappLink =
  "https://wa.me/27611011669?text=Hi%20Binary%20Baker%2C%20I%20would%20like%20to%20chat%20about%20my%20project.";

export default function FloatingWhatsApp() {
  return (
    <a
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-cream/35 bg-gradient-to-r from-deep-blue/95 via-violet/95 to-blue/95 p-2.5 text-cream shadow-bb backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cream/45 sm:gap-3 sm:px-3.5 sm:py-3"
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with Binary Baker on WhatsApp at ${whatsappNumberDisplay}`}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/35 bg-cream/15 text-cream">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.42 0 .04 5.39.04 12.01c0 2.12.55 4.2 1.61 6.04L0 24l6.15-1.61a11.95 11.95 0 0 0 5.89 1.5h.01c6.62 0 12-5.39 12-12 0-3.2-1.25-6.22-3.53-8.41zm-8.48 18.4h-.01a9.94 9.94 0 0 1-5.06-1.38l-.36-.21-3.65.96.97-3.56-.24-.37a9.94 9.94 0 0 1-1.52-5.31C2.17 6.5 6.54 2.13 12.04 2.13c2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.5-4.48 9.86-9.9 9.86zm5.42-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.11-.49-.15-.7.15-.2.3-.78.98-.96 1.18-.17.2-.35.23-.65.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.7-1.7-.96-2.33-.25-.61-.5-.53-.7-.54h-.6c-.2 0-.53.07-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.11-.28-.18-.58-.33z" />
        </svg>
      </span>
      <span className="hidden leading-tight sm:grid">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.17em] text-cream/75">
          WhatsApp
        </span>
        <span className="text-sm font-semibold text-cream">{whatsappNumberDisplay}</span>
      </span>
    </a>
  );
}

