import { useEffect, useRef } from 'react';
import { X, MapPin, Shield, ChevronRight } from 'lucide-react';
import { formatMVR, formatUSD } from '../utils/currency.js';
import { locationIcons } from './locationIcons.jsx';
import StarRating from './StarRating.jsx';

export default function TrainerProfileModal({ trainer, onClose, onBook }) {
  const cheapestRate = Math.min(...Object.values(trainer.monthlyRates));
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-paper/85 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trainer-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card sm:border max-w-4xl w-full h-full sm:h-auto border-0 border-line shadow-2xl max-h-full sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-line px-6 py-4 flex items-center justify-between safe-top z-10">
          <h2 id="trainer-profile-title" className="font-display text-lg">
            Trainer Profile
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close trainer profile"
            className="w-10 h-10 flex items-center justify-center hover:bg-surface transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:grid md:grid-cols-[280px_1fr] md:gap-8">
          {/* Left column: photo, identity, price, CTA */}
          <div className="md:sticky md:top-20 md:self-start">
            <div className="relative overflow-hidden bg-surface mb-4 aspect-[4/5]">
              <img
                src={trainer.image_url}
                alt={trainer.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <h3 className="font-display text-2xl mb-2">{trainer.name}</h3>
            <div className="mb-3">
              <StarRating rating={trainer.rating} reviewCount={trainer.review_count} />
            </div>

            {/* Admin-approved trust badges — distinct from trainer-submitted content below */}
            {trainer.verified && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 bg-lagoon text-ink-solid px-3 py-1.5 text-sm font-bold uppercase tracking-wide">
                  <Shield className="w-4 h-4" />
                  Verified
                </span>
              </div>
            )}

            <div className="mb-6 p-4 bg-lagoon-wash border border-lagoon-edge">
              <p className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Starting From</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-lagoon-deep font-mono">{formatMVR(cheapestRate)}</span>
                <span className="text-sm text-ink-70">/ month</span>
              </div>
              <p className="text-sm text-ink-70 mt-1 font-mono">{formatUSD(cheapestRate)}</p>
            </div>

            <button
              onClick={() => onBook(trainer)}
              className="w-full bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm py-3 hover:bg-lagoon-deep transition flex items-center justify-center gap-2"
            >
              Book a Session
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right column: trainer-submitted content */}
          <div className="mt-8 md:mt-0 space-y-8">
            <div>
              <h4 className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">About</h4>
              <p className="text-ink-70 leading-relaxed">{trainer.bio}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((specialty) => (
                  <span key={specialty} className="text-sm bg-surface text-ink-70 border border-line px-2.5 py-1">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert) => (
                  <span key={cert} className="text-sm bg-surface text-ink-70 px-2.5 py-1">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Available At</h4>
              <div className="flex flex-wrap gap-2 mb-4">
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
              <h4 className="text-xs font-semibold text-ink-45 uppercase tracking-wide mb-2 font-mono">Cities</h4>
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
          </div>
        </div>
      </div>
    </div>
  );
}
