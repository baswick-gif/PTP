import { CITIES, LOCATIONS } from '../data/marketplaceData.js';

export default function SearchHero({ filters, setFilters, allSpecialties }) {
  const scrollToResults = () => {
    document.getElementById('trainers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Find Certified Trainers.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 mt-2">
              Train Anywhere.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Book elite coaches for your Home, Gym, Hotel, or Outdoors. Tailored rates. Zero friction.
          </p>
        </div>

        {/* INTERACTIVE SEARCH BAR */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label htmlFor="filter-city" className="block text-sm font-semibold text-slate-300 mb-3">
                City Location
              </label>
              <select
                id="filter-city"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
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
              <label htmlFor="filter-location" className="block text-sm font-semibold text-slate-300 mb-3">
                Training Location
              </label>
              <select
                id="filter-location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
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
              <label htmlFor="filter-specialty" className="block text-sm font-semibold text-slate-300 mb-3">
                Specialty
              </label>
              <select
                id="filter-specialty"
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
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
                className="w-full bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
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
