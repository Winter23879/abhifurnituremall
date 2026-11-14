import React from 'react';
import { Sparkles, Layers, Shield, TreePine, Droplet, ArrowRight } from 'lucide-react';

interface CraftJournalProps {
  onExploreCollection: () => void;
  onOpenSampleKit: () => void;
}

export const CraftJournal: React.FC<CraftJournalProps> = ({
  onExploreCollection,
  onOpenSampleKit,
}) => {
  return (
    <div className="bg-[#FBF9F5] min-h-screen py-12 lg:py-20 border-b border-[#E7E2DA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#804116] uppercase tracking-[0.06em]">
            <TreePine className="w-3.5 h-3.5 text-[#9E582C]" />
            <span>Materiality & Craft Philosophy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1C1C18]">
            The Art of Thoughtful Restraint
          </h1>
          <p className="text-base sm:text-lg text-[#53433B] font-serif italic">
            "Beauty does not reside in the object itself, but in the patterns of shadows, the light and the darkness, that one object creates with another."
          </p>
          <span className="text-xs uppercase tracking-widest text-[#86736A] font-sans font-semibold">
            — Jun’ichirō Tanizaki, In Praise of Shadows
          </span>
        </div>

        {/* 4 Architectural Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-3 shadow-sm hover:border-[#D4A373] transition-colors">
            <span className="font-serif text-2xl text-[#9E582C]">01</span>
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Subtle Grace (Shibui)
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed">
              Subtle, unobtrusive elegance. We favor unfinished and matte organic surfaces that mature alongside the home, developing a deep, tactile patina over decades.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-3 shadow-sm hover:border-[#D4A373] transition-colors">
            <span className="font-serif text-2xl text-[#9E582C]">02</span>
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Essential Simplicity (Kanso)
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed">
              The deliberate elimination of excess. Every contour, chamfer, and leg placement serves a structural or ergonomic purpose, leaving pure calm.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-3 shadow-sm hover:border-[#D4A373] transition-colors">
            <span className="font-serif text-2xl text-[#9E582C]">03</span>
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Organic Honesty (Shizen)
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed">
              Naturalness without artifice. We honor the wood grain's natural curvature, slight sapwood tonal variations, and the porous honesty of honed stone.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-3 shadow-sm hover:border-[#D4A373] transition-colors">
            <span className="font-serif text-2xl text-[#9E582C]">04</span>
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Balanced Space (Ma)
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed">
              The meaningful pause. High design does not overcrowd rooms—it frames the quiet expanse of empty floor and diffused daylight between objects.
            </p>
          </div>
        </div>

        {/* Material Provenance Deep Dive */}
        <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 bg-[#F7F5F0]">
              <img
                src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80"
                alt="Artisanal wood joinery in workshop"
                className="w-full h-full object-cover object-center min-h-[360px]"
              />
            </div>

            <div className="lg:col-span-7 p-8 lg:p-12 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#9E582C]">
                  Joinery & Longevity
                </span>
                <h2 className="font-serif text-3xl font-normal text-[#1C1C18]">
                  Interlocking Craft, Zero Obtrusive Hardware
                </h2>
                <p className="text-sm text-[#53433B] leading-relaxed">
                  Every Abhi Furniture Mall dining table, lounge frame, and platform bed utilizes proven solid wood mortise-and-tenon and interlocking joinery principles. Because wood naturally breathes, expands, and contracts across seasons, interlocking wood joints distribute load organically without loosening over time.
                </p>
                <p className="text-sm text-[#53433B] leading-relaxed">
                  Finished exclusively with non-toxic organic tung oils and natural beeswax—never synthetic polyurethane coats that trap moisture and mask the wood’s natural aroma.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E7E2DA] flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenSampleKit}
                  className="py-3 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors"
                >
                  Request Architectural Swatch Box
                </button>
                <button
                  onClick={onExploreCollection}
                  className="py-3 px-6 border border-[#2A2825] text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#F5F1EB] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
