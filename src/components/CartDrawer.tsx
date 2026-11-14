import React, { useState } from 'react';
import { CartItem, calculateCartTotals, evaluatePromoCode, formatPrice } from '../utils/pricing';
import { OrderRecord } from '../utils/storage';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle,
  Tag,
  MessageCircle,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenSampleKit: () => void;
  onOrderSubmitted?: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenSampleKit,
  onOrderSubmitted,
}) => {
  const [includeWhiteGlove, setIncludeWhiteGlove] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPinCode, setClientPinCode] = useState('');
  const [clientCity, setClientCity] = useState('');

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, includeWhiteGlove, appliedPromo);

  const handleApplyPromo = () => {
    const rate = evaluatePromoCode(promoInput);
    if (rate > 0) {
      const code = promoInput.trim().toUpperCase();
      setAppliedPromo(code);
      setPromoFeedback(`Applied ${code} (${Math.round(rate * 100)}% extra off)`);
    } else {
      setAppliedPromo('');
      setPromoFeedback('Try AFH5, DIWALI10, or FESTIVE15');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !clientPinCode.trim()) {
      return;
    }

    const order: OrderRecord = {
      id: `AFH-${(Date.now() % 1000000).toString().padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      clientPinCode: clientPinCode.trim(),
      clientCity: clientCity.trim() || 'Andhra Pradesh',
      items,
      subtotal: totals.subtotal,
      discount: totals.bundleDiscount + totals.promoDiscount,
      gst: totals.tax,
      shipping: totals.shipping,
      whiteGloveDelivery: totals.whiteGloveDelivery,
      total: totals.total,
      promoCode: appliedPromo || undefined,
      status: 'submitted',
    };

    onOrderSubmitted?.(order);
    setSubmittedOrder(order);
  };

  const getNextBundleNudge = () => {
    if (totals.itemCount === 1) return 'Add 1 more piece to unlock 5% Buy More, Save More discount.';
    if (totals.itemCount === 2) return '5% bundle discount applied! Add 1 more piece for 10% off.';
    if (totals.itemCount === 3) return '10% bundle discount applied! Add 1 more piece for 15% off.';
    return 'Maximum 15% Buy More, Save More discount applied!';
  };

  const isApPin = /^5[0-3]\d{4}$/.test(clientPinCode.trim());
  const isValidPin = /^\d{6}$/.test(clientPinCode.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden bg-[#2A2825]/60 backdrop-blur-sm flex justify-end"
    >
      <div className="relative w-full max-w-xl bg-[#FBF9F5] h-full shadow-[0_12px_36px_-8px_rgba(42,40,37,0.15)] flex flex-col justify-between border-l border-[#E7E2DA] animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E7E2DA] bg-[#FFFFFF] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#9E582C]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#804116]">
                Abhi Furniture Mall
              </span>
            </div>
            <h2 id="cart-title" className="font-serif text-xl sm:text-2xl font-medium text-[#1C1C18] mt-0.5">
              Your Shopping Cart ({totals.itemCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-2 rounded-[4px] hover:bg-[#F5F1EB] text-[#2A2825] border border-[#E7E2DA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {submittedOrder ? (
            <div className="p-7 text-center bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] space-y-4 my-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1C1C18]">
                Order Specification Received
              </h3>
              <p className="text-xs text-[#53433B] leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-[#1C1C18]">{submittedOrder.clientName}</strong>. Our Vijayawada and Visakhapatnam design directors have received your specification for <strong className="text-[#1C1C18]">{submittedOrder.clientCity} ({submittedOrder.clientPinCode})</strong>. We will reach out on <strong className="text-[#1C1C18]">{submittedOrder.clientPhone}</strong> / <strong className="text-[#1C1C18]">{submittedOrder.clientEmail}</strong> within 1 business day.
              </p>
              <div className="p-4 bg-[#FBF9F5] rounded-[4px] border border-[#E7E2DA] text-left text-xs font-mono space-y-1">
                <div>Spec Reference: {submittedOrder.id}</div>
                <div>Pieces Ordered: {submittedOrder.items.reduce((s, i) => s + i.quantity, 0)}</div>
                <div>Total (incl. GST): {formatPrice(submittedOrder.total)}</div>
              </div>

              <a
                href={`https://wa.me/918662489100?text=${encodeURIComponent(
                  `Hello Abhi Furniture Mall, my order reference is ${submittedOrder.id} for ${submittedOrder.clientCity} (${submittedOrder.clientPinCode}). Estimated total: ${formatPrice(submittedOrder.total)}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-6 border border-[#2A2825] text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#F5F1EB] transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4 text-[#9E582C]" />
                <span>Share Order on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setSubmittedOrder(null);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="w-full py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Consultation Checkout Form */
            <form onSubmit={handleSubmitOrder} className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-4">
              <div className="border-b border-[#E7E2DA] pb-3">
                <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                  Delivery & Order Confirmation
                </h3>
                <p className="text-xs text-[#53433B]">
                  Provide your Andhra Pradesh / India delivery details for timber dispatch scheduling.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#2A2825] tracking-wider mb-1">
                  Full Name / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Karthikeya Rao or Studio Amaravati"
                  className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2A2825] tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@example.in"
                    className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2A2825] tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9+\-\s]{10,15}"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2A2825] tracking-wider mb-1">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={clientPinCode}
                    onChange={(e) => setClientPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 520010"
                    className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#2A2825] tracking-wider mb-1">
                    City & State *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="e.g. Vijayawada, Andhra Pradesh"
                    className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              {isValidPin && (
                <div className="p-2.5 rounded-[4px] bg-[#F5F1EB] border border-[#E7E2DA] text-[11px] text-[#804116] font-medium">
                  {isApPin
                    ? '✓ Andhra Pradesh Express Zone: Complimentary installation team available (4–7 days).'
                    : '✓ Pan-India Insured Timber Freight available (7–12 days).'}
                </div>
              )}

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
                >
                  Confirm Order ({formatPrice(totals.total)})
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="py-3 px-4 border border-[#E7E2DA] text-xs font-semibold uppercase text-[#53433B] hover:bg-[#F5F1EB] rounded-[4px] cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          ) : items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F1EB] border border-[#E7E2DA] flex items-center justify-center text-[#86736A]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#1C1C18]">Your Shopping Cart is Empty</h3>
              <p className="text-xs text-[#53433B] max-w-xs mx-auto leading-relaxed">
                Explore handcrafted solid timber pieces, add 2+ pieces to unlock Buy More, Save More discounts.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 bg-[#2A2825] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#9E582C] transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Buy More, Save More Nudge */}
              <div className="p-3 rounded-[4px] bg-[#FFE7DB]/60 border border-[#D9C2B7] text-xs text-[#804116] font-medium flex items-center space-x-2">
                <Tag className="w-4 h-4 shrink-0 text-[#9E582C]" />
                <span>{getNextBundleNudge()}</span>
              </div>

              {items.map((item) => {
                const itemUnitPrice = item.basePrice + (item.optionExtraPrice || 0);
                const itemTotalPrice = itemUnitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-4 flex gap-4 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-24 rounded-[2px] object-cover bg-[#F7F5F0] flex-shrink-0 border border-[#E7E2DA]"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-semibold text-[#1C1C18]">
                            {item.productName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.productName}`}
                            className="text-[#86736A] hover:text-[#BA1A1A] p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#53433B] mt-0.5 space-y-0.5">
                          {item.selectedWoodOption && <div>Timber: {item.selectedWoodOption}</div>}
                          {item.selectedFabricOption && <div>Textile: {item.selectedFabricOption}</div>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F5F1EB]">
                        <div className="flex items-center border border-[#E7E2DA] rounded-[4px] bg-[#FBF9F5]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-[#1C1C18]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-sans text-sm font-semibold text-[#2A2825]">
                          {formatPrice(itemTotalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Promo Code Input */}
              <div className="p-3.5 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. AFH5, DIWALI10)"
                    className="flex-1 p-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="py-2 px-4 bg-[#2A2825] hover:bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p className="text-[11px] text-[#804116] font-medium">{promoFeedback}</p>
                )}
              </div>

              {/* Swatch Prompt */}
              <div className="p-4 bg-[#F5F1EB] border border-[#E7E2DA] rounded-[4px] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#9E582C] flex-shrink-0" />
                  <span className="text-[#53433B]">Want physical timber & linen samples first?</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenSampleKit}
                  className="text-[#804116] font-semibold underline underline-offset-2 hover:text-[#2A2825] cursor-pointer"
                >
                  Request Kit (₹0)
                </button>
              </div>

              {/* White Glove Service Toggle */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="white-glove-toggle"
                  checked={includeWhiteGlove}
                  onChange={(e) => setIncludeWhiteGlove(e.target.checked)}
                  className="mt-1 accent-[#9E582C] w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="white-glove-toggle" className="text-xs text-[#53433B] cursor-pointer">
                  <span className="font-semibold text-[#1C1C18] block">
                    White Glove Placement & Packaging Removal (+{formatPrice(4500)})
                  </span>
                  Two-person installation team unpacks, assembles, and positions each piece in your home.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && !isCheckingOut && !submittedOrder && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E7E2DA] space-y-4">
            <div className="space-y-1.5 text-xs text-[#53433B]">
              <div className="flex justify-between">
                <span>Pieces Subtotal</span>
                <span className="font-mono font-medium text-[#1C1C18]">
                  {formatPrice(totals.subtotal)}
                </span>
              </div>

              {totals.bundleDiscount > 0 && (
                <div className="flex justify-between text-[#804116] font-medium">
                  <span>Buy More, Save More ({Math.round(totals.bundleDiscountRate * 100)}% Off)</span>
                  <span className="font-mono">-{formatPrice(totals.bundleDiscount)}</span>
                </div>
              )}

              {totals.promoDiscount > 0 && (
                <div className="flex justify-between text-[#804116] font-medium">
                  <span>Promo ({appliedPromo})</span>
                  <span className="font-mono">-{formatPrice(totals.promoDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Architectural Freight Dispatch</span>
                <span className="font-mono font-medium text-[#1C1C18]">
                  {totals.shipping === 0 ? (
                    <span className="text-[#804116] font-semibold">FREE (Over ₹75,000)</span>
                  ) : (
                    formatPrice(totals.shipping)
                  )}
                </span>
              </div>

              {includeWhiteGlove && (
                <div className="flex justify-between">
                  <span>White Glove Room Placement</span>
                  <span className="font-mono font-medium text-[#1C1C18]">
                    {formatPrice(totals.whiteGloveDelivery)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST (12%)</span>
                <span className="font-mono font-medium text-[#1C1C18]">
                  {formatPrice(totals.tax)}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E7E2DA] flex justify-between items-baseline text-base font-semibold text-[#1C1C18]">
                <span className="font-serif">Total Investment</span>
                <div className="text-right">
                  <span className="font-sans text-xl text-[#2A2825] block">
                    {formatPrice(totals.total)}
                  </span>
                  <span className="text-[11px] font-medium text-[#804116] block">
                    No-Cost EMI from {formatPrice(totals.monthlyEmi)}/mo
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 px-7 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.06em] rounded-[4px] hover:bg-[#2A2825] transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Payment & Trust Signals */}
            <div className="pt-2 border-t border-[#F5F1EB] space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-[#6A635E] font-medium">
                <span className="px-2 py-0.5 bg-[#F5F1EB] rounded border border-[#E7E2DA]">UPI / GPay</span>
                <span className="px-2 py-0.5 bg-[#F5F1EB] rounded border border-[#E7E2DA]">PhonePe</span>
                <span className="px-2 py-0.5 bg-[#F5F1EB] rounded border border-[#E7E2DA]">RuPay</span>
                <span className="px-2 py-0.5 bg-[#F5F1EB] rounded border border-[#E7E2DA]">Cards</span>
                <span className="px-2 py-0.5 bg-[#F5F1EB] rounded border border-[#E7E2DA]">No-Cost EMI</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#86736A] uppercase tracking-wider text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9E582C] shrink-0" />
                <span>10-Year Timber Warranty · Free Transit Insurance · Easy Returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
