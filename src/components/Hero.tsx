import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Percent, BadgePercent } from 'lucide-react';

interface HeroProps {
  onExploreCollection: () => void;
  onOpenPlanner: () => void;
  onSelectSpace: () => void;
  onSelectCategory?: (category: string) => void;
}

interface CarouselSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  priceTag: string;
  category: string;
  image: string;
  imageAlt: string;
  footnote: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'festive-living',
    eyebrow: 'Festive Archive',
    headline: 'SALE',
    subtitle: 'Sofas & Lounge Seating',
    priceTag: 'Starting from ₹44,500',
    category: 'living',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Warm architectural living room with handcrafted oak lounge seating',
    footnote: 'T&C Apply*',
  },
  {
    id: 'nordic-dining',
    eyebrow: 'Handcrafted Timber',
    headline: 'DINING',
    subtitle: 'Minimalist Tables & Benches',
    priceTag: 'Starting from ₹24,500',
    category: 'dining',
    image:
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Sunlit Nordic-Japanese dining table and woven bench',
    footnote: 'FSC Certified Oak*',
  },
  {
    id: 'serenity-bedroom',
    eyebrow: 'Serenity Suite',
    headline: 'BEDROOM',
    subtitle: 'Hinoki Platform Beds',
    priceTag: 'Starting from ₹1,05,000',
    category: 'bedroom',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Low-slung Japanese Hinoki platform bed in calm bedroom interior',
    footnote: 'Zero Metal Fasteners*',
  },
  {
    id: 'washi-lighting',
    eyebrow: 'Warm Washi Glow',
    headline: 'LIGHTING',
    subtitle: 'Luminaires & Study Pieces',
    priceTag: 'Starting from ₹14,500',
    category: 'lighting',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Ambient lighting and sculptural architectural timber cabinetry',
    footnote: 'Ships in 5 Days*',
  },
];

// Initial countdown: 3 days, 10 hours, 25 minutes, 17 seconds
const INITIAL_COUNTDOWN_SECONDS = 3 * 86400 + 10 * 3600 + 25 * 60 + 17;

const padTwo = (value: number) => value.toString().padStart(2, '0');

