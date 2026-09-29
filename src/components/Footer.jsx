import Wordmark from './Wordmark.jsx';
import { FacebookIcon, InstagramIcon, TiktokIcon } from './SocialIcons.jsx';

const SOCIAL_LINKS = [
  { label: 'TikTok', Icon: TiktokIcon, href: '#' },
  { label: 'Facebook', Icon: FacebookIcon, href: '#' },
  { label: 'Instagram', Icon: InstagramIcon, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-line py-12 safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Wordmark />
            </div>
            <p className="text-sm text-ink-70 mb-4">
              Elite personal trainers, available anywhere, on your terms.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Follow FORMO on ${label}`}
                  className="text-ink-45 hover:text-lagoon transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-ink-70">
              <li>
                <a href="#trainers" className="hover:text-lagoon-deep transition">
                  Browse Trainers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Gyms &amp; Venues
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Register as PT
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-ink-70">
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ink-70">
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lagoon-deep transition">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-line pt-8 text-center text-sm text-ink-45">
          <p>&copy; {new Date().getFullYear()} FORMO. All rights reserved. Trainers keep 100% of their base rate.</p>
        </div>
      </div>
    </footer>
  );
}
