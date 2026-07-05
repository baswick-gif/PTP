import { ChevronRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-y border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Are you a Certified Personal Trainer?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Keep 100% of your base rate. Set your own rules, locations, and schedules. Let clients find you directly.
          </p>
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all inline-flex items-center justify-center gap-2">
            Register as a PT Provider
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
