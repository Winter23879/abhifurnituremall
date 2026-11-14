import React, { useState } from 'react';
import { Product } from '../data/products';
import { formatPrice, formatDimensions } from '../utils/pricing';
import { Eye, Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedWoodIdx, setSelectedWoodIdx] = useState(0);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] overflow-hidden transition-all duration-300 hover:border-[#D4A373] hover:shadow-[0_6px_20px_-4px_rgba(42,40,37,0.06)] flex flex-col justify-between"
    >
      {/* Visual Container with strict 4:5 aspect ratio and neutral warm-gray backdrop #F7F5F0 */}
      <div className="relative aspect-[4/5] w-full bg-[#F7F5F0] overflow-hidden cursor-pointer">
        {/* Curated promotional / architectural badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.06em] font-semibold bg-[#FFFFFF]/90 backdrop-blur-sm text-[#9E582C] border border-[#E7E2DA] rounded-full">
              {product.badge}
            </span>
          </div>
        )}

        {/* Dimension Pill & Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
          <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-medium tracking-[0.04em] bg-[#FBF9F5]/90 backdrop-blur-sm text-[#53433B] border border-[#E7E2DA] rounded-full">
            {formatDimensions(product.dimensions)}
          </span>
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              className={`w-7 h-7 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#9E582C] border-[#9E582C] text-[#FBF9F5]'
                  : 'bg-[#FFFFFF]/90 border-[#E7E2DA] text-[#53433B] hover:text-[#9E582C] hover:border-[#9E582C]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Primary and Secondary Hover Image Transition */}
        <div
          onClick={() => onSelectProduct(product)}
          className="w-full h-full relative"
        >
          <img
            src={product.primaryImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
              isHovered && product.secondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />

          {product.secondaryImage && (
            <img
              src={product.secondaryImage}
              alt={`${product.name} alternate architectural perspective`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                isHovered ? 'opacity-100 scale-[1.02]' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Hover Quick Action Layer */}
        <div
          className={`absolute inset-x-3 bottom-3 z-20 transition-all duration-300 flex items-center gap-2 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => onQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex-1 py-2.5 px-3 bg-[#FFFFFF]/95 backdrop-blur-md text-[#2A2825] text-xs font-semibold uppercase tracking-[0.04em] rounded-[4px] border border-[#E7E2DA] hover:bg-[#2A2825] hover:text-[#FBF9F5] hover:border-[#2A2825] transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="p-2.5 bg-[#9E582C] text-[#FBF9F5] rounded-[4px] hover:bg-[#2A2825] transition-colors shadow-sm cursor-pointer"
            title="Add to Cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 border-t border-[#E7E2DA]">
        <div>
          {/* Collection tag and descriptive subtitle */}
          <div className="flex items-center justify-between text-xs text-[#86736A] mb-1">
            <span className="uppercase tracking-[0.06em] text-[11px] font-semibold text-[#804116]">
              {product.category}
            </span>
            <span className="text-[11px] text-[#86736A] font-normal truncate max-w-[55%] text-right" title={product.japaneseName}>
              {product.japaneseName}
            </span>
          </div>

          {/* Product Title */}
          <h2
            onClick={() => onSelectProduct(product)}
            className="font-serif text-lg font-medium text-[#1C1C18] hover:text-[#9E582C] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h2>

          <p className="text-xs text-[#53433B] mt-1 line-clamp-1">
            {product.materialsSummary}
          </p>
        </div>

        {/* Footer: Material Variant Swatches & Price */}
        <div className="pt-3 mt-3 border-t border-[#F5F1EB] flex items-center justify-between">
          {/* Material Swatch Dots */}
          <div className="flex items-center space-x-1.5">
            {product.woodOptions.slice(0, 4).map((opt, idx) => (
              <button
                key={opt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWoodIdx(idx);
                }}
                title={opt.name}
                aria-label={`Select ${opt.name}`}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedWoodIdx === idx
                    ? 'ring-1 ring-offset-1 ring-[#9E582C] scale-110'
                    : 'border-[#E7E2DA] hover:scale-105'
                }`}
                style={{ backgroundColor: opt.hex }}
              />
            ))}
            {product.fabricOptions && product.fabricOptions.length > 0 && (
              <span className="text-[10px] text-[#86736A] pl-1 font-mono">
                +{product.fabricOptions.length}
              </span>
            )}
          </div>

          {/* Price in Espresso #2A2825 */}
          <div className="font-sans text-sm font-semibold text-[#2A2825]">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </article>
  );
};
