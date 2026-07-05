import { useState, useMemo, useCallback } from 'react';
import Navbar from './Navbar.jsx';
import SearchHero from './SearchHero.jsx';
import TrainerGrid from './TrainerGrid.jsx';
import PromoBanner from './PromoBanner.jsx';
import BookingModal from './BookingModal.jsx';
import Footer from './Footer.jsx';
import Toast from './Toast.jsx';
import { trainers } from '../data/marketplaceData.js';

const PTPoolMarketplace = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({ city: '', location: '', specialty: '' });

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
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
    setSelectedTrainer(trainer);
    setSelectedCity('');
    setSelectedLocation('');
    setSelectedFacility('');
    setSelectedSlot('');
    setSelectedPackage('');
    setBookingModalOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingModalOpen(false);
  }, []);

  const handleCheckout = useCallback(() => {
    if (!selectedCity || !selectedLocation || !selectedFacility || !selectedSlot || !selectedPackage) {
      setToast({ type: 'error', message: 'Please complete all selections before proceeding.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', message: `Booking confirmed with ${selectedTrainer.name}!` });
    setTimeout(() => {
      setBookingModalOpen(false);
      setToast(null);
    }, 2000);
  }, [selectedCity, selectedLocation, selectedFacility, selectedSlot, selectedPackage, selectedTrainer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-slate-50">
      <Toast toast={toast} />

      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <SearchHero filters={filters} setFilters={setFilters} allSpecialties={allSpecialties} />

      <TrainerGrid trainers={filteredTrainers} filters={filters} onBook={handleOpenBooking} />

      <PromoBanner />

      {bookingModalOpen && selectedTrainer && (
        <BookingModal
          trainer={selectedTrainer}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
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
