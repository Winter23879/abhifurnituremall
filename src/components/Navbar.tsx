import React, { useState } from 'react';
import { ShoppingBag, Compass, Grid, Sparkles, BookOpen, Menu, X, ArrowRight, Heart, Calendar } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'spaces' | 'planner' | 'craft';
  setActiveTab: (tab: 'home' | 'catalog' | 'spaces' | 'planner' | 'craft') => void;
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenSampleKit: () => void;
  onOpenVisitModal?: () => void;
  onSelectCategory?: (cat: string) => void;
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E2DA] transition-all">
      {/* Top Architectural Notice Bar */}
      <div className="bg-[#2A2825] text-[#F5F1EB] px-4 py-2 text-xs flex justify-between items-center tracking-[0.06em] uppercase">
        <div className="hidden md:flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E582C]"></span>
          <span>Complimentary Architectural Freight on Orders Over ₹75,000</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center space-x-4">
          <button
            onClick={onOpenSampleKit}
            className="hover:text-[#D4A373] transition-colors underline underline-offset-4 decoration-[#9E582C] cursor-pointer"
          >
            Order Material Swatch Kit (Free)
          </button>
          {onOpenVisitModal && (
            <>
              <span className="text-[#86736A] hidden sm:inline">|</span>
              <button
                onClick={onOpenVisitModal}
                className="hidden sm:inline-flex items-center space-x-1 hover:text-[#D4A373] transition-colors cursor-pointer"
              >
                <Calendar className="w-3 h-3 text-[#D4A373]" />
                <span>Book Showroom Visit</span>
              </button>
            </>
          )}
          <span className="text-[#86736A] hidden sm:inline">|</span>
          <span className="text-[#DDD9D4] hidden lg:inline">Vijayawada · Visakhapatnam · Tirupati</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center text-center group focus:outline-none cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-4 h-[1px] bg-[#D4A373] transition-all duration-300 group-hover:w-6 group-hover:bg-[#9E582C]" />
              <span className="font-serif text-2xl lg:text-[28px] font-semibold tracking-[0.22em] pl-[0.22em] leading-none text-[#9E582C] group-hover:text-[#1C1C18] transition-colors">
                AFH
              </span>
              <span className="w-4 h-[1px] bg-[#D4A373] transition-all duration-300 group-hover:w-6 group-hover:bg-[#9E582C]" />
            </div>
            <p className="mt-1 text-[9.5px] tracking-[0.18em] text-[#53433B] uppercase font-semibold">
              Abhi Furniture Hall
            </p>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-sm tracking-[0.04em] font-medium text-[#53433B]">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-1 transition-colors relative ${
              activeTab === 'catalog'
                ? 'text-[#9E582C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#9E582C]'
                : 'hover:text-[#2A2825]'
            }`}
          >
            Curated Collection
          </button>

          <button
            onClick={() => setActiveTab('spaces')}
            className={`pb-1 transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'spaces'
                ? 'text-[#9E582C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#9E582C]'
                : 'hover:text-[#2A2825]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#9E582C]" />
            <span>Spaces & Lookbook</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`pb-1 transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'planner'
                ? 'text-[#9E582C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#9E582C]'
                : 'hover:text-[#2A2825]'
            }`}
          >
            <Grid className="w-4 h-4 text-[#9E582C]" />
            <span>Spatial Studio</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFE7DB] text-[#804116] font-semibold">
              Interactive
            </span>
          </button>

          <button
            onClick={() => setActiveTab('craft')}
            className={`pb-1 transition-colors relative flex items-center space-x-1.5 ${
              activeTab === 'craft'
                ? 'text-[#9E582C] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#9E582C]'
                : 'hover:text-[#2A2825]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#86736A]" />
            <span>Philosophy & Joinery</span>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button
            onClick={onOpenSampleKit}
            className="hidden xl:flex items-center space-x-2 text-xs font-semibold tracking-[0.04em] uppercase text-[#2A2825] hover:text-[#9E582C] py-2 px-3 border border-[#E7E2DA] rounded-[4px] hover:border-[#D4A373] transition-all bg-[#FFFFFF] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
            <span>Request Swatches</span>
          </button>

          {/* Wishlist Trigger */}
          {onOpenWishlist && (
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label="View saved wishlist"
              className="relative p-2.5 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] hover:bg-[#F5F1EB] hover:border-[#D4A373] text-[#2A2825] transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#9E582C] text-[#9E582C]' : 'text-[#2A2825]'}`} />
              {wishlistCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2A2825] text-[#FBF9F5] text-[11px] font-bold leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View architectural cart"
            className="relative p-2.5 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] hover:bg-[#F5F1EB] hover:border-[#D4A373] text-[#2A2825] transition-all flex items-center space-x-2 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#2A2825]" />
            <span className="text-xs font-semibold tracking-wider hidden sm:inline">
              ARCHIVE
            </span>
            {cartCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#9E582C] text-[#FBF9F5] text-xs font-bold leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-[#2A2825] hover:bg-[#F5F1EB] rounded-[4px]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F5] border-b border-[#E7E2DA] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-[#2A2825]">
            <button
              onClick={() => {
                setActiveTab('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 border-b border-[#E7E2DA] flex items-center justify-between ${
                activeTab === 'catalog' ? 'text-[#9E582C] font-semibold' : ''
              }`}
            >
              <span>Curated Collection</span>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('spaces');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 border-b border-[#E7E2DA] flex items-center justify-between ${
                activeTab === 'spaces' ? 'text-[#9E582C] font-semibold' : ''
              }`}
            >
              <span>Spaces & Lookbook</span>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <button
              onClick={() => {
                setActiveTab('planner');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 border-b border-[#E7E2DA] flex items-center justify-between ${
                activeTab === 'planner' ? 'text-[#9E582C] font-semibold' : ''
              }`}
            >
              <span>Spatial Studio Planner</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFE7DB] text-[#804116]">
                Interactive
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('craft');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 border-b border-[#E7E2DA] flex items-center justify-between ${
                activeTab === 'craft' ? 'text-[#9E582C] font-semibold' : ''
              }`}
            >
              <span>Philosophy & Joinery</span>
              <ArrowRight className="w-4 h-4 text-[#86736A]" />
            </button>

            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenSampleKit();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold tracking-wider uppercase rounded-[4px] hover:bg-[#2A2825] transition-colors"
              >
                Order Complimentary Swatches
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
