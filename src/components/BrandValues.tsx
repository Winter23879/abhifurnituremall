import React from 'react';

interface BrandValuesProps {
  onExploreCraft: () => void;
}

interface ValueCard {
  id: string;
  title: string;
  caption: string;
  image: string;
  imageAlt: string;
}

const VALUES: ValueCard[] = [
  {
    id: 'makers',
    title: 'MAKERS',
    caption: 'Master sashimono woodworkers & Nordic joiners',
    image:
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Artisan woodworking and timber shaping in studio workshop',
  },
  {
    id: 'craftsmanship',
    title: 'CRAFTSMANSHIP',
    caption: 'Hand-rubbed organic oils & tailored natural upholstery',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Close-up of fine sculpted chair craftsmanship and upholstery',
  },
  {
    id: 'design',
    title: 'DESIGN',
    caption: 'Quiet architectural proportions & zero visible fasteners',
    image:
      'https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Woven paper cord bench showcasing detailed timber joinery',
  },
  {
    id: 'sustainability',
    title: 'SUSTAINABILITY',
    caption: '100% FSC-certified timber & zero polyurethane finishes',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Natural timber interior surrounded by forest light',
  },
];

export const BrandValues: React.FC<BrandValuesProps> = ({ onExploreCraft }) => {
  return (
    <section className="bg-[#FBF9F5] border-t border-[#E7E2DA] py-14 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#804116] block">
            Our Pillars · హస్తకళ మరియు నిజాయితీ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18] tracking-tight">
            The Values That Define Abhi Furniture Hall
          </h2>
          <p className="text-xs sm:text-sm text-[#53433B] leading-relaxed">
            Rooted in human touch, skilled craftsmanship, thoughtful design and conscious choices that shape everything we create.
          </p>
        </div>

        {/* 4 Tall Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {VALUES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={onExploreCraft}
              className="group relative aspect-[3/4] w-full rounded-[4px] overflow-hidden border border-[#E7E2DA] hover:border-[#D4A373] bg-[#2A2825] shadow-[0_8px_24px_-8px_rgba(42,40,37,0.1)] hover:shadow-[0_16px_36px_-10px_rgba(42,40,37,0.2)] transition-all duration-300 cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-[#9E582C]"
            >
              <img
                src={item.image}
                alt={item.imageAlt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Bottom Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C18]/90 via-[#1C1C18]/20 to-transparent" />

              {/* Bottom-Centered Label */}
              <div className="absolute bottom-0 inset-x-0 px-4 pb-6 pt-10 flex flex-col items-center">
                <span className="font-sans text-sm sm:text-base font-medium tracking-[0.16em] text-[#FBF9F5] uppercase">
                  {item.title}
                </span>
                <span className="mt-1.5 text-[11px] text-[#F5F1EB]/80 max-w-[22ch] leading-snug opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {item.caption}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

