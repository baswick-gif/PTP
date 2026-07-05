import { Menu, X, User, Dumbbell } from 'lucide-react';

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-black text-lg tracking-tight">PT Pool</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#trainers" className="text-sm font-medium hover:text-emerald-400 transition">
            Browse Trainers
          </a>
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            Register as PT
          </button>
          <button
            aria-label="Account"
            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition"
          >
            <User className="w-5 h-5" />
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
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <a
            href="#trainers"
            onClick={closeMenu}
            className="block text-sm font-medium hover:text-emerald-400 transition py-2"
          >
            Browse Trainers
          </a>
          <button
            onClick={closeMenu}
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-900 font-bold rounded-lg"
          >
            Register as PT
          </button>
        </div>
      )}
    </nav>
  );
}
