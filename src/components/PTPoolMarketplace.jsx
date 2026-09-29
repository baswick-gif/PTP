import { useState, useMemo, useCallback, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import SearchHero from './SearchHero.jsx';
import TrainerGrid from './TrainerGrid.jsx';
import PromoBanner from './PromoBanner.jsx';
import BookingModal from './BookingModal.jsx';
import TrainerProfileModal from './TrainerProfileModal.jsx';
import Footer from './Footer.jsx';
import Toast from './Toast.jsx';
import { fetchMarketplace, createBooking } from '../api.js';

const PTPoolMarketplace = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileTrainer, setProfileTrainer] = useState(null);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({ city: '', location: '', specialty: '' });

  const [trainers, setTrainers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'ready' | 'error'

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [booking, setBooking] = useState(false);

  const loadMarketplace = useCallback(() => {
    setLoadState('loading');
    fetchMarketplace()
      .then(({ trainers, facilities }) => {
        setTrainers(trainers);
        setFacilities(facilities);
        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));
  }, []);

  useEffect(() => {
    loadMarketplace();
  }, [loadMarketplace]);

  const allSpecialties = useMemo(() => [...new Set(trainers.flatMap((t) => t.specialties))], [trainers]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const cityMatch = !filters.city || trainer.available_cities.includes(filters.city);
      const locationMatch = !filters.location || trainer.available_locations.includes(filters.location);
      const specialtyMatch = !filters.specialty || trainer.specialties.includes(filters.specialty);
      return cityMatch && locationMatch && specialtyMatch;
    });
  }, [trainers, filters]);

  const handleOpenBooking = useCallback((trainer) => {
    setProfileTrainer(null);
    setSelectedTrainer(trainer);
    setSelectedCity('');
    setSelectedLocation('');
    setSelectedFacility('');
    setSelectedSlots([]);
    setSelectedPackage('');
    setContact({ name: '', email: '', phone: '' });
    setBookingModalOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    if (booking) return; // don't let Escape/backdrop close mid-submit
    setBookingModalOpen(false);
  }, [booking]);

  const handleViewProfile = useCallback((trainer) => {
    setProfileTrainer(trainer);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setProfileTrainer(null);
  }, []);

  const handleCheckout = useCallback(async () => {
    const isRecurringPackage = selectedPackage && selectedPackage !== 'one_day';
    const minSlotsRequired = isRecurringPackage ? 2 : 1;

    if (!selectedCity || !selectedLocation || !selectedFacility || !selectedPackage || selectedSlots.length < minSlotsRequired) {
      const message = isRecurringPackage && selectedSlots.length < minSlotsRequired
        ? 'Please select at least 2 weekly time slots.'
        : 'Please complete all selections before proceeding.';
      setToast({ type: 'error', message });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (!contact.name.trim() || !contact.email.trim()) {
      setToast({ type: 'error', message: 'Enter your name and email so we can confirm the booking.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setBooking(true);
    try {
      const confirmed = await createBooking({
        trainerId: selectedTrainer.id,
        slotIds: selectedSlots,
        customerName: contact.name.trim(),
        customerEmail: contact.email.trim(),
        customerPhone: contact.phone.trim(),
        city: selectedCity,
        location: selectedLocation,
        facilityId: selectedFacility === 'home' ? '' : selectedFacility,
        packageId: selectedPackage,
      });
      setToast({
        type: 'success',
        message: `Booking confirmed with ${confirmed.trainerName} — ${confirmed.slotLabels.join(', ')}!`,
      });
      setBookingModalOpen(false);
      loadMarketplace(); // refresh so the slot(s) just booked disappear everywhere
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setBooking(false);
      setTimeout(() => setToast(null), 4000);
    }
  }, [selectedCity, selectedLocation, selectedFacility, selectedSlots, selectedPackage, selectedTrainer, contact, loadMarketplace]);

  return (
    <div className="min-h-screen bg-wash-body text-ink font-sans">
      <Toast toast={toast} />

      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <SearchHero filters={filters} setFilters={setFilters} allSpecialties={allSpecialties} />

      {loadState === 'error' ? (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h3 className="text-xl font-semibold mb-2">Couldn't load trainers</h3>
          <p className="text-ink-70 mb-6">Something went wrong reaching the server. Please try again.</p>
          <button
            onClick={loadMarketplace}
            className="bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm py-3 px-6 hover:bg-lagoon-deep transition"
          >
            Retry
          </button>
        </div>
      ) : loadState === 'loading' ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-ink-70" role="status">
          Loading trainers…
        </div>
      ) : (
        <TrainerGrid
          trainers={filteredTrainers}
          filters={filters}
          onBook={handleOpenBooking}
          onViewProfile={handleViewProfile}
        />
      )}

      <PromoBanner />

      {profileTrainer && (
        <TrainerProfileModal trainer={profileTrainer} onClose={handleCloseProfile} onBook={handleOpenBooking} />
      )}

      {bookingModalOpen && selectedTrainer && (
        <BookingModal
          trainer={selectedTrainer}
          facilities={facilities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
          selectedPackage={selectedPackage}
          setSelectedPackage={setSelectedPackage}
          contact={contact}
          setContact={setContact}
          booking={booking}
          onClose={handleCloseBooking}
          onCheckout={handleCheckout}
        />
      )}

      <Footer />
    </div>
  );
};

export default PTPoolMarketplace;
