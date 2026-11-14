import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenSampleKit: () => void;
  onOpenPlanner: () => void;
  onOpenVisitModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSampleKit,
  onOpenPlanner,
  onOpenVisitModal,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#1C1C18] text-[#E7E2DA] border-t border-[#31302D] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        {/* Main 4-Column Grid: Balanced & Perfectly Aligned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#31302D]">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl font-semibold tracking-wider text-white">
                ABHI
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#D4A373] block mt-0.5">
                Furniture Mall
              </span>
            </div>

            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Handcrafted solid wood furniture designed for modern Indian homes. Ethically sourced certified timber built to last generations.
            </p>

            <div className="space-y-2 pt-1 text-xs text-[#CBC6C1]">
              <a
                href="tel:+918662489100"
                className="flex items-center space-x-2 hover:text-[#D4A373] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>+91 866 248 9100</span>
              </a>

              <a
                href="mailto:support@abhifurnituremall.in"
                className="flex items-center space-x-2 hover:text-[#D4A373] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>support@abhifurnituremall.in</span>
              </a>

              <div className="flex items-center space-x-2 text-[#A8A29E]">
                <MapPin className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>Andhra Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Shop Furniture
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => onSelectCategory('living')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Living Room & Sofas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dining')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dining Tables & Chairs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bedroom')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beds & Bedroom Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('study')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Desks & Workspaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('lighting')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lighting & Decor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="text-[#D4A373] hover:underline transition-colors cursor-pointer font-medium"
                >
                  View All Pieces →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Services & Tools */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={onOpenPlanner}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2D Room Planner
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSampleKit}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Free Swatch Samples
                </button>
              </li>
              {onOpenVisitModal && (
                <li>
                  <button
                    onClick={onOpenVisitModal}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Book Showroom Visit
                  </button>
                </li>
              )}
              <li className="pt-2 text-[11px] text-[#A8A29E] space-y-1">
                <div className="text-white font-medium">Delivery Coverage:</div>
                <div>Free delivery over ₹75,000 across Andhra Pradesh, Telangana & Pan-India.</div>
              </li>
            </ul>
          </div>

          {/* Column 4: Showrooms & Newsletter */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Stay Connected
            </h4>

            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Subscribe to get design updates, new seasonal arrivals, and showroom event invitations.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! You are subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-xs bg-[#2A2825] border border-[#494643] rounded-l text-white placeholder:text-[#86736A] focus:outline-none focus:border-[#D4A373]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#9E582C] hover:bg-[#804116] text-white text-xs font-semibold uppercase tracking-wider rounded-r transition-colors cursor-pointer shrink-0"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-[11px] text-[#A8A29E] space-y-1">
              <span className="text-white font-medium block">Experience Showrooms:</span>
              <div>Vijayawada · Visakhapatnam · Tirupati</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean, Single Line Alignment */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86736A]">
          <div>
            © {new Date().getFullYear()} Abhi Furniture Mall. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <span>100% Solid Certified Timber</span>
            <span>·</span>
            <span>White-Glove Assembly</span>
            <span>·</span>
            <span>10-Year Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
