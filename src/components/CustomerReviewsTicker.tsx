import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Sparkles, ShieldCheck } from 'lucide-react';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  piecePurchased: string;
  rating: number;
  date: string;
  title: string;
  quote: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Dr. Harsha Vardhan & Sunitha',
    location: 'Benz Circle, Vijayawada',
    piecePurchased: 'Sora 8-Seater Solid Oak Dining Slab',
    rating: 5,
    date: 'Verified Buyer · October 2026',
    title: 'An absolute heirloom for our family',
    quote:
      'The table is heavy, solid oak with seamless butterfly keys. The Vijayawada delivery team brought it into our dining hall, assembled it on-site, and removed every bit of packing. Our dinner guests haven’t stopped complimenting it.',
  },
  {
    id: 'rev-2',
    author: 'Karthik & Sneha Reddy',
    location: 'Siripuram, Visakhapatnam',
    piecePurchased: 'Komorebi Lounge Chair in Natural Bouclé',
    rating: 5,
    date: 'Verified Buyer · November 2026',
    title: 'Grounded, soothing, and deeply comfortable',
    quote:
      'Sitting in this chair after a long day at the hospital has become our favorite evening ritual. The bouclé wool is tactile and plush, while the cantilevered timber frame feels rock-solid and architecturally serene.',
  },
  {
    id: 'rev-3',
    author: 'Vikramaditya Raju',
    location: 'Jubilee Hills, Hyderabad',
    piecePurchased: 'Nara Fluted Tambour Credenza',
    rating: 5,
    date: 'Verified Buyer · September 2026',
    title: 'Sliding tambour doors glide like silk',
    quote:
      'The acoustic dampening on the sliding slats is remarkable—zero rattle. The rear cable port allowed us to discreetly house our audio equipment with perfect ventilation. Five-star craftsmanship.',
  },
  {
    id: 'rev-4',
    author: 'Ananya & Deepthi S.',
    location: 'Air Bypass Road, Tirupati',
    piecePurchased: 'Asahi Floating Platform Bed with Tatami',
    rating: 5,
    date: 'Verified Buyer · October 2026',
    title: 'Aromatic rush tatami & zero creaks',
    quote:
      'The natural igusa rush tatami panels give our bedroom a subtle herbal freshness. The cantilevered ledges replace bulky nightstands and the frame has zero creaks or squeaks. The best sleep investment we’ve made.',
  },
  {
    id: 'rev-5',
    author: 'Prof. M. S. Murthy',
    location: 'Guntur Central, Andhra Pradesh',
    piecePurchased: 'Tirupati Writing Desk & Bodhi Leather Chair',
    rating: 5,
    date: 'Verified Buyer · November 2026',
    title: 'Ergonomic chamfer relieves all wrist fatigue',
    quote:
      'As a university researcher writing 8 hours a day, the chamfered desk edge makes a huge difference. The solid oak finish has already deepened into a rich amber tone. Far superior to synthetic laminate furniture.',
  },
  {
    id: 'rev-6',
    author: 'Siddharth & Priya Menon',
    location: 'Indiranagar, Bengaluru',
    piecePurchased: 'Kumo Modular Sectional in Belgian Linen',
    rating: 5,
    date: 'Verified Buyer · October 2026',
    title: 'Arrived in Bangalore in flawless wooden crates',
    quote:
      'We were hesitant ordering online from Bangalore, but the freight team delivered in reinforced wooden crates with zero scuffs. The bio-foam core is supportive yet cloud-like, and the linen covers wash easily.',
  },
  {
    id: 'rev-7',
    author: 'Rajeshwari Naidu',
    location: 'Auto Nagar, Vijayawada',
    piecePurchased: 'Amaravati Handwoven Cane Sofa-Cum-Bed',
    rating: 5,
    date: 'Verified Buyer · August 2026',
    title: 'Smooth pull-out mechanism my parents can use',
    quote:
      'The pull-out solid timber deck is so balanced that even my elderly mother operates it effortlessly. The handwoven rattan cane panels stay cool in the Andhra summer heat. Truly functional art.',
  },
  {
    id: 'rev-8',
    author: 'Raghav & Pooja V.',
    location: 'Adyar, Chennai',
    piecePurchased: 'Krishna Four-Door Louvered Sideboard',
    rating: 5,
    date: 'Verified Buyer · November 2026',
    title: 'Protects our heirloom ceramic & brassware',
    quote:
      'We use this credenza for our heirloom dinnerware. The soft-close wooden runners and ventilated rear slats protect everything from humidity. The solid brass hardware adds an understated luxurious warmth.',
  },
];

interface CustomerReviewsTickerProps {
  onOpenSampleKit?: () => void;
}

