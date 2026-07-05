import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-slate-900" />
              </div>
              <span className="font-black text-lg">PT Pool</span>
            </div>
            <p className="text-sm text-slate-400">
              Elite personal trainers, available anywhere, on your terms.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#trainers" className="hover:text-emerald-400 transition">
                  Browse Trainers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Register as PT
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} PT Pool. All rights reserved. Trainers keep 100% of their base rate.</p>
        </div>
      </div>
    </footer>
  );
}
