import React, { useState } from 'react';
import { SPACES, ArchitecturalSpace, Hotspot } from '../data/spaces';
import { Product, PRODUCTS } from '../data/products';
import { Compass, Eye, Plus, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/pricing';

interface SpacesLookbookProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenPlanner: () => void;
}

export const SpacesLookbook: React.FC<SpacesLookbookProps> = ({
  onSelectProduct,
  onAddToCart,
  onOpenPlanner,
}) => {
  const [activeSpaceId, setActiveSpaceId] = useState(SPACES[0].id);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const activeSpace = SPACES.find((s) => s.id === activeSpaceId) || SPACES[0];

  const getProductForHotspot = (hotspot: Hotspot): Product | undefined => {
    return PRODUCTS.find((p) => p.id === hotspot.productId);
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 lg:py-16 border-b border-[#E7E2DA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#804116] uppercase tracking-[0.06em] mb-2">
              <Compass className="w-3.5 h-3.5 text-[#9E582C]" />
              <span>Architectural Lookbook & In-Situ Spaces · గృహ సామరస్యం</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1C1C18]">
              Spaces In Harmony
            </h1>
            <p className="text-base text-[#53433B] mt-2 max-w-2xl font-serif italic">
              Experience Abhi Furniture Hall creations placed within master-crafted residences in Vijayawada, Visakhapatnam, and Araku Valley.
            </p>
          </div>

          {/* Space Selector Tabs conforming to Japandi Chip Specs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {SPACES.map((space) => {
              const isSelected = space.id === activeSpace.id;
              return (
                <button
                  key={space.id}
                  onClick={() => {
                    setActiveSpaceId(space.id);
                    setActiveHotspot(null);
                  }}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] rounded-full transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#2A2825] text-[#FBF9F5] shadow-sm'
                      : 'bg-[#FBF9F5] text-[#53433B] border border-[#E7E2DA] hover:bg-[#F5F1EB] hover:border-[#D4A373]'
                  }`}
                >
                  {space.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Space Hero Canvas with Interactive Hotspots */}
        <div className="relative rounded-[4px] overflow-hidden border border-[#E7E2DA] bg-[#F7F5F0] shadow-[0_12px_36px_-8px_rgba(42,40,37,0.08)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full min-h-[420px] max-h-[640px]">
            <img
              src={activeSpace.image}
              alt={activeSpace.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle architectural vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C18]/60 via-transparent to-transparent pointer-events-none" />

            {/* Interactive Hotspot Pins */}
            {activeSpace.hotspots.map((hotspot) => {
              const matchedProduct = getProductForHotspot(hotspot);
              const isSelected = activeHotspot?.id === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${hotspot.xPercent}%`,
                    top: `${hotspot.yPercent}%`,
                  }}
                >
                  <button
                    onClick={() => setActiveHotspot(isSelected ? null : hotspot)}
                    aria-label={`View details for ${hotspot.title}`}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg ${
                      isSelected
                        ? 'bg-[#9E582C] text-[#FBF9F5] ring-4 ring-[#FFFFFF]/80'
                        : 'bg-[#FFFFFF]/90 text-[#2A2825] border border-[#E7E2DA] ring-2 ring-[#2A2825]/20 hover:bg-[#9E582C] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                    <span className="absolute -inset-1 rounded-full border border-white/60 animate-ping opacity-40 pointer-events-none"></span>
                  </button>

                  {/* Hotspot Popover Card */}
                  {isSelected && matchedProduct && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-4 shadow-[0_12px_36px_-8px_rgba(42,40,37,0.2)] z-30 animate-fadeIn text-left">
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={matchedProduct.primaryImage}
                          alt={matchedProduct.name}
                          className="w-12 h-12 rounded-[2px] object-cover border border-[#E7E2DA]"
                        />
                        <div className="truncate">
                          <span className="text-[9px] uppercase tracking-wider text-[#9E582C] font-semibold block">
                            {matchedProduct.japaneseName}
                          </span>
                          <h4 className="font-serif text-xs font-semibold text-[#1C1C18] truncate">
                            {matchedProduct.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#2A2825]">
                            {formatPrice(matchedProduct.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F5F1EB]">
                        <button
                          onClick={() => onSelectProduct(matchedProduct)}
                          className="flex-1 py-1.5 px-2 bg-[#9E582C] text-[#FBF9F5] text-[10px] uppercase font-semibold tracking-wider rounded-[2px] hover:bg-[#2A2825] transition-colors text-center"
                        >
                          Inspect Piece
                        </button>
                        <button
                          onClick={() => onAddToCart(matchedProduct)}
                          className="p-1.5 border border-[#E7E2DA] rounded-[2px] hover:bg-[#F5F1EB] text-[#2A2825]"
                          title="Add to archive"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom In-Situ Space Details Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between sm:items-end text-[#FBF9F5] gap-4 pointer-events-none">
              <div className="max-w-xl">
                <div className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-[#D4A373]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeSpace.location} · {activeSpace.architect}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-1">
                  {activeSpace.title}{' '}
                  <span className="text-lg opacity-80 font-sans font-light">
                    ({activeSpace.japaneseSubtitle})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#F5F1EB]/90 mt-1 line-clamp-2 sm:line-clamp-none">
                  {activeSpace.concept}
                </p>
              </div>

              <div className="pointer-events-auto">
                <button
                  onClick={onOpenPlanner}
                  className="py-2.5 px-5 bg-[#FFFFFF]/95 backdrop-blur-md text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] border border-[#E7E2DA] hover:bg-[#9E582C] hover:text-[#FFFFFF] hover:border-[#9E582C] transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Recreate In Spatial Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Pieces in this Space Grid */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-medium text-[#1C1C18]">
            Curated Pieces in this Architecture
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSpace.hotspots.map((hs) => {
              const prod = getProductForHotspot(hs);
              if (!prod) return null;

              return (
                <div
                  key={hs.id}
                  className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-4 hover:border-[#D4A373] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={prod.primaryImage}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-[2px] bg-[#F7F5F0] border border-[#E7E2DA]"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#804116]">
                        {prod.category} · {prod.japaneseName}
                      </span>
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        className="font-serif text-sm font-semibold text-[#1C1C18] group-hover:text-[#9E582C] transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#2A2825]">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(prod)}
                    className="p-2 border border-[#E7E2DA] rounded-[4px] hover:bg-[#F5F1EB] text-[#2A2825] transition-colors"
                    title="View Spec Sheet"
                  >
                    <ArrowRight className="w-4 h-4 text-[#86736A]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