export const CustomerReviewsTicker: React.FC<CustomerReviewsTickerProps> = ({
  onOpenSampleKit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalReviews = REVIEWS.length;

  // Responsive device listener for viewport-aware slide widths
  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1); // Mobile: 1 full card
      } else if (width < 1024) {
        setVisibleCount(2); // Tablet: 2 cards
      } else {
        setVisibleCount(3); // Desktop & Ultra-wide: 3 cards
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount, { passive: true });
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, totalReviews - visibleCount);

  // Keep currentIndex within bounds when switching screen orientation
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, maxIndex, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Fluid 5-second automatic progression, pausing on hover or touch
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentIndex, maxIndex]);

  // Touch Swipe Handlers for mobile smartphones & tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // Minimum swipe threshold of 45px
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  return (
    <section
      className="bg-[#F5F1EB] border-t border-[#E7E2DA] py-12 sm:py-16 lg:py-20 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Customer Reviews"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-5 sm:pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-[#804116] uppercase tracking-[0.1em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
              <span>Verified Homeowner Experiences · 480+ Homes Furnished</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C1C18] tracking-tight">
              Loved by Homeowners Across South India
            </h2>
            <p className="text-xs sm:text-sm text-[#53433B] mt-1 max-w-2xl">
              Authentic testimonials from families, architects, and interior designers who live with our solid timber pieces daily.
            </p>
          </div>

          {/* Aggregate Rating & Manual Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 shrink-0">
            <div className="flex items-center space-x-2 bg-[#FFFFFF] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-[4px] border border-[#E7E2DA] shadow-xs">
              <div className="flex text-[#D4A373]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-xs text-[#1C1C18]">4.95 / 5.0</span>
              <span className="text-[10px] sm:text-[11px] text-[#86736A] hidden xs:inline">(480+ Homes)</span>
            </div>

            {/* Hardware-Accelerated Smooth Arrows */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous review"
                className="w-9 h-9 rounded-[4px] bg-[#FFFFFF] hover:bg-[#2A2825] active:scale-95 text-[#1C1C18] hover:text-[#FFFFFF] border border-[#E7E2DA] transition-all flex items-center justify-center cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9E582C]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next review"
                className="w-9 h-9 rounded-[4px] bg-[#FFFFFF] hover:bg-[#2A2825] active:scale-95 text-[#1C1C18] hover:text-[#FFFFFF] border border-[#E7E2DA] transition-all flex items-center justify-center cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9E582C]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fluid Hardware-Accelerated Sliding Track */}
        <div className="relative overflow-hidden w-full">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col"
              >
                <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between shadow-xs hover:shadow-sm hover:border-[#D4A373] transition-all duration-300 relative group min-h-[300px] sm:min-h-[320px]">
                  <Quote className="absolute top-5 right-5 sm:top-6 sm:right-6 w-7 h-7 sm:w-8 sm:h-8 text-[#E7E2DA]/80 pointer-events-none group-hover:text-[#D4A373]/40 transition-colors" />

                  <div className="space-y-3">
                    {/* Stars & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#D4A373] space-x-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#86736A] bg-[#FBF9F5] px-2 py-0.5 rounded border border-[#E7E2DA]">
                        {review.date}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1C18] line-clamp-1">
                      {review.title}
                    </h3>

                    {/* Quote text */}
                    <p className="text-xs sm:text-sm text-[#53433B] leading-relaxed line-clamp-4">
                      "{review.quote}"
                    </p>
                  </div>

                  {/* Reviewer Details & Piece Tag */}
                  <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-[#F5F1EB] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#1C1C18] flex items-center space-x-1.5">
                          <span>{review.author}</span>
                          <span title="Verified Purchase" className="flex items-center text-[#9E582C]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86736A]">{review.location}</div>
                      </div>
                    </div>

                    {/* Piece Purchased Tag */}
                    <div className="text-[10px] text-[#804116] bg-[#F5F1EB] px-2.5 py-1 rounded-[3px] border border-[#E7E2DA] truncate font-medium">
                      Piece: {review.piecePurchased}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Progress Indicators */}
        <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 pt-1">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide group ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-[#9E582C]' : 'w-2 bg-[#D9C2B7] hover:bg-[#86736A]'
              }`}
            />
          ))}
        </div>

        {/* Responsive Reassurance Banner */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] flex flex-col sm:flex-row items-center justify-between text-xs text-[#53433B] gap-3 sm:gap-4 shadow-xs">
          <div className="flex items-center space-x-2.5 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-[#9E582C] shrink-0 hidden sm:inline" />
            <span className="leading-relaxed">
              Every order arrives in reinforced timber crates with <strong>Free White-Glove In-Home Assembly</strong> across Andhra Pradesh & Telangana.
            </span>
          </div>

          {onOpenSampleKit && (
            <button
              type="button"
              onClick={onOpenSampleKit}
              className="text-[#804116] font-semibold hover:text-[#2A2825] uppercase tracking-wider text-[11px] shrink-0 underline underline-offset-4 decoration-[#D4A373] transition-colors cursor-pointer"
            >
              Order Free Material Swatches →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
