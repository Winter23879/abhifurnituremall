import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeEditorialSpotlightProps {
  onSelectCategory: (category: string) => void;
}

interface SpotlightOfferCard {
  id: string;
  title: string;
  subtitle: string;
  offer: string;
  category: string;
  image: string;
  imageAlt: string;
}

const OFFER_CARDS: SpotlightOfferCard[] = [
  {
    id: 'lounge-sofas',
    title: 'SOFAS & LOUNGES',
    subtitle: 'Furniture for your everyday comfort.',
    offer: 'Upto 40% OFF',
    category: 'living',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Low-profile linen modular sofa in warm living room',
  },
  {
    id: 'coffee-tables',
    title: 'COFFEE TABLES',
    subtitle: 'Furniture for your everyday living.',
    offer: 'Upto 35% OFF',
    category: 'living',
    image:
      'https://images.unsplash.com/photo-1533779283484-8da49adc9d74?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Low wooden coffee table in serene living room',
  },
  {
    id: 'credenza-units',
    title: 'TV & CREDENZA UNITS',
    subtitle: 'Furniture for your everyday entertainment.',
    offer: 'Upto 30% OFF',
    category: 'living',
    image:
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Fluted Hinoki architectural media credenza',
  },
  {
    id: 'dining-tables',
    title: 'DINING TABLES',
    subtitle: 'Handcrafted oak for everyday gatherings.',
    offer: 'Upto 25% OFF',
    category: 'dining',
    image:
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Minimalist white oak dining table',
  },
  {
    id: 'platform-beds',
    title: 'PLATFORM BEDS',
    subtitle: 'Serene Hinoki frames for restful nights.',
    offer: 'Upto 30% OFF',
    category: 'bedroom',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Floating Japanese Hinoki platform bed',
  },
  {
    id: 'washi-lighting',
    title: 'WASHI LUMINAIRES',
    subtitle: 'Warm ambient lighting for quiet evenings.',
    offer: 'Upto 20% OFF',
    category: 'lighting',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Handmade mulberry washi paper pendant luminaire',
  },
];

export const HomeEditorialSpotlight: React.FC<HomeEditorialSpotlightProps> = ({
  onSelectCategory,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);

  const [translateX, setTranslateX] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [stepSize, setStepSize] = useState(420);

  useEffect(() => {
    const updateMetrics = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const firstCard = track.firstElementChild as HTMLElement | null;
      const computedGap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '20') || 20;
      const cardStep = firstCard ? firstCard.offsetWidth + computedGap : 420;

      setMaxTranslate(maxOffset);
      setStepSize(cardStep);
      setTranslateX((prev) => Math.min(prev, maxOffset));
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  const handleStep = (direction: 'left' | 'right') => {
    setTranslateX((prev) => {
      if (maxTranslate <= 0) return 0;
      if (direction === 'right') {
        if (prev >= maxTranslate - 4) return 0;
        return Math.min(maxTranslate, prev + stepSize);
      }
      if (prev <= 4) return maxTranslate;
      return Math.max(0, prev - stepSize);
    });
  };

  return (
    <section className="bg-[#FFFFFF] py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-5">
        {/* Top Wide Feature Banner */}
        <div className="relative rounded-[4px] overflow-hidden border border-[#E7E2DA] bg-[#2A2825] h-[340px] sm:h-[420px] lg:h-[480px] shadow-[0_12px_36px_-8px_rgba(42,40,37,0.1)] group">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85"
            alt="Warm solid wood living sanctuary at Abhi Furniture Mall"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          />

          {/* Bottom Scrim for Centered Editorial Typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C18]/85 via-[#1C1C18]/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10 px-6 text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-normal tracking-[0.02em] text-[#FBF9F5]">
              THE BEST PLANS? HOME.
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F1EB]/90">
              Settle in and let the day unfold.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-[#FBF9F5] border-b border-[#D4A373] pb-1 hover:text-[#D4A373] transition-colors cursor-pointer"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Offer Cards Strip (GPU-accelerated translate3d) */}
        <div className="relative">
          <div
            ref={viewportRef}
            onPointerDown={(e) => {
              dragStartXRef.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (dragStartXRef.current === null) return;
              const deltaX = e.clientX - dragStartXRef.current;
              dragStartXRef.current = null;
              if (Math.abs(deltaX) > 40) {
                handleStep(deltaX < 0 ? 'right' : 'left');
              }
            }}
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-5 will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translate3d(-${translateX}px, 0, 0)` }}
            >
              {OFFER_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => onSelectCategory(card.category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCategory(card.category);
                    }
                  }}
                  className="relative shrink-0 w-[84%] sm:w-[48%] lg:w-[39%] h-[220px] sm:h-[250px] rounded-[4px] overflow-hidden border border-[#E7E2DA] hover:border-[#D4A373] bg-[#2A2825] shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9E582C]"
                >
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                  />

                  {/* Left Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C18]/85 via-[#1C1C18]/45 to-transparent" />

                  {/* Card Copy */}
                  <div className="absolute inset-y-0 left-0 p-6 sm:p-7 flex flex-col justify-between max-w-[65%]">
                    <div>
                      <h3 className="font-sans text-lg sm:text-xl font-medium tracking-[0.04em] text-[#FBF9F5] uppercase">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#F5F1EB]/90 mt-1 leading-relaxed">
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <span className="block text-sm sm:text-base font-medium text-[#FBF9F5]">
                        {card.offer}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(card.category);
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#FBF9F5] hover:bg-[#9E582C] text-[#1C1C18] hover:text-[#FBF9F5] text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left / Right Scroll Arrows */}
          <button
            type="button"
            onClick={() => handleStep('left')}
            aria-label="Scroll offer cards left"
            className="flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FBF9F5]/90 hover:bg-[#FFFFFF] text-[#2A2825] border border-[#E7E2DA] shadow-md items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleStep('right')}
            aria-label="Scroll offer cards right"
            className="flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#FBF9F5]/90 hover:bg-[#FFFFFF] text-[#2A2825] border border-[#E7E2DA] shadow-md items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
