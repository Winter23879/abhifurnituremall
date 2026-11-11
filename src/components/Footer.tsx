import React, { useState } from 'react';
import { CheckCircle, Phone, Mail, Calendar, MessageCircle } from 'lucide-react';

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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#2A2825] text-[#F5F1EB] pt-16 pb-12 border-t border-[#31302D]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-[#494643] pb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex flex-col items-center text-center">
              <div className="flex items-center space-x-2.5">
                <span className="w-4 h-[1px] bg-[#D4A373]" />
                <span className="font-serif text-3xl font-semibold tracking-[0.22em] pl-[0.22em] leading-none text-[#D4A373]">
                  AFH
                </span>
                <span className="w-4 h-[1px] bg-[#D4A373]" />
              </div>
              <p className="mt-1.5 text-[10px] tracking-[0.18em] uppercase text-[#F5F1EB] font-semibold">
                Abhi Furniture Hall
              </p>
            </div>
            <p className="text-xs text-[#CBC6C1] leading-relaxed max-w-sm">
              We create serene architectural objects that honor the quiet geometry of Japanese timber craftsmanship and the organic honesty of Danish design. Handcrafted by master sashimono artisans.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.08em] font-semibold text-[#D4A373]">
              Atelier Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#CBC6C1]">
              <li>
                <button
                  onClick={() => onSelectCategory('living')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Living Sanctuaries & Lounges
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dining')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Dining Tables & Woven Seating
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bedroom')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Platform Beds & Tatami Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('lighting')}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Washi Paper Luminaires
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPlanner}
                  className="hover:text-[#D4A373] transition-colors text-[#F5F1EB]"
                >
                  Spatial Studio (Room Planner) →
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Architectural Monograph */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.08em] font-semibold text-[#D4A373]">
              The Architectural Monograph
            </h4>
            <p className="text-xs text-[#CBC6C1] leading-relaxed">
              Receive quarterly essays on timber joinery, quiet interiors, and upcoming limited releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#31302D] rounded-[4px] border border-[#6D533E] text-xs text-[#D4A373] flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#9E582C]" />
                <span>You are enrolled in the Monograph journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@example.in"
                  className="flex-1 p-2.5 text-xs bg-[#1C1C18] border border-[#494643] rounded-[4px] text-[#FFFFFF] placeholder:text-[#86736A] focus:outline-none focus:border-[#9E582C]"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#804116] transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Showrooms & Ateliers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#CBC6C1] border-b border-[#494643] pb-10">
          <div>
            <span className="font-semibold text-[#FFFFFF] block mb-1 uppercase tracking-wider">
              Vijayawada Flagship Showroom
            </span>
            <p>40-1-52 MG Road, Benz Circle</p>
            <p>Vijayawada, Andhra Pradesh 520010, India</p>
            <p className="text-[#86736A] mt-1">Tuesday–Sunday · By Appointment</p>
          </div>

          <div>
            <span className="font-semibold text-[#FFFFFF] block mb-1 uppercase tracking-wider">
              Visakhapatnam Coastal Studio
            </span>
            <p>14-2-8 Beach Road, Siripuram</p>
            <p>Visakhapatnam, Andhra Pradesh 530003, India</p>
            <p className="text-[#86736A] mt-1">Monday–Saturday · Walk-ins Welcome</p>
          </div>

          <div>
            <span className="font-semibold text-[#FFFFFF] block mb-1 uppercase tracking-wider">
              Tirupati Design Hall
            </span>
            <p>22 Air Bypass Road, Karakambadi</p>
            <p>Tirupati, Andhra Pradesh 517501, India</p>
            <p className="text-[#86736A] mt-1">Architectural Consultations Daily</p>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#494643] pb-8 text-xs text-[#CBC6C1]">
          <div className="flex flex-wrap items-center gap-6">
            <a href="tel:+918662489100" className="inline-flex items-center space-x-2 hover:text-[#FFFFFF] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>+91 866 248 9100</span>
            </a>
            <a href="mailto:studio@abhifurniturehall.in" className="inline-flex items-center space-x-2 hover:text-[#FFFFFF] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>studio@abhifurniturehall.in</span>
            </a>
            <a
              href="https://wa.me/918662489100"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 hover:text-[#FFFFFF] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>WhatsApp Showroom Desk</span>
            </a>
          </div>

          {onOpenVisitModal && (
            <button
              type="button"
              onClick={onOpenVisitModal}
              className="inline-flex items-center space-x-2 py-2 px-4 rounded-[4px] border border-[#D4A373]/60 text-[#F5F1EB] hover:bg-[#9E582C] hover:border-[#9E582C] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Showroom Visit</span>
            </button>
          )}
        </div>

        {/* Bottom Rights */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#86736A] gap-4">
          <div>
            © {new Date().getFullYear()} AFH — Abhi Furniture Hall. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <button onClick={onOpenSampleKit} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">
              Sample Box Request
            </button>
            <span>·</span>
            <span>100% FSC Forest Stewardship</span>
            <span>·</span>
            <span>Zero Polyurethane Finishes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