const SaleCountdown: React.FC<{ isPaused: boolean }> = React.memo(({ isPaused }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_COUNTDOWN_SECONDS);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : INITIAL_COUNTDOWN_SECONDS));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="flex items-start space-x-2 sm:space-x-2.5 text-center">
      {[
        { value: padTwo(days), label: 'Days' },
        { value: padTwo(hours), label: 'Hrs' },
        { value: padTwo(minutes), label: 'Mins' },
        { value: padTwo(seconds), label: 'Secs' },
      ].map((unit, idx) => (
        <React.Fragment key={unit.label}>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-medium tabular-nums text-[#1C1C18] leading-none">
              {unit.value}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.06em] text-[#86736A] mt-1">
              {unit.label}
            </span>
          </div>
          {idx < 3 && (
            <span className="font-serif text-xl text-[#86736A] leading-none pt-0.5">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

export const Hero: React.FC<HeroProps> = ({
  onExploreCollection,
  onSelectCategory,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const slideTimer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(slideTimer);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setIsPaused(false);
  };

  const handleSlideAction = (category: string) => {
    onSelectCategory?.(category);
    onExploreCollection();
  };

  return (
    <section
      className="bg-[#FBF9F5] border-b border-[#E7E2DA] min-h-[calc(100dvh-113px)] md:h-[calc(100dvh-113px)] md:min-h-[600px] flex flex-col select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Signature Furniture Carousel"
    >
      {/* Full-Width Architectural Carousel */}
      <div className="flex-1 min-h-0 flex flex-col max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-12 py-3 sm:py-5">
        <div className="relative flex-1 min-h-[380px] sm:min-h-[420px] md:min-h-0 overflow-hidden rounded-[4px] border border-[#E7E2DA] bg-[#2A2825] shadow-[0_12px_36px_-8px_rgba(42,40,37,0.12)]">
          {/* Slides Track (GPU-composited translate3d) */}
          <div
            className="flex h-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}
          >
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="relative w-full h-full min-h-[380px] sm:min-h-[420px] md:min-h-0 shrink-0"
              >
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />

                {/* Warm Charcoal Gradient Scrim for Editorial Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C18]/85 via-[#1C1C18]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C18]/40 via-transparent to-transparent" />

                {/* Left-Aligned Editorial Callout */}
                <div className="absolute inset-y-0 left-0 flex items-center px-6 sm:px-12 lg:px-20 max-w-2xl">
                  <div className="text-left">
                    <p className="font-sans text-base sm:text-2xl lg:text-[28px] font-light tracking-[0.04em] text-[#FBF9F5]/95">
                      {slide.eyebrow}
                    </p>

                    <h1 className="font-serif text-4xl sm:text-6xl lg:text-[84px] font-normal tracking-[0.04em] leading-[0.95] text-[#FBF9F5] mt-1">
                      {slide.headline}
                    </h1>

                    <div className="w-10 sm:w-12 h-[1px] bg-[#D4A373] my-3 sm:my-4" />

                    <p className="font-sans text-sm sm:text-xl font-medium text-[#FBF9F5] tracking-wide">
                      {slide.subtitle}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleSlideAction(slide.category)}
                      className="mt-3 sm:mt-3.5 inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-[4px] bg-[#9E582C] hover:bg-[#804116] text-[#FBF9F5] text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-colors duration-200 cursor-pointer"
                    >
                      {slide.priceTag}
                    </button>
                  </div>
                </div>

                {/* Bottom-Right Spec / T&C Note */}
                <span className="absolute bottom-3.5 right-4 sm:right-5 text-[10px] sm:text-[11px] font-medium text-[#FBF9F5]/85 tracking-wide">
                  {slide.footnote}
                </span>
              </div>
            ))}
          </div>

          {/* Left / Right Circular Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FBF9F5]/85 hover:bg-[#FFFFFF] text-[#2A2825] border border-[#E7E2DA] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FBF9F5]/85 hover:bg-[#FFFFFF] text-[#2A2825] border border-[#E7E2DA] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom-Center Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
            {SLIDES.map((slide, index) => {
              const isActive = index === activeSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 bg-[#FBF9F5] shadow-sm'
                      : 'w-2 bg-[#FBF9F5]/50 hover:bg-[#FBF9F5]/80'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Promotional & Countdown Strip matching Japandi Palette */}
      <div className="shrink-0 bg-[#F5F1EB] border-t border-[#E7E2DA]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E7E2DA] items-center gap-3 md:gap-0">
            {/* Column 1: Live Sale Countdown */}
            <div className="flex items-center justify-center md:justify-start md:pr-6 gap-3 sm:gap-4 pb-2 md:pb-0">
              <div className="leading-tight">
                <span className="block text-xs sm:text-sm font-bold tracking-[0.08em] uppercase text-[#9E582C]">
                  SALE
                </span>
                <span className="block text-[11px] sm:text-xs font-medium text-[#53433B]">
                  Ends In
                </span>
              </div>

              <SaleCountdown isPaused={isPaused} />
            </div>

            {/* Column 2: No Cost EMI */}
            <div className="flex items-center justify-center py-2 md:py-0 md:px-6 gap-2.5 sm:gap-3 flex-wrap">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#9E582C]/40 bg-[#FBF9F5] flex items-center justify-center shrink-0">
                  <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9E582C]" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[11px] sm:text-xs font-bold tracking-[0.06em] uppercase text-[#1C1C18]">
                    NO COST EMI
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#53433B]">
                    on leading banks
                  </span>
                </div>
              </div>

              <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-1.5">
                {['ICICI', 'HDFC', 'AXIS', 'KOTAK'].map((bank) => (
                  <span
                    key={bank}
                    className="px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold tracking-[0.05em] rounded-[3px] bg-[#FFFFFF] border border-[#E7E2DA] text-[#2A2825]"
                  >
                    {bank}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 3: Buy More, Save More */}
            <div className="flex items-center justify-center md:justify-end pt-2 md:pt-0 md:pl-6 gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#9E582C]/40 bg-[#FBF9F5] flex items-center justify-center shrink-0">
                <BadgePercent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9E582C]" />
              </div>
              <div className="leading-tight text-center sm:text-left">
                <span className="block text-[11px] sm:text-xs font-bold tracking-[0.04em] text-[#9E582C]">
                  Buy More, Save More
                </span>
                <span className="block text-[10px] sm:text-[11px] text-[#53433B]">
                  Get Extra Up to 15% Instant Discount*
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
