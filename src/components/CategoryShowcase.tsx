import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

interface CategoryShowcaseProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

interface CategoryTile {
  id: 'living' | 'dining' | 'bedroom' | 'study' | 'lighting' | 'all';
  title: string;
  japaneseLabel: string;
  subtitle: string;
  startingLabel: string;
  image: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    id: 'living',
    title: 'Living',
    japaneseLabel: 'విశ్రాంతి గది',
    subtitle: 'Lounges, Sectionals & Credenzas',
    startingLabel: 'Starting from ₹44,500',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'dining',
    title: 'Dining',
    japaneseLabel: 'భోజనశాల',
    subtitle: 'Minimalist Tables & Woven Benches',
    startingLabel: 'Starting from ₹24,500',
    image:
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    japaneseLabel: 'పడక గది',
    subtitle: 'Hinoki Platform Beds & Suites',
    startingLabel: 'Starting from ₹19,500',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'study',
    title: 'Study & Storage',
    japaneseLabel: 'అధ్యయన గది',
    subtitle: 'Sculptural Shelving & Room Dividers',
    startingLabel: 'Starting from ₹32,000',
    image:
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'lighting',
    title: 'Lighting',
    japaneseLabel: 'దీపాలంకరణ',
    subtitle: 'Handmade Mulberry Washi Luminaires',
    startingLabel: 'Starting from ₹14,500',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'all',
    title: 'All Pieces',
    japaneseLabel: 'అన్ని వస్తువులు',
    subtitle: 'Complete Architectural Collection',
    startingLabel: 'Browse Full Archive',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
  },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getCountForCategory = (categoryId: CategoryTile['id']) => {
    if (categoryId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === categoryId).length;
  };

  return (
    <section
      id="categories-showcase"
      className="bg-[#FBF9F5] border-b border-[#E7E2DA] py-14 lg:py-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.08em] font-semibold text-[#804116]">
              Curated Categories · గదుల ఎంపిక
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18] mt-1">
              Shop by Room & Category
            </h2>
            <p className="text-xs sm:text-sm text-[#53433B] mt-1">
              Select a category tile to jump directly to its crafted pieces below.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#86736A]">
            {PRODUCTS.length} Architectural Designs
          </span>
        </div>

        {/* Category Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_TILES.map((tile) => {
            const count = getCountForCategory(tile.id);
            const isSelected = activeCategory === tile.id;

            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => onSelectCategory(tile.id)}
                className={`group relative text-left rounded-[4px] overflow-hidden border transition-all duration-300 aspect-[4/3] bg-[#2A2825] shadow-[0_8px_24px_-8px_rgba(42,40,37,0.12)] hover:shadow-[0_16px_36px_-10px_rgba(42,40,37,0.22)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9E582C] ${
                  isSelected
                    ? 'border-[#9E582C] ring-2 ring-[#9E582C]/30'
                    : 'border-[#E7E2DA] hover:border-[#D4A373]'
                }`}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Warm Charcoal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C18]/90 via-[#1C1C18]/35 to-[#1C1C18]/10 transition-opacity duration-300" />

                {/* Top Row: Piece Count & Japanese Label */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#FBF9F5]/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-[0.08em] text-[#2A2825] border border-[#E7E2DA]">
                    {count} {count === 1 ? 'Piece' : 'Pieces'}
                  </span>
                  <span className="text-xs font-sans tracking-[0.12em] text-[#FBF9F5]/85 bg-[#1C1C18]/45 backdrop-blur-sm px-2 py-0.5 rounded-[3px]">
                    {tile.japaneseLabel}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-[3px] bg-[#9E582C] text-[#FBF9F5] text-[10px] font-semibold uppercase tracking-[0.06em] mb-2">
                      {tile.startingLabel}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-[#FBF9F5] leading-tight">
                      {tile.title}
                    </h3>
                    <p className="text-xs text-[#F5F1EB]/85 mt-1">
                      {tile.subtitle}
                    </p>
                  </div>

                  <span className="w-9 h-9 rounded-full bg-[#FBF9F5]/90 group-hover:bg-[#9E582C] text-[#2A2825] group-hover:text-[#FBF9F5] flex items-center justify-center shrink-0 transition-colors duration-200">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

