import React, { useState } from 'react';
import { Product, MaterialOption } from '../data/products';
import { formatPrice, formatDimensions, calculateProductPrice } from '../utils/pricing';
import { X, Check, ArrowRight, Shield, Clock, Compass } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedWood: MaterialOption,
    selectedFabric?: MaterialOption
  ) => void;
  onViewFullSpecs: (product: Product) => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFullSpecs,
}) => {
  if (!product) return null;

  const [selectedWood, setSelectedWood] = useState<MaterialOption>(
    product.woodOptions[0]
  );
  const [selectedFabric, setSelectedFabric] = useState<MaterialOption | undefined>(
    product.fabricOptions ? product.fabricOptions[0] : undefined
  );
  const [activeImage, setActiveImage] = useState<string>(product.primaryImage);

  const extraCost =
    selectedWood.extraPrice + (selectedFabric ? selectedFabric.extraPrice : 0);
  const currentPrice = calculateProductPrice(product.price, extraCost);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#2A2825]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] max-w-4xl w-full overflow-hidden shadow-[0_12px_36px_-8px_rgba(42,40,37,0.12)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-[4px] bg-[#FFFFFF]/80 hover:bg-[#F5F1EB] text-[#2A2825] border border-[#E7E2DA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visual Gallery */}
          <div className="md:col-span-6 bg-[#F7F5F0] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E2DA]">
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#EAE6DF] border border-[#E7E2DA]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-[#FFFFFF]/90 text-[#53433B] border border-[#E7E2DA] rounded-full">
                  {formatDimensions(product.dimensions)}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-1">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  aria-label={`Show view ${i + 1}`}
                  className={`relative w-14 h-14 rounded-[2px] overflow-hidden border transition-all flex-shrink-0 ${
                    activeImage === imgUrl
                      ? 'border-[#9E582C] ring-2 ring-offset-1 ring-[#9E582C]'
                      : 'border-[#E7E2DA] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Spec Configurator */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#FBF9F5]">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#804116]">
                    {product.category} · {product.designer}
                  </span>
                  <span className="text-xs text-[#86736A] font-medium truncate max-w-[50%] text-right">
                    {product.japaneseName}
                  </span>
                </div>
                <h2
                  id="quickview-title"
                  className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18] mt-1"
                >
                  {product.name}
                </h2>
                <div className="flex items-baseline space-x-3 mt-2">
                  <span className="text-2xl font-sans font-semibold text-[#2A2825]">
                    {formatPrice(currentPrice)}
                  </span>
                  {extraCost > 0 && (
                    <span className="text-xs text-[#86736A] font-mono">
                      (Includes custom finish adjustments)
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#53433B] leading-relaxed">
                {product.description}
              </p>

              {/* Timber / Wood Grain Swatches with active dual-ring indicator */}
              <div className="space-y-2 pt-2 border-t border-[#E7E2DA]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2A2825] uppercase tracking-wider">
                    Architectural Timber Finish
                  </span>
                  <span className="text-[#804116] font-medium">
                    {selectedWood.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {product.woodOptions.map((wood) => {
                    const isSelected = selectedWood.id === wood.id;
                    return (
                      <button
                        key={wood.id}
                        onClick={() => setSelectedWood(wood)}
                        aria-label={`Select ${wood.name}`}
                        className="group relative flex flex-col items-center focus:outline-none"
                      >
                        {/* Circular material swatch wrapped in active dual-ring indicator (outer stroke separated by 2px gap) */}
                        <div
                          className={`w-7 h-7 rounded-full border border-[#DDD9D4] transition-all flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-[#9E582C] scale-105'
                              : 'hover:scale-105 opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: wood.hex }}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#FFFFFF] drop-shadow-sm" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upholstery / Fabric Swatches if applicable */}
              {product.fabricOptions && product.fabricOptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E7E2DA]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#2A2825] uppercase tracking-wider">
                      Textile & Upholstery
                    </span>
                    <span className="text-[#804116] font-medium">
                      {selectedFabric?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {product.fabricOptions.map((fabric) => {
                      const isSelected = selectedFabric?.id === fabric.id;
                      return (
                        <button
                          key={fabric.id}
                          onClick={() => setSelectedFabric(fabric)}
                          aria-label={`Select ${fabric.name}`}
                          className="group relative flex flex-col items-center focus:outline-none"
                        >
                          <div
                            className={`w-7 h-7 rounded-full border border-[#DDD9D4] transition-all flex items-center justify-center ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-[#9E582C] scale-105'
                                : 'hover:scale-105 opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: fabric.hex }}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#1C1C18] drop-shadow-sm" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Craftsmanship metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#53433B] bg-[#F5F1EB] p-3 rounded-[4px] border border-[#E7E2DA]">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#9E582C]" />
                  <span>{product.leadTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#9E582C]" />
                  <span>12-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-[#E7E2DA]">
              <button
                onClick={() => {
                  onAddToCart(product, selectedWood, selectedFabric);
                  onClose();
                }}
                className="w-full py-3.5 px-7 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.04em] rounded-[4px] hover:bg-[#2A2825] transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <span>Add to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onViewFullSpecs(product);
                  onClose();
                }}
                className="w-full py-2.5 text-xs text-[#53433B] hover:text-[#9E582C] font-semibold uppercase tracking-wider text-center underline underline-offset-4 decoration-[#D4A373] transition-colors cursor-pointer"
              >
                View Full Product Details & Dimensions →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
