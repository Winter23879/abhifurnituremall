import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, Menu, X, ArrowRight, Sparkles, MapPin, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'spaces' | 'planner' | 'craft' | 'admin';
  setActiveTab: (tab: 'home' | 'catalog' | 'spaces' | 'planner' | 'craft' | 'admin') => void;
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenSampleKit: () => void;
  onOpenVisitModal?: () => void;
  onSelectCategory?: (cat: string) => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenSampleKit,
  onOpenVisitModal,
  onSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearch) {
      onSearch(searchQuery.trim());
    } else {
      setActiveTab('catalog');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    if (onSearch) {
      onSearch(term);
    } else {
      setActiveTab('catalog');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'catalog', label: 'Furniture' },
    { id: 'spaces', label: 'Spaces' },
    { id: 'planner', label: 'Room Planner' },
    { id: 'craft', label: 'Our Craft' },
  ] as const;

  const quickSearchPills = [
    'Sofa',
    'Dining Table',
    'Platform Bed',
    'Writing Desk',
    'Lounge Chair',
    'Oak Credenza',
    'Lighting',
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2DA] transition-all">
      {/* Sleek Top Announcement Bar */}
      <div className="bg-[#2A2825] text-[#F5F1EB] px-4 sm:px-6 lg:px-12 py-2 text-[11px] sm:text-xs flex justify-between items-center tracking-wide">
        <div className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] shrink-0" />
          <span className="truncate">
            Complimentary white-glove delivery in Andhra Pradesh on orders over ₹75,000
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-5 shrink-0 text-[#CBC6C1]">
          {onOpenVisitModal && (
            <button
              onClick={onOpenVisitModal}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center space-x-1"
            >
              <MapPin className="w-3 h-3 text-[#D4A373]" />
              <span>Showrooms: Vijayawada · Vizag · Tirupati</span>
            </button>
          )}
          <span className="text-[#494643]">|</span>
          <button
            onClick={onOpenSampleKit}
            className="hover:text-[#D4A373] transition-colors cursor-pointer"
          >
            Free Material Swatches
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo: Clean, Legible, Architectural */}
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-[26px] font-medium tracking-[0.14em] text-[#1C1C18] group-hover:text-[#9E582C] transition-colors leading-none">
                ABHI
              </span>
              <span className="text-[9.5px] uppercase tracking-[0.24em] font-semibold text-[#804116] mt-1 leading-none">
                Furniture Mall
              </span>
            </div>
          </button>
        </div>

        {/* Center: Clean & Uncluttered Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 text-sm tracking-[0.03em] text-[#53433B]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id as any)}
                className={`py-2 transition-all relative font-medium cursor-pointer ${
                  isActive
                    ? 'text-[#1C1C18] font-semibold'
                    : 'hover:text-[#1C1C18]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9E582C] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Thoughtful, Spacious Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search furniture"
            className="p-2 sm:p-2.5 rounded-[4px] text-[#53433B] hover:text-[#1C1C18] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
            title="Search catalog"
          >
            <Search className="w-5 h-5 text-[#53433B]" />
          </button>

          {/* Swatch Quick Order (Desktop) */}
          <button
            onClick={onOpenSampleKit}
            className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#804116] hover:text-[#FFFFFF] hover:bg-[#9E582C] px-3.5 py-2 border border-[#D4A373]/60 rounded-[4px] transition-all cursor-pointer bg-[#F5F1EB]/50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Swatches</span>
          </button>

          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label="Saved pieces"
              className="relative p-2 sm:p-2.5 rounded-[4px] text-[#53433B] hover:text-[#1C1C18] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              title="Saved pieces"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlistCount > 0 ? 'fill-[#9E582C] text-[#9E582C]' : 'text-[#53433B]'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#9E582C] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            className="relative flex items-center space-x-2 px-3 py-2 rounded-[4px] text-[#1C1C18] hover:bg-[#F5F1EB] border border-[#E7E2DA] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#1C1C18]" />
            <span className="text-xs font-semibold tracking-wider hidden sm:inline uppercase">
              Cart
            </span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1C1C18] text-[#FFFFFF] text-[11px] font-bold flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="md:hidden p-2 text-[#1C1C18] hover:bg-[#F5F1EB] rounded-[4px] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#1C1C18]" />}
          </button>
        </div>
      </div>

      {/* Expandable Global Header Search Bar */}
      {searchOpen && (
        <div className="bg-[#FFFFFF] border-b border-[#E7E2DA] px-4 sm:px-6 lg:px-12 py-4 animate-fadeIn shadow-sm">
          <div className="max-w-[800px] mx-auto space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#86736A]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture (e.g., Sofa, Dining Table, Bed, Desk, Oak, Linen)..."
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#1C1C18] placeholder-[#86736A] focus:outline-none focus:border-[#9E582C]"
              />
              <div className="absolute right-2 flex items-center space-x-1.5">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[3px] hover:bg-[#2A2825] transition-colors cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-[#86736A] hover:text-[#1C1C18] cursor-pointer"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Suggestion Pills */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-[#86736A] uppercase tracking-wider mr-1">
                Popular:
              </span>
              {quickSearchPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleQuickSearch(pill)}
                  className="px-2.5 py-1 bg-[#F5F1EB] hover:bg-[#9E582C] text-[#53433B] hover:text-[#FFFFFF] rounded-full text-xs transition-colors cursor-pointer border border-[#E7E2DA]"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E7E2DA] px-6 py-6 space-y-5 animate-fadeIn">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#86736A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sofa, bed, table, desk..."
              className="w-full pl-9 pr-16 py-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#1C1C18] focus:outline-none focus:border-[#9E582C]"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-[#9E582C] text-white text-[11px] font-semibold uppercase rounded-[3px]"
            >
              Go
            </button>
          </form>

          <div className="flex flex-col space-y-1 divide-y divide-[#E7E2DA]">
            <button
              onClick={() => {
                setActiveTab('catalog');
                setMobileMenuOpen(false);
              }}
              className="py-3 text-left flex items-center justify-between text-sm font-semibold text-[#1C1C18]"
            >
              <div>
                <div>Furniture Collection</div>
                <div className="text-[11px] text-[#86736A] font-normal">Chairs, tables, beds, and credenzas</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('spaces');
                setMobileMenuOpen(false);
              }}
              className="py-3 text-left flex items-center justify-between text-sm font-semibold text-[#1C1C18]"
            >
              <div>
                <div>Spaces & Lookbook</div>
                <div className="text-[11px] text-[#86736A] font-normal">Curated architectural room sets</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('planner');
                setMobileMenuOpen(false);
              }}
              className="py-3 text-left flex items-center justify-between text-sm font-semibold text-[#1C1C18]"
            >
              <div>
                <div>Room Planner</div>
                <div className="text-[11px] text-[#86736A] font-normal">2D floorplan & spatial layout tool</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('craft');
                setMobileMenuOpen(false);
              }}
              className="py-3 text-left flex items-center justify-between text-sm font-semibold text-[#1C1C18]"
            >
              <div>
                <div>Our Craft & Joinery</div>
                <div className="text-[11px] text-[#86736A] font-normal">FSC timber and Japanese joinery methods</div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onOpenSampleKit();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#9E582C] text-[#FFFFFF] text-xs font-semibold tracking-wider uppercase rounded-[4px] hover:bg-[#804116] transition-colors"
            >
              Order Free Material Swatches
            </button>

            {onOpenVisitModal && (
              <button
                onClick={() => {
                  onOpenVisitModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-[#E7E2DA] text-[#53433B] text-xs font-semibold tracking-wider uppercase rounded-[4px] hover:bg-[#F5F1EB] transition-colors"
              >
                Book Showroom Visit (AP)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
