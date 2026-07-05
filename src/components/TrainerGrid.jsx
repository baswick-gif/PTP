import { ZoomIn } from 'lucide-react';
import TrainerCard from './TrainerCard.jsx';

export default function TrainerGrid({ trainers, filters, onBook }) {
  return (
    <section id="trainers" className="py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{trainers.length} Results Found</h2>
          <p className="text-slate-400">
            {filters.location && filters.specialty
              ? `Trainers specializing in ${filters.specialty} available at ${filters.location}`
              : filters.location
              ? `Trainers available at ${filters.location}`
              : filters.specialty
              ? `Trainers specializing in ${filters.specialty}`
              : 'Browse all available trainers'}
          </p>
        </div>

        {trainers.length === 0 ? (
          <div className="text-center py-16">
            <ZoomIn className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trainers found</h3>
            <p className="text-slate-400">Try adjusting your filters to find the perfect trainer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                activeLocationFilter={filters.location}
                onBook={onBook}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
