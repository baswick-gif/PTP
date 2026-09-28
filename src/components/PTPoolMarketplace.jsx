import { useState, useMemo, useCallback } from 'react';
import Navbar from './Navbar.jsx';
import SearchHero from './SearchHero.jsx';
import TrainerGrid from './TrainerGrid.jsx';
import PromoBanner from './PromoBanner.jsx';
import BookingModal from './BookingModal.jsx';
import TrainerProfileModal from './TrainerProfileModal.jsx';
import Footer from './Footer.jsx';
import Toast from './Toast.jsx';
import { trainers } from '../data/marketplaceData.js';

const PTPoolMarketplace = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileTrainer, setProfileTrainer] = useState(null);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({ city: '', location: '', specialty: '' });

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');

  const allSpecialties = useMemo(() => [...new Set(trainers.flatMap((t) => t.specialties))], []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const cityMatch = !filters.city || trainer.available_cities.includes(filters.city);
      const locationMatch = !filters.location || trainer.available_locations.includes(filters.location);
      const specialtyMatch = !filters.specialty || trainer.specialties.includes(filters.specialty);
      return cityMatch && locationMatch && specialtyMatch;
    });
  }, [filters]);

  const handleOpenBooking = useCallback((trainer) => {
    setProfileTrainer(null);
    setSelectedTrainer(trainer);
    setSelectedCity('');
    setSelectedLocation('');
    setSelectedFacility('');
    setSelectedSlots([]);
    setSelectedPackage('');
    setBookingModalOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingModalOpen(false);
  }, []);

  const handleViewProfile = useCallback((trainer) => {
    setProfileTrainer(trainer);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setProfileTrainer(null);
  }, []);

  const handleCheckout = useCallback(() => {
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
    setToast({ type: 'success', message: `Booking confirmed with ${selectedTrainer.name}!` });
    setTimeout(() => {
      setBookingModalOpen(false);
      setToast(null);
    }, 2000);
  }, [selectedCity, selectedLocation, selectedFacility, selectedSlots, selectedPackage, selectedTrainer]);

  return (
    <div className="min-h-screen bg-wash-body text-ink font-sans">
      <Toast toast={toast} />

      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <SearchHero filters={filters} setFilters={setFilters} allSpecialties={allSpecialties} />

      <TrainerGrid
        trainers={filteredTrainers}
        filters={filters}
        onBook={handleOpenBooking}
        onViewProfile={handleViewProfile}
      />

      <PromoBanner />

      {profileTrainer && (
        <TrainerProfileModal trainer={profileTrainer} onClose={handleCloseProfile} onBook={handleOpenBooking} />
      )}

      {bookingModalOpen && selectedTrainer && (
        <BookingModal
          trainer={selectedTrainer}
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
          onClose={handleCloseBooking}
          onCheckout={handleCheckout}
        />
      )}

      <Footer />
    </div>
  );
};

export default PTPoolMarketplace;
