import React from 'react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/pricing';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      className="fixed inset-0 z-50 overflow-hidden bg-[#2A2825]/60 backdrop-blur-sm flex justify-end"
    >
      <div className="relative w-full max-w-md bg-[#FBF9F5] h-full shadow-[0_12px_36px_-8px_rgba(42,40,37,0.15)] flex flex-col justify-between border-l border-[#E7E2DA]">
        {/* Header */}
        <div className="p-6 border-b border-[#E7E2DA] bg-[#FFFFFF] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Heart className="w-3.5 h-3.5 text-[#9E582C] fill-[#9E582C]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#804116]">
                Saved Furniture Shortlist
              </span>
            </div>
            <h2 id="wishlist-title" className="font-serif text-xl sm:text-2xl font-medium text-[#1C1C18] mt-0.5">
              Wishlist ({items.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist drawer"
            className="p-2 rounded-[4px] hover:bg-[#F5F1EB] text-[#2A2825] border border-[#E7E2DA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F1EB] border border-[#E7E2DA] flex items-center justify-center text-[#86736A]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#1C1C18]">
                No Saved Pieces Yet
              </h3>
              <p className="text-xs text-[#53433B] max-w-xs mx-auto leading-relaxed">
                Tap the heart icon on any furniture piece to save and compare finishes here.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 bg-[#2A2825] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#9E582C] transition-colors cursor-pointer"
              >
                Browse Store
              </button>
            </div>
          ) : (
            items.map((product) => (
              <div
                key={product.id}
                className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-4 flex gap-4 shadow-sm"
              >
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-20 h-24 rounded-[2px] object-cover bg-[#F7F5F0] border border-[#E7E2DA] shrink-0 cursor-pointer"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="font-serif text-sm font-semibold text-[#1C1C18] hover:text-[#9E582C] cursor-pointer truncate"
                      >
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="text-[#86736A] hover:text-[#BA1A1A] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#53433B] truncate mt-0.5">
                      {product.materialsSummary}
                    </p>
                    <p className="text-xs font-semibold text-[#2A2825] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      className="flex-1 py-2 px-3 bg-[#9E582C] hover:bg-[#2A2825] text-[#FBF9F5] text-[11px] font-semibold uppercase tracking-wider rounded-[4px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Archive</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      aria-label={`View ${product.name}`}
                      className="p-2 border border-[#E7E2DA] hover:border-[#9E582C] text-[#2A2825] rounded-[4px] cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

