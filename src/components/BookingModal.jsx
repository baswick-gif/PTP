import { useEffect, useRef } from 'react';
import { X, MapPin, Star, Clock, Dumbbell, Home, Umbrella, Building2 } from 'lucide-react';
import { sessionPackages, monthlyRates, gymMembershipFee, gyms, hotels, outdoorSpaces } from '../data/marketplaceData.js';
import { formatMVR, formatUSD } from '../utils/currency.js';

const locationIcons = {
  Gym: <Dumbbell className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Outdoor: <Umbrella className="w-5 h-5" />,
  Hotel: <Building2 className="w-5 h-5" />,
};

function getAvailableFacilities(city, location) {
  if (!city || !location) return [];
  if (location === 'Gym') return gyms.filter((g) => g.city === city);
  if (location === 'Hotel') return hotels.filter((h) => h.city === city);
  if (location === 'Outdoor') return outdoorSpaces.filter((s) => s.city === city);
  if (location === 'Home') return [{ id: 'home', name: `Your Home in ${city}`, city }];
  return [];
}

export default function BookingModal({
  trainer,
  selectedCity,
  setSelectedCity,
  selectedLocation,
  setSelectedLocation,
  selectedFacility,
  setSelectedFacility,
  selectedSlot,
  setSelectedSlot,
  selectedPackage,
  setSelectedPackage,
  onClose,
  onCheckout,
}) {
  const closeButtonRef = useRef(null);

  // Lock body scroll and allow Escape to close while the modal is open —
  // essential on mobile where a background scroll leak is jarring.
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

  const availableFacilities = getAvailableFacilities(selectedCity, selectedLocation);

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 rounded-none sm:rounded-2xl max-w-3xl w-full h-full sm:h-auto border-0 sm:border border-slate-700 shadow-2xl max-h-full sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between safe-top">
          <h2 id="booking-modal-title" className="text-2xl font-bold">
            Book with {trainer.name}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 pb-32 sm:pb-6">
          {/* Trainer Summary */}
          <div className="flex gap-4 pb-6 border-b border-slate-700">
            <img
              src={trainer.image_url}
              alt={trainer.name}
              className="w-24 h-32 rounded-lg object-cover object-top flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
              <p className="text-slate-400 mb-3 text-sm">{trainer.bio}</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(trainer.rating) ? 'fill-emerald-400 text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-slate-400">
                  {trainer.rating} ({trainer.review_count})
                </span>
              </div>
            </div>
          </div>

          {/* City Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lime-400" />
              Select City
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {trainer.available_cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedCity === city
                      ? 'border-lime-500 bg-lime-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <p className="font-semibold">{city}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4">Select Training Location</h4>
            <div className="grid grid-cols-2 gap-3">
              {trainer.available_locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setSelectedFacility(loc === 'Home' ? 'home' : '');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
                    selectedLocation === loc
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`mt-1 ${selectedLocation === loc ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {locationIcons[loc]}
                  </div>
                  <div>
                    <p className="font-semibold">{loc}</p>
                    <p className="text-sm text-slate-400">
                      {formatMVR(monthlyRates[loc])} / {formatUSD(monthlyRates[loc])}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Facility Selector (Gym, Hotel, Outdoor) */}
          {selectedLocation && selectedLocation !== 'Home' && (
            <div>
              <h4 className="text-lg font-bold mb-4">
                Select {selectedLocation === 'Gym' ? 'Gym' : selectedLocation === 'Hotel' ? 'Hotel' : 'Outdoor Space'}
              </h4>
              {availableFacilities.length > 0 ? (
                <div className="space-y-2">
                  {availableFacilities.map((facility) => (
                    <button
                      key={facility.id}
                      onClick={() => setSelectedFacility(facility.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedFacility === facility.id
                          ? 'border-lime-500 bg-lime-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <p className="font-semibold">{facility.name}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {facility.address || facility.amenities || facility.type}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">
                  No {selectedLocation.toLowerCase()} available in {selectedCity}
                </p>
              )}
            </div>
          )}

          {/* Home Training Confirmation */}
          {selectedLocation === 'Home' && (
            <div className="p-4 bg-sky-500/20 border border-sky-500/30 rounded-lg">
              <p className="text-sky-300 font-medium">✓ Training will be at your home in {selectedCity}</p>
              <p className="text-sm text-sky-200 mt-1">The trainer will come to your preferred location</p>
            </div>
          )}

          {/* Session Package Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4">Select Package</h4>
            <div className="space-y-3">
              {selectedLocation &&
                sessionPackages.map((pkg) => {
                  const monthlyRate = monthlyRates[selectedLocation];
                  const trainingCost = monthlyRate * pkg.durationMonths;
                  const discountAmount = trainingCost * pkg.discountPercent;
                  const trainingCostAfterDiscount = trainingCost - discountAmount;

                  const requiresGymMembership = pkg.requiresGymMembership && selectedLocation === 'Gym';
                  const gymMembershipCost = requiresGymMembership ? gymMembershipFee * pkg.durationMonths : 0;

                  const totalCost = trainingCostAfterDiscount + gymMembershipCost;

                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPackage === pkg.id
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{pkg.label}</p>
                          <p className="text-sm text-slate-400">{pkg.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-emerald-400 text-lg">{formatMVR(totalCost)}</p>
                          <p className="text-sm text-slate-400">{formatUSD(totalCost)}</p>
                          {discountAmount > 0 && (
                            <p className="text-xs text-lime-300 mt-1">
                              Save {formatMVR(discountAmount)} ({(pkg.discountPercent * 100).toFixed(0)}%)
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Schedule Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Select Time Slot
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trainer.availability_calendar.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                    selectedSlot === slot
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          {selectedLocation && selectedPackage && selectedFacility && (
            <PriceBreakdown
              pkg={sessionPackages.find((p) => p.id === selectedPackage)}
              selectedLocation={selectedLocation}
              facilityName={availableFacilities.find((f) => f.id === selectedFacility)?.name ?? 'Selected Location'}
            />
          )}

          {/* CTA */}
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold py-4 rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all text-lg"
          >
            Proceed to Secure Checkout
          </button>

          <p className="text-xs text-slate-400 text-center">
            By booking, you agree to our Terms of Service and Cancellation Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceBreakdown({ pkg, selectedLocation, facilityName }) {
  const monthlyRate = monthlyRates[selectedLocation];
  const trainingCost = monthlyRate * pkg.durationMonths;
  const discountAmount = trainingCost * pkg.discountPercent;
  const trainingCostAfterDiscount = trainingCost - discountAmount;

  const requiresGymMembership = pkg.requiresGymMembership && selectedLocation === 'Gym';
  const gymMembershipCost = requiresGymMembership ? gymMembershipFee * pkg.durationMonths : 0;

  const totalCost = trainingCostAfterDiscount + gymMembershipCost;

  return (
    <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-lime-400/20 rounded-lg border border-emerald-500/30">
      <div className="mb-4">
        <p className="text-sm text-slate-300 font-medium mb-3">
          <MapPin className="w-4 h-4 inline -mt-1 mr-1" />
          {facilityName}
        </p>
      </div>

      {/* Training Cost */}
      <div className="space-y-2 mb-4 pb-4 border-b border-emerald-500/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Monthly Rate ({selectedLocation}):</span>
          <span className="font-medium">{formatMVR(monthlyRate)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Duration ({pkg.label}):</span>
          <span className="font-medium">{pkg.durationMonths.toFixed(2)} months</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Subtotal:</span>
          <span className="font-medium">{formatMVR(trainingCost)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-lime-300">
            <span>Discount ({(pkg.discountPercent * 100).toFixed(0)}%):</span>
            <span>-{formatMVR(discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-emerald-500/20">
          <span className="text-slate-300">Training Cost:</span>
          <span className="text-emerald-300">{formatMVR(trainingCostAfterDiscount)}</span>
        </div>
      </div>

      {/* Gym Membership Fee (if applicable) */}
      {requiresGymMembership && (
        <div className="space-y-2 mb-4 pb-4 border-b border-emerald-500/30 bg-blue-500/10 border-l-4 border-l-blue-500 pl-3">
          <p className="text-xs text-blue-300 font-semibold uppercase">Gym Membership Fee</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Monthly Membership:</span>
            <span className="font-medium">{formatMVR(gymMembershipFee)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Duration:</span>
            <span className="font-medium">{pkg.durationMonths.toFixed(0)} month(s)</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-blue-500/20">
            <span className="text-slate-300">Membership Total:</span>
            <span className="text-blue-300">{formatMVR(gymMembershipCost)}</span>
          </div>
        </div>
      )}

      {/* Total Cost */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-slate-300 font-bold">Total Cost:</span>
        <div className="text-right">
          <p className="text-2xl font-black text-emerald-400">{formatMVR(totalCost)}</p>
          <p className="text-sm text-slate-300">{formatUSD(totalCost)}</p>
        </div>
      </div>
    </div>
  );
}
