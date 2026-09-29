import { Menu, X } from 'lucide-react';
import Wordmark from './Wordmark.jsx';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-line safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Wordmark />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          <a href="#trainers" className="text-sm font-medium text-ink-70 hover:text-lagoon transition">
            Browse Trainers
          </a>
          <a href="#" className="text-sm font-medium text-ink-70 hover:text-lagoon transition">
            Gyms &amp; Venues
          </a>
          <a href="#" className="text-sm font-medium text-ink-70 hover:text-lagoon transition">
            Client Login
          </a>
          <a href="#" className="text-sm font-medium text-ink-45 hover:text-lagoon transition">
            Admin Login
          </a>
          <button className="px-6 py-2.5 bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm hover:bg-lagoon-deep transition">
            Register as PT
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden w-11 h-11 flex items-center justify-center -mr-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-paper p-4 space-y-1">
          <a href="#trainers" onClick={closeMenu} className="block text-sm font-medium text-ink-70 hover:text-lagoon transition py-2">
            Browse Trainers
          </a>
          <a href="#" onClick={closeMenu} className="block text-sm font-medium text-ink-70 hover:text-lagoon transition py-2">
            Gyms &amp; Venues
          </a>
          <a href="#" onClick={closeMenu} className="block text-sm font-medium text-ink-70 hover:text-lagoon transition py-2">
            Client Login
          </a>
          <a href="#" onClick={closeMenu} className="block text-sm font-medium text-ink-45 hover:text-lagoon transition py-2">
            Admin Login
          </a>
          <button
            onClick={closeMenu}
            className="w-full px-4 py-3 mt-3 bg-lagoon text-ink-solid font-bold uppercase tracking-wide text-sm hover:bg-lagoon-deep transition"
          >
            Register as PT
          </button>
        </div>
      )}
    </nav>
  );
}
