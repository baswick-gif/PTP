import { MapPin, ChevronRight, Shield } from 'lucide-react';
import { formatMVR, formatUSD } from '../utils/currency.js';
import { locationIcons } from './locationIcons.jsx';
import StarRating from './StarRating.jsx';

export default function TrainerCard({ trainer, activeLocationFilter, onBook, onViewProfile }) {
  const cheapestRate = Math.min(...Object.values(trainer.monthlyRates));

  return (
    <div className="group bg-card border border-line hover:border-lagoon transition-colors duration-300">
      {/* Trainer Image — click to open the full profile */}
      <button
        onClick={() => onViewProfile(trainer)}
        className="relative h-56 w-full overflow-hidden bg-surface block text-left"
        aria-label={`View ${trainer.name}'s profile`}
      >
        <img
          src={trainer.image_url}
          alt={trainer.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
        />
        {trainer.verified && (
          <div className="absolute top-3 left-3 bg-lagoon text-ink-solid px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5" />
            Verified
          </div>
        )}
      </button>

      {/* Content */}
      <div className="p-6">
        {/* Name & Rating */}
        <div className="mb-3">
          <h3 className="mb-2">
            <button onClick={() => onViewProfile(trainer)} className="font-display text-xl hover:text-lagoon transition text-left">
              {trainer.name}
            </button>
          </h3>
          <StarRating rating={trainer.rating} reviewCount={trainer.review_count} />
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {trainer.certifications.slice(0, 2).map((cert) => (
              <span key={cert} className="text-xs bg-surface text-ink-70 px-2.5 py-1">
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Location Badges */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Available At</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {trainer.available_locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-1.5 bg-lagoon-wash text-lagoon-deep px-2.5 py-1 text-sm font-medium border border-lagoon-edge"
              >
                {locationIcons[loc]}
                {loc}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Cities</p>
          <div className="flex flex-wrap gap-2">
            {trainer.available_cities.map((city) => (
              <div
                key={city}
                className="flex items-center gap-1.5 bg-surface text-ink-70 px-2.5 py-1 text-sm font-medium border border-line"
              >
                <MapPin className="w-3.5 h-3.5" />
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Price Display */}
        <div className="mb-6 p-4 bg-lagoon-wash border border-lagoon-edge">
          <p className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Starting From</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-lagoon-deep font-mono">{formatMVR(cheapestRate)}</span>
            <span className="text-sm text-ink-70">/ month</span>
          </div>
          <p className="text-sm text-ink-70 mt-1 font-mono">{formatUSD(cheapestRate)}</p>
          {activeLocationFilter && trainer.monthlyRates[activeLocationFilter] && (
            <p className="text-xs text-lagoon-deep mt-2 font-medium font-mono pt-2 border-t border-lagoon-edge">
              {activeLocationFilter}: {formatMVR(trainer.monthlyRates[activeLocationFilter])} / {formatUSD(trainer.monthlyRates[activeLocationFilter])}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onBook(trainer)}
          className="w-full bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm py-3 hover:bg-lagoon-deep transition flex items-center justify-center gap-2 group/btn"
        >
          Book a Session
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
