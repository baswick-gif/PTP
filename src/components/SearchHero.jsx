import { CITIES, LOCATIONS } from '../data/marketplaceData.js';

// Purely decorative mood backdrop — not tied to any specific trainer's
// data, so it renders immediately regardless of API load state.
const HERO_BACKDROP = 'https://images.unsplash.com/photo-1633180543038-4e0d06c9a9d2?w=1200&h=800&fit=crop&crop=faces';

export default function SearchHero({ filters, setFilters, allSpecialties }) {
  const scrollToResults = () => {
    document.getElementById('trainers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-28">
      {/* Faded backdrop — atmosphere only, heavily darkened so it reads as mood, not a specific photo */}
      <div className="absolute inset-0">
        <img src={HERO_BACKDROP} alt="" className="w-full h-full object-cover object-top opacity-25 grayscale" />
        <div className="absolute inset-0 bg-wash-hero opacity-95" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-lagoon mb-4">
            Personal Trainers &middot; Greater Mal&eacute;
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            Find Certified Trainers.
            <span className="block text-lagoon mt-1">Train Anywhere.</span>
          </h1>
          <p className="text-lg sm:text-xl text-ink-70 max-w-2xl mx-auto">
            Book elite coaches for your Home, Gym, Hotel, or Outdoors. Tailored rates. Zero friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollToResults}
              className="px-8 py-3.5 bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm hover:bg-lagoon-deep transition"
            >
              Browse Trainers
            </button>
            <a
              href="#"
              className="px-8 py-3.5 border-2 border-line text-ink font-bold uppercase tracking-wide text-sm hover:border-lagoon hover:text-lagoon transition"
            >
              Register as PT
            </a>
          </div>
        </div>

        {/* INTERACTIVE SEARCH BAR */}
        <div className="bg-card/90 backdrop-blur-md border border-line p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label htmlFor="filter-city" className="block text-sm font-semibold text-ink-70 mb-3">
                City Location
              </label>
              <select
                id="filter-city"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full bg-surface border border-line px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-lagoon focus:border-transparent cursor-pointer"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label htmlFor="filter-location" className="block text-sm font-semibold text-ink-70 mb-3">
                Training Location
              </label>
              <select
                id="filter-location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full bg-surface border border-line px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-lagoon focus:border-transparent cursor-pointer"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div>
              <label htmlFor="filter-specialty" className="block text-sm font-semibold text-ink-70 mb-3">
                Specialty
              </label>
              <select
                id="filter-specialty"
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full bg-surface border border-line px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-lagoon focus:border-transparent cursor-pointer"
              >
                <option value="">All Specialties</option>
                {allSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={scrollToResults}
                className="w-full bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm py-3 hover:bg-lagoon-deep transition"
              >
                Search Trainers
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
