import { useEffect, useRef } from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { sessionPackages, gyms, hotels, outdoorSpaces } from '../data/marketplaceData.js';
import { formatMVR, formatUSD } from '../utils/currency.js';
import { locationIcons } from './locationIcons.jsx';
import StarRating from './StarRating.jsx';

function getAvailableFacilities(city, location) {
  if (!city || !location) return [];
  if (location === 'Gym') return gyms.filter((g) => g.city === city);
  if (location === 'Hotel') return hotels.filter((h) => h.city === city);
  if (location === 'Outdoor') return outdoorSpaces.filter((s) => s.city === city);
  if (location === 'Home') return [{ id: 'home', name: `Your Home in ${city}`, city }];
  return [];
}

const OPTION_BASE = 'p-4 border-2 transition-all';
const OPTION_SELECTED = 'border-lagoon bg-lagoon-wash';
const OPTION_UNSELECTED = 'border-line bg-surface/50 hover:border-lagoon-edge';

export default function BookingModal({
  trainer,
  selectedCity,
  setSelectedCity,
  selectedLocation,
  setSelectedLocation,
  selectedFacility,
  setSelectedFacility,
  selectedSlots,
  setSelectedSlots,
  selectedPackage,
  setSelectedPackage,
  onClose,
  onCheckout,
}) {
  const closeButtonRef = useRef(null);
  const isRecurringPackage = selectedPackage && selectedPackage !== 'one_day';
  const maxSlots = 6;

  const toggleSlot = (slot) => {
    if (!isRecurringPackage) {
      setSelectedSlots([slot]);
      return;
    }
    setSelectedSlots((prev) => {
      if (prev.includes(slot)) return prev.filter((s) => s !== slot);
      if (prev.length >= maxSlots) return prev;
      return [...prev, slot];
    });
  };

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
  // The membership fee belongs to the gym, not the trainer — pulled from that gym's own rate card,
  // and only ever relevant when training happens at a gym (never Home, Hotel, or Outdoor).
  const selectedGym = selectedLocation === 'Gym' ? gyms.find((g) => g.id === selectedFacility) : null;
  const gymFee = selectedGym?.monthlyFee ?? 0;

  return (
    <div
      className="fixed inset-0 bg-paper/85 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card sm:border max-w-3xl w-full h-full sm:h-auto border-0 border-line shadow-2xl max-h-full sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-line px-6 py-4 flex items-center justify-between safe-top">
          <h2 id="booking-modal-title" className="font-display text-2xl">
            Book with {trainer.name}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-10 h-10 flex items-center justify-center hover:bg-surface transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 pb-32 sm:pb-6">
          {/* Trainer Summary */}
          <div className="flex gap-4 pb-6 border-b border-line">
            <img
              src={trainer.image_url}
              alt={trainer.name}
              className="w-24 h-32 object-cover object-top flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold mb-2">{trainer.name}</h3>
              <p className="text-ink-70 mb-3 text-sm">{trainer.bio}</p>
              <StarRating rating={trainer.rating} reviewCount={trainer.review_count} />
            </div>
          </div>

          {/* City Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-lagoon-deep" />
              Select City
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {trainer.available_cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`${OPTION_BASE} text-center ${selectedCity === city ? OPTION_SELECTED : OPTION_UNSELECTED}`}
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
                  className={`${OPTION_BASE} text-left flex items-start gap-3 ${
                    selectedLocation === loc ? OPTION_SELECTED : OPTION_UNSELECTED
                  }`}
                >
                  <div className={`mt-1 ${selectedLocation === loc ? 'text-lagoon-deep' : 'text-ink-45'}`}>
                    {locationIcons[loc]}
                  </div>
                  <div>
                    <p className="font-semibold">{loc}</p>
                    <p className="text-sm text-ink-70 font-mono">
                      {formatMVR(trainer.monthlyRates[loc])} / {formatUSD(trainer.monthlyRates[loc])}
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
                      className={`w-full ${OPTION_BASE} text-left ${
                        selectedFacility === facility.id ? OPTION_SELECTED : OPTION_UNSELECTED
                      }`}
                    >
                      <p className="font-semibold">{facility.name}</p>
                      <p className="text-sm text-ink-70 mt-1">
                        {facility.address || facility.amenities || facility.type}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-ink-70 text-center py-4">
                  No {selectedLocation.toLowerCase()} available in {selectedCity}
                </p>
              )}
            </div>
          )}

          {/* Home Training Confirmation */}
          {selectedLocation === 'Home' && (
            <div className="p-4 bg-blue-wash">
              <p className="text-blue-ink font-medium">✓ Training will be at your home in {selectedCity}</p>
              <p className="text-sm text-blue-ink/80 mt-1">The trainer will come to your preferred location</p>
            </div>
          )}

          {/* Session Package Selector */}
          <div>
            <h4 className="text-lg font-bold mb-4">Select Package</h4>
            <div className="space-y-3">
              {selectedLocation &&
                sessionPackages.map((pkg) => {
                  const monthlyRate = trainer.monthlyRates[selectedLocation];
                  const trainingCost = monthlyRate * pkg.durationMonths;
                  const discountAmount = trainingCost * pkg.discountPercent;
                  const trainingCostAfterDiscount = trainingCost - discountAmount;

                  const requiresGymMembership = pkg.requiresGymMembership && selectedLocation === 'Gym';
                  const gymMembershipCost = requiresGymMembership ? gymFee * pkg.durationMonths : 0;

                  const totalCost = trainingCostAfterDiscount + gymMembershipCost;

                  return (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setSelectedSlots([]);
                      }}
                      className={`w-full ${OPTION_BASE} text-left ${
                        selectedPackage === pkg.id ? OPTION_SELECTED : OPTION_UNSELECTED
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{pkg.label}</p>
                          <p className="text-sm text-ink-70">{pkg.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lagoon-deep text-lg font-mono">{formatMVR(totalCost)}</p>
                          <p className="text-sm text-ink-70 font-mono">{formatUSD(totalCost)}</p>
                          {discountAmount > 0 && (
                            <p className="text-xs text-lagoon-deep mt-1">
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
            <h4 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-lagoon-deep" />
              {isRecurringPackage ? 'Select Weekly Time Slots' : 'Select Time Slot'}
            </h4>
            <p className="text-sm text-ink-70 mb-4">
              {isRecurringPackage
                ? `Choose 2–6 recurring times per week for this package. ${selectedSlots.length} of ${maxSlots} selected.`
                : 'Choose the date and time for your session.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trainer.availability_calendar.map((slot) => {
                const isSelected = selectedSlots.includes(slot);
                const isDisabled = isRecurringPackage && !isSelected && selectedSlots.length >= maxSlots;
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    disabled={isDisabled}
                    className={`p-3 border-2 transition-all font-medium text-sm ${
                      isSelected
                        ? 'border-lagoon bg-lagoon-wash text-lagoon-deep'
                        : isDisabled
                        ? 'border-line bg-surface/30 text-ink-45 cursor-not-allowed'
                        : `${OPTION_UNSELECTED} text-ink-70`
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          {selectedLocation && selectedPackage && selectedFacility && (
            <PriceBreakdown
              pkg={sessionPackages.find((p) => p.id === selectedPackage)}
              selectedLocation={selectedLocation}
              facilityName={availableFacilities.find((f) => f.id === selectedFacility)?.name ?? 'Selected Location'}
              monthlyRate={trainer.monthlyRates[selectedLocation]}
              gymFee={gymFee}
            />
          )}

          {/* CTA */}
          <button
            onClick={onCheckout}
            className="w-full bg-lagoon text-ink-solid font-bold uppercase tracking-wide py-4 hover:bg-lagoon-deep transition text-base"
          >
            Proceed to Secure Checkout
          </button>

          <p className="text-xs text-ink-70 text-center">
            By booking, you agree to our Terms of Service and Cancellation Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceBreakdown({ pkg, selectedLocation, facilityName, monthlyRate, gymFee }) {
  const trainingCost = monthlyRate * pkg.durationMonths;
  const discountAmount = trainingCost * pkg.discountPercent;
  const trainingCostAfterDiscount = trainingCost - discountAmount;

  const requiresGymMembership = pkg.requiresGymMembership && selectedLocation === 'Gym';
  const gymMembershipCost = requiresGymMembership ? gymFee * pkg.durationMonths : 0;

  const totalCost = trainingCostAfterDiscount + gymMembershipCost;

  return (
    <div className="p-4 bg-lagoon-wash border border-lagoon-edge">
      <div className="mb-4">
        <p className="text-sm text-ink-70 font-medium mb-3">
          <MapPin className="w-4 h-4 inline -mt-1 mr-1" />
          {facilityName}
        </p>
      </div>

      {/* Training Cost */}
      <div className="space-y-2 mb-4 pb-4 border-b border-lagoon-edge font-mono">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-70">Monthly Rate ({selectedLocation}):</span>
          <span className="font-medium">{formatMVR(monthlyRate)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-70">Duration ({pkg.label}):</span>
          <span className="font-medium">{pkg.durationMonths.toFixed(2)} months</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-70">Subtotal:</span>
          <span className="font-medium">{formatMVR(trainingCost)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-lagoon-deep">
            <span>Discount ({(pkg.discountPercent * 100).toFixed(0)}%):</span>
            <span>-{formatMVR(discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-lagoon-edge">
          <span className="text-ink-70">Training Cost:</span>
          <span className="text-lagoon-deep">{formatMVR(trainingCostAfterDiscount)}</span>
        </div>
      </div>

      {/* Gym Membership Fee (if applicable) */}
      {requiresGymMembership && (
        <div className="space-y-2 mb-4 pb-4 border-b border-lagoon-edge bg-blue-wash border-l-4 border-l-blue-ink pl-3 font-mono">
          <p className="text-xs text-blue-ink font-semibold uppercase">Gym Membership Fee</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-70">Monthly Membership:</span>
            <span className="font-medium">{formatMVR(gymFee)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-70">Duration:</span>
            <span className="font-medium">{pkg.durationMonths.toFixed(0)} month(s)</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-blue-ink/20">
            <span className="text-ink-70">Membership Total:</span>
            <span className="text-blue-ink">{formatMVR(gymMembershipCost)}</span>
          </div>
        </div>
      )}

      {/* Total Cost */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-ink-70 font-bold">Total Cost:</span>
        <div className="text-right font-mono">
          <p className="text-2xl font-black text-lagoon-deep">{formatMVR(totalCost)}</p>
          <p className="text-sm text-ink-70">{formatUSD(totalCost)}</p>
        </div>
      </div>
    </div>
  );
}
