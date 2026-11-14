import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalReviews = REVIEWS.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, activeIndex]);

  return (
    <section
      className="bg-[#F5F1EB] border-t border-[#E7E2DA] py-14 lg:py-20 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-semibold text-[#804116] uppercase tracking-[0.1em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
              <span>Verified Homeowner Experiences · 480+ Homes Furnished</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18] tracking-tight">
              Loved by Homeowners Across South India
            </h2>
            <p className="text-xs sm:text-sm text-[#53433B] mt-1 max-w-2xl">
              Real testimonials from families, architects, and interior designers who live with our solid timber pieces daily.
            </p>
          </div>

          {/* Rating Summary & Navigation Controls */}
          <div className="flex items-center space-x-4 shrink-0">
            <div className="hidden sm:flex items-center space-x-2 bg-[#FFFFFF] px-3.5 py-2 rounded-[4px] border border-[#E7E2DA] shadow-xs">
              <div className="flex text-[#D4A373]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-xs text-[#1C1C18]">4.95 / 5.0</span>
              <span className="text-[11px] text-[#86736A]">(480+ Deliveries)</span>
            </div>

            {/* Manual Arrows */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous review"
                className="w-9 h-9 rounded-[4px] bg-[#FFFFFF] hover:bg-[#2A2825] text-[#1C1C18] hover:text-[#FFFFFF] border border-[#E7E2DA] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next review"
                className="w-9 h-9 rounded-[4px] bg-[#FFFFFF] hover:bg-[#2A2825] text-[#1C1C18] hover:text-[#FFFFFF] border border-[#E7E2DA] transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Reviews Carousel Track */}
        <div className="relative">
          {/* Visible 3-Card Carousel on Desktop / 1-Card on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const review = REVIEWS[(activeIndex + offset) % totalReviews];
              return (
                <div
                  key={review.id}
                  className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-300 relative group"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-[#E7E2DA]/80 pointer-events-none group-hover:text-[#D4A373]/40 transition-colors" />

                  <div className="space-y-3.5">
                    {/* Stars & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#D4A373] space-x-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
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
                  <div className="pt-5 mt-5 border-t border-[#F5F1EB] space-y-2">
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

                    {/* Piece Purchased Pill */}
                    <div className="text-[10px] text-[#804116] bg-[#F5F1EB] px-2.5 py-1 rounded-[3px] border border-[#E7E2DA] truncate font-medium">
                      Piece: {review.piecePurchased}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Progress Indicators */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx ? 'w-8 bg-[#9E582C]' : 'w-2 bg-[#D9C2B7] hover:bg-[#86736A]'
              }`}
            />
          ))}
        </div>

        {/* Reassurance Banner under reviews */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] flex flex-col sm:flex-row items-center justify-between text-xs text-[#53433B] gap-4 shadow-xs">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#9E582C] shrink-0 hidden sm:inline" />
            <span>
              Every piece is delivered in protective timber packaging with <strong>Free White-Glove In-Home Assembly</strong> across Andhra Pradesh & Telangana.
            </span>
          </div>

          {onOpenSampleKit && (
            <button
              type="button"
              onClick={onOpenSampleKit}
              className="text-[#804116] font-semibold hover:text-[#2A2825] uppercase tracking-wider text-[11px] shrink-0 underline underline-offset-4 decoration-[#D4A373] cursor-pointer"
            >
              Order Free Material Swatches →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
