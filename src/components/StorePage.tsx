import React, { useMemo, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/pricing';
import { ProductCard } from './ProductCard';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
} from 'lucide-react';

interface StorePageProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onBackHome: () => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  initialSearchQuery?: string;
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Pieces' },
  { id: 'living', label: 'Living' },
  { id: 'dining', label: 'Dining' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'study', label: 'Study & Storage' },
  { id: 'lighting', label: 'Lighting' },
];

const MATERIAL_OPTIONS = [
  { id: 'all', label: 'All Materials' },
  { id: 'Oak', label: 'White & Nordic Oak' },
  { id: 'Smoked', label: 'Smoked Oak / Ash' },
  { id: 'Walnut', label: 'Black Walnut' },
  { id: 'Hinoki', label: 'Japanese Hinoki' },
  { id: 'Travertine', label: 'Honed Travertine' },
  { id: 'Bouclé', label: 'Tactile Bouclé' },
  { id: 'Linen', label: 'Belgian Linen' },
  { id: 'Washi', label: 'Mulberry Washi' },
];

const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: 0, max: 150000 },
  { id: 'under-35000', label: 'Under ₹35,000', min: 0, max: 34999 },
  { id: '35000-85000', label: '₹35,000 – ₹85,000', min: 35000, max: 85000 },
  { id: 'over-85000', label: 'Over ₹85,000', min: 85001, max: 150000 },
];

