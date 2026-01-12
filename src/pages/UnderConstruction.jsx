export default function UnderConstruction() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue/20 blur-3xl"
      ></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-140px] left-[-80px] h-80 w-80 rounded-full bg-deep-blue/20 blur-3xl"
      ></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-120px] top-1/3 h-72 w-72 rounded-full bg-amber-200/70 blur-3xl"
      ></div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <p className="fade-up font-mono text-xs uppercase tracking-[0.35em] text-ink/60">
              Binary Baker
            </p>
            <h1 className="fade-up fade-up-delay-1 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Under construction.
            </h1>
            <p className="fade-up fade-up-delay-2 max-w-xl text-lg text-ink/70">
              This site is still being developed, so no services are offered at this time.
            </p>
            <div className="fade-up fade-up-delay-3 flex flex-wrap gap-3">
              <span className="rounded-full border border-ink/10 bg-cream/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink/70">
                Studio refresh in progress
              </span>
              <span className="rounded-full border border-ink/10 bg-cream/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink/70">
                Check back soon
              </span>
            </div>
          </div>

          <div className="fade-up fade-up-delay-2 rounded-[26px] border border-ink/10 bg-cream/80 p-6 shadow-soft">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink/60">Status</p>
            <h2 className="mt-4 font-serif text-2xl">Baking the next release.</h2>
            <p className="mt-3 text-sm text-ink/70">
              We are rebuilding the studio site experience and polishing the client flow.
            </p>
            <div className="mt-6 space-y-3 text-sm text-ink/70">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <span>Site experience</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
                  In progress
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <span>Case studies</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
                  Curating
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service inquiries</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/60">
                  Paused
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
