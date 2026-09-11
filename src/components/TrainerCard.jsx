import { MapPin, Star, ChevronRight, Shield, Dumbbell, Home, Umbrella, Building2 } from 'lucide-react';
import { monthlyRates } from '../data/marketplaceData.js';
import { formatMVR, formatUSD } from '../utils/currency.js';

const locationIcons = {
  Gym: <Dumbbell className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Outdoor: <Umbrella className="w-5 h-5" />,
  Hotel: <Building2 className="w-5 h-5" />,
};

const cheapestRate = Math.min(...Object.values(monthlyRates));

export default function TrainerCard({ trainer, activeLocationFilter, onBook }) {
  return (
    <div className="group bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      {/* Trainer Image */}
      <div className="relative h-48 overflow-hidden bg-slate-700">
        <img
          src={trainer.image_url}
          alt={trainer.name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
        />
        {trainer.verified && (
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-semibold">
            <Shield className="w-4 h-4 text-emerald-400" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name & Rating */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(trainer.rating) ? 'fill-emerald-400 text-emerald-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {trainer.rating} ({trainer.review_count})
            </span>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {trainer.certifications.slice(0, 2).map((cert) => (
              <span key={cert} className="text-xs bg-slate-700/60 text-slate-200 px-3 py-1.5 rounded-full">
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Location Badges */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Available At</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {trainer.available_locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-500/30"
              >
                {locationIcons[loc]}
                {loc}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cities</p>
          <div className="flex flex-wrap gap-2">
            {trainer.available_cities.map((city) => (
              <div
                key={city}
                className="flex items-center gap-1.5 bg-lime-500/20 text-lime-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-lime-500/30"
              >
                <MapPin className="w-3.5 h-3.5" />
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Price Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/20 to-lime-400/20 rounded-lg border border-emerald-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Starting From</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-emerald-400">{formatMVR(cheapestRate)}</span>
            <span className="text-sm text-slate-400">/ month</span>
          </div>
          <p className="text-sm text-emerald-300 mt-1 font-medium">{formatUSD(cheapestRate)}</p>
          {activeLocationFilter && monthlyRates[activeLocationFilter] && (
            <p className="text-xs text-emerald-300 mt-2 font-medium pt-2 border-t border-emerald-500/30">
              {activeLocationFilter}: {formatMVR(monthlyRates[activeLocationFilter])} / {formatUSD(monthlyRates[activeLocationFilter])}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onBook(trainer)}
          className="w-full bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 group/btn"
        >
          Book a Session
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