export const StorePage: React.FC<StorePageProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onBackHome,
  onQuickView,
  onSelectProduct,
  onAddToCart,
  wishlistIds = [],
  onToggleWishlist,
  initialSearchQuery = '',
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [pricePreset, setPricePreset] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'made-to-order'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const activeCategoryLabel =
    CATEGORY_OPTIONS.find((c) => c.id === selectedCategory)?.label || 'All Pieces';

  const handlePricePresetChange = (presetId: string) => {
    setPricePreset(presetId);
    const preset = PRICE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setMaxPrice(preset.max);
    }
  };

  const resetAllFilters = () => {
    onSelectCategory('all');
    setSelectedMaterial('all');
    setPricePreset('all');
    setMaxPrice(150000);
    setAvailability('all');
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedMaterial !== 'all' ||
    pricePreset !== 'all' ||
    maxPrice < 150000 ||
    availability !== 'all' ||
    minRating > 0 ||
    searchQuery.trim() !== '';

  const filteredProducts = useMemo(() => {
    const preset = PRICE_PRESETS.find((p) => p.id === pricePreset) || PRICE_PRESETS[0];

    return products
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        if (selectedMaterial !== 'all') {
          const mat = selectedMaterial.toLowerCase();
          const matchesSummary = item.materialsSummary.toLowerCase().includes(mat);
          const matchesWood = item.woodOptions.some((w) =>
            w.name.toLowerCase().includes(mat)
          );
          const matchesFabric = item.fabricOptions?.some((f) =>
            f.name.toLowerCase().includes(mat)
          );
          if (!matchesSummary && !matchesWood && !matchesFabric) return false;
        }

        if (pricePreset !== 'all') {
          if (item.price < preset.min || item.price > preset.max) return false;
        } else if (item.price > maxPrice) {
          return false;
        }

        if (availability === 'in-stock' && !item.leadTime.toLowerCase().includes('in stock')) {
          return false;
        }
        if (
          availability === 'made-to-order' &&
          item.leadTime.toLowerCase().includes('in stock')
        ) {
          return false;
        }

        if (minRating > 0 && item.rating < minRating) {
          return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(query);
          const matchesJapanese = item.japaneseName.includes(query);
          const matchesDesc = item.description.toLowerCase().includes(query);
          const matchesCategory = item.category.toLowerCase().includes(query);
          const matchesMaterial = item.materialsSummary.toLowerCase().includes(query);
          if (
            !matchesName &&
            !matchesJapanese &&
            !matchesDesc &&
            !matchesCategory &&
            !matchesMaterial
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    selectedMaterial,
    pricePreset,
    maxPrice,
    availability,
    minRating,
    searchQuery,
    sortBy,
  ]);

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.08em] text-[#1C1C18]">
          <SlidersHorizontal className="w-4 h-4 text-[#9E582C]" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[11px] font-semibold text-[#9E582C] hover:text-[#804116] flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#86736A]">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORY_OPTIONS.map((cat) => {
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A2825] text-[#FBF9F5] font-semibold'
                    : 'text-[#53433B] hover:bg-[#F5F1EB] hover:text-[#1C1C18]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#9E582C] text-[#FBF9F5]'
                      : 'bg-[#F5F1EB] text-[#86736A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 border-t border-[#E7E2DA] pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#86736A]">
            Price Range
          </h3>
          {pricePreset === 'all' && (
            <span className="text-[11px] font-semibold text-[#9E582C]">
              Up to {formatPrice(maxPrice)}
            </span>
          )}
        </div>

        <input
          type="range"
          min={12000}
          max={150000}
          step={2500}
          value={maxPrice}
          onChange={(e) => {
            setPricePreset('all');
            setMaxPrice(Number(e.target.value));
          }}
          aria-label="Maximum price filter"
          className="w-full accent-[#9E582C] cursor-pointer"
        />

        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isSelected = pricePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePricePresetChange(preset.id)}
                className={`px-2.5 py-1.5 text-[11px] rounded-[4px] border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#9E582C] text-[#FBF9F5] border-[#9E582C] font-semibold'
                    : 'bg-[#FBF9F5] text-[#53433B] border-[#E7E2DA] hover:border-[#D4A373]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Material & Timber Filter */}
      <div className="space-y-2.5 border-t border-[#E7E2DA] pt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#86736A]">
          Timber & Material
        </h3>
        <div className="space-y-1">
          {MATERIAL_OPTIONS.map((mat) => {
            const isSelected = selectedMaterial === mat.id;
            return (
              <label
                key={mat.id}
                className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[4px] text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#F5F1EB] text-[#804116] font-semibold'
                    : 'text-[#53433B] hover:bg-[#FBF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="material-filter"
                  checked={isSelected}
                  onChange={() => setSelectedMaterial(mat.id)}
                  className="accent-[#9E582C]"
                />
                <span>{mat.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Availability Filter */}
      <div className="space-y-2.5 border-t border-[#E7E2DA] pt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#86736A]">
          Lead Time
        </h3>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Availability' },
            { id: 'in-stock', label: 'In Stock (Ships 5–7 Days)' },
            { id: 'made-to-order', label: 'Made to Order (3–8 Wks)' },
          ].map((opt) => (
            <label
              key={opt.id}
              className="flex items-center space-x-2.5 px-2 py-1 text-xs text-[#53433B] cursor-pointer"
            >
              <input
                type="radio"
                name="availability-filter"
                checked={availability === opt.id}
                onChange={() => setAvailability(opt.id as typeof availability)}
                className="accent-[#9E582C]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Rating Filter */}
      <div className="space-y-2.5 border-t border-[#E7E2DA] pt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#86736A]">
          Client Rating
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: 0, label: 'All' },
            { value: 4.9, label: '4.9+ ★' },
            { value: 4.95, label: '4.95+ ★' },
          ].map((r) => {
            const isSelected = minRating === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setMinRating(r.value)}
                className={`px-3 py-1.5 rounded-[4px] border text-[11px] font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#2A2825] text-[#FBF9F5] border-[#2A2825]'
                    : 'bg-[#FBF9F5] text-[#53433B] border-[#E7E2DA] hover:border-[#D4A373]'
                }`}
              >
                {r.value > 0 && <Star className="w-3 h-3 fill-[#9E582C] text-[#9E582C]" />}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FBF9F5] min-h-[calc(100vh-113px)] py-8 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        {/* Top Store Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#9E582C] hover:text-[#2A2825] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18]">
              {activeCategoryLabel === 'All Pieces'
                ? 'Abhi Furniture Mall — Full Collection'
                : `${activeCategoryLabel} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-[#53433B]">
              Showing {filteredProducts.length} of {products.length} architectural pieces crafted with FSC-certified timber.
            </p>
          </div>

          {/* Top Controls: Search, Sort & Mobile Filter Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search piece or material..."
                className="w-full py-2.5 pl-9 pr-4 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
              />
              <Search className="w-4 h-4 text-[#86736A] absolute left-3 top-3 pointer-events-none" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort collection"
              className="py-2.5 px-3 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
            >
              <option value="featured">Sort: Curated Signature</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden inline-flex items-center space-x-2 py-2.5 px-3.5 text-xs font-semibold uppercase tracking-wider bg-[#2A2825] text-[#FBF9F5] rounded-[4px] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Filter Panel */}
        {mobileFiltersOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-sm">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#53433B] hover:text-[#1C1C18]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {filterSidebarContent}
          </div>
        )}

        {/* Store Body: Left-Hand Filter Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left-Hand Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-sm">
            {filterSidebarContent}
          </aside>

          {/* Right-Hand Product Grid */}
          <div className="flex-1 w-full space-y-5">
            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E2DA] text-xs text-[#2A2825] hover:border-[#9E582C] cursor-pointer"
                  >
                    <span>Category: {activeCategoryLabel}</span>
                    <X className="w-3 h-3 text-[#9E582C]" />
                  </button>
                )}
                {selectedMaterial !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial('all')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E2DA] text-xs text-[#2A2825] hover:border-[#9E582C] cursor-pointer"
                  >
                    <span>Material: {selectedMaterial}</span>
                    <X className="w-3 h-3 text-[#9E582C]" />
                  </button>
                )}
                {(pricePreset !== 'all' || maxPrice < 150000) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset('all');
                      setMaxPrice(150000);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E2DA] text-xs text-[#2A2825] hover:border-[#9E582C] cursor-pointer"
                  >
                    <span>
                      {pricePreset !== 'all'
                        ? PRICE_PRESETS.find((p) => p.id === pricePreset)?.label
                        : `Up to ${formatPrice(maxPrice)}`}
                    </span>
                    <X className="w-3 h-3 text-[#9E582C]" />
                  </button>
                )}
                {availability !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setAvailability('all')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E2DA] text-xs text-[#2A2825] hover:border-[#9E582C] cursor-pointer"
                  >
                    <span>
                      {availability === 'in-stock' ? 'In Stock' : 'Made to Order'}
                    </span>
                    <X className="w-3 h-3 text-[#9E582C]" />
                  </button>
                )}
                {minRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E2DA] text-xs text-[#2A2825] hover:border-[#9E582C] cursor-pointer"
                  >
                    <span>{minRating}+ ★</span>
                    <X className="w-3 h-3 text-[#9E582C]" />
                  </button>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] space-y-3">
                <h3 className="font-serif text-xl font-medium text-[#1C1C18]">
                  No Architectural Pieces Found
                </h3>
                <p className="text-xs text-[#53433B]">
                  Try adjusting your left-hand filters or clearing your search query.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="py-2.5 px-5 bg-[#9E582C] hover:bg-[#804116] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

