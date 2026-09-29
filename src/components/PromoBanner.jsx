import { ChevronRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-16 sm:py-24 bg-card border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-lagoon mb-3">For Trainers</p>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">Are you a Certified Personal Trainer?</h2>
          <p className="text-lg text-ink-70 mb-8">
            Keep 100% of your base rate. Set your own rules, locations, and schedules. Let clients find you directly.
          </p>
          <button className="w-full sm:w-auto px-8 py-4 bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm hover:bg-lagoon-deep transition inline-flex items-center justify-center gap-2">
            Register as a PT Provider
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
