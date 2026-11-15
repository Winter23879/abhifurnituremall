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
  CreditCard,
  QrCode,
  Building2,
  CalendarClock,
  Banknote,
  Lock,
  ArrowLeft,
  Loader2,
  Check,
  Smartphone,
  CheckCircle2,
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

  // Checkout Steps: 'cart' | 'details' | 'payment'
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPinCode, setClientPinCode] = useState('');
  const [clientCity, setClientCity] = useState('');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'emi' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<3 | 6 | 9 | 12>(6);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !clientPinCode.trim()) {
      return;
    }
    setCheckoutStep('payment');
  };

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const parts = digits.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : digits);
  };

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      let paymentDetails: OrderRecord['paymentDetails'] = {
        paymentStatus: paymentMethod === 'cod' ? 'cod' : 'paid',
      };

      if (paymentMethod === 'upi') {
        const upiLabel =
          upiApp === 'gpay'
            ? 'Google Pay UPI'
            : upiApp === 'phonepe'
            ? 'PhonePe UPI'
            : upiApp === 'paytm'
            ? 'Paytm UPI'
            : upiApp === 'qr'
            ? 'Dynamic QR Code'
            : customUpiId || 'Instant UPI';
        paymentDetails = {
          upiId: upiLabel,
          paymentStatus: 'paid',
        };
      } else if (paymentMethod === 'card') {
        const clean = cardNumber.replace(/\s/g, '');
        const last4 = clean.length >= 4 ? clean.slice(-4) : '4242';
        paymentDetails = {
          cardLast4: last4,
          paymentStatus: 'paid',
        };
      } else if (paymentMethod === 'netbanking') {
        paymentDetails = {
          bankName: selectedBank,
          paymentStatus: 'paid',
        };
      } else if (paymentMethod === 'emi') {
        paymentDetails = {
          emiMonths: selectedEmiTenure,
          bankName: selectedBank,
          paymentStatus: 'paid',
        };
      } else if (paymentMethod === 'cod') {
        paymentDetails = {
          paymentStatus: 'cod',
        };
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
        paymentMethod,
        paymentDetails,
        status: 'submitted',
      };

      setIsProcessingPayment(false);
      onOrderSubmitted?.(order);
      setSubmittedOrder(order);
    }, 1100);
  };

  const getNextBundleNudge = () => {
    if (totals.itemCount === 1) return 'Add 1 more piece to unlock 5% Buy More, Save More discount.';
    if (totals.itemCount === 2) return '5% bundle discount applied! Add 1 more piece for 10% off.';
    if (totals.itemCount === 3) return '10% bundle discount applied! Add 1 more piece for 15% off.';
    return 'Maximum 15% Buy More, Save More discount applied!';
  };

  const isApPin = /^5[0-3]\d{4}$/.test(clientPinCode.trim());
  const isValidPin = /^\d{6}$/.test(clientPinCode.trim());

  const popularBanks = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
  ];

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
              {submittedOrder
                ? 'Order Confirmed'
                : isCheckingOut
                ? checkoutStep === 'details'
                  ? 'Delivery Specification'
                  : 'Select Payment Method'
                : `Your Shopping Cart (${totals.itemCount})`}
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
            /* Order Confirmation View */
            <div className="p-7 text-center bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] space-y-4 my-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1C1C18]">
                Order Confirmed & Timber Reserved
              </h3>
              <p className="text-xs text-[#53433B] leading-relaxed max-w-md mx-auto">
                Thank you, <strong className="text-[#1C1C18]">{submittedOrder.clientName}</strong>. Our Vijayawada and Visakhapatnam master carpenters have received your order for <strong className="text-[#1C1C18]">{submittedOrder.clientCity} ({submittedOrder.clientPinCode})</strong>. We will coordinate timber dispatch on <strong className="text-[#1C1C18]">{submittedOrder.clientPhone}</strong>.
              </p>

              {/* Order & Payment Summary Card */}
              <div className="p-4 bg-[#FBF9F5] rounded-[4px] border border-[#E7E2DA] text-left text-xs space-y-2">
                <div className="flex justify-between font-mono pb-2 border-b border-[#E7E2DA]">
                  <span className="text-[#86736A]">Spec Reference:</span>
                  <span className="font-bold text-[#1C1C18]">{submittedOrder.id}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#E7E2DA]">
                  <span className="text-[#86736A]">Payment Method:</span>
                  <span className="font-semibold text-[#804116] uppercase text-[11px] flex items-center gap-1.5">
                    {submittedOrder.paymentMethod === 'upi' && <Smartphone className="w-3.5 h-3.5" />}
                    {submittedOrder.paymentMethod === 'card' && <CreditCard className="w-3.5 h-3.5" />}
                    {submittedOrder.paymentMethod === 'netbanking' && <Building2 className="w-3.5 h-3.5" />}
                    {submittedOrder.paymentMethod === 'emi' && <CalendarClock className="w-3.5 h-3.5" />}
                    {submittedOrder.paymentMethod === 'cod' && <Banknote className="w-3.5 h-3.5" />}
                    <span>
                      {submittedOrder.paymentMethod === 'upi' && `UPI (${submittedOrder.paymentDetails?.upiId || 'Instant'})`}
                      {submittedOrder.paymentMethod === 'card' && `Card (•••• ${submittedOrder.paymentDetails?.cardLast4 || '4242'})`}
                      {submittedOrder.paymentMethod === 'netbanking' && `Net Banking (${submittedOrder.paymentDetails?.bankName || 'HDFC'})`}
                      {submittedOrder.paymentMethod === 'emi' && `No-Cost EMI (${submittedOrder.paymentDetails?.emiMonths || 6} mo - ${submittedOrder.paymentDetails?.bankName})`}
                      {submittedOrder.paymentMethod === 'cod' && 'Pay on Delivery (White-Glove Inspection)'}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#E7E2DA]">
                  <span className="text-[#86736A]">Payment Status:</span>
                  <span
                    className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded-[3px] ${
                      submittedOrder.paymentMethod === 'cod'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {submittedOrder.paymentMethod === 'cod' ? 'Pay Upon Inspection (COD)' : 'PAID & VERIFIED'}
                  </span>
                </div>

                <div className="flex justify-between font-mono pt-1 text-sm font-bold text-[#1C1C18]">
                  <span>Total Amount:</span>
                  <span>{formatPrice(submittedOrder.total)}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/918662489100?text=${encodeURIComponent(
                  `Hello Abhi Furniture Mall, I have placed order ${submittedOrder.id} for ${submittedOrder.clientCity} (${submittedOrder.clientPinCode}). Payment Method: ${submittedOrder.paymentMethod?.toUpperCase()}. Total: ${formatPrice(submittedOrder.total)}.`
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
                  setCheckoutStep('details');
                  onClose();
                }}
                className="w-full py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Multi-Step Container */
            <div className="space-y-4">
              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DA] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className={`flex items-center space-x-2 pb-1 transition-colors ${
                    checkoutStep === 'details'
                      ? 'text-[#9E582C] border-b-2 border-[#9E582C]'
                      : 'text-[#86736A] hover:text-[#1C1C18]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center text-[10px] font-mono">1</span>
                  <span>1. Delivery Details</span>
                </button>

                <span className="text-[#D9C2B7]">→</span>

                <button
                  type="button"
                  onClick={() => {
                    if (clientName && clientEmail && clientPhone && clientPinCode) {
                      setCheckoutStep('payment');
                    }
                  }}
                  className={`flex items-center space-x-2 pb-1 transition-colors ${
                    checkoutStep === 'payment'
                      ? 'text-[#9E582C] border-b-2 border-[#9E582C]'
                      : 'text-[#86736A] hover:text-[#1C1C18]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center text-[10px] font-mono">2</span>
                  <span>2. Payment Method</span>
                </button>
              </div>

              {/* STEP 1: DELIVERY DETAILS */}
              {checkoutStep === 'details' ? (
                <form onSubmit={handleProceedToPayment} className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-4">
                  <div className="border-b border-[#E7E2DA] pb-3">
                    <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                      Delivery & Contact Information
                    </h3>
                    <p className="text-xs text-[#53433B]">
                      Enter your address in Andhra Pradesh or across India for white-glove timber dispatch.
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
                      className="flex-1 py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="py-3 px-4 border border-[#E7E2DA] text-xs font-semibold uppercase text-[#53433B] hover:bg-[#F5F1EB] rounded-[4px] cursor-pointer"
                    >
                      Back to Cart
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: PAYMENT METHOD SELECTION */
                <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 space-y-5">
                  <div className="border-b border-[#E7E2DA] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                        Choose Payment Method
                      </h3>
                      <p className="text-xs text-[#53433B]">
                        Total payable: <strong className="text-[#1C1C18] font-mono">{formatPrice(totals.total)}</strong> (incl. all taxes & delivery)
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <Lock className="w-3.5 h-3.5" />
                      <span>256-Bit SSL</span>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'upi'
                          ? 'border-[#9E582C] bg-[#FFE7DB]/40 text-[#804116] shadow-xs'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#9E582C]" />
                      <span className="text-xs font-semibold">UPI</span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">Fastest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'card'
                          ? 'border-[#9E582C] bg-[#FFE7DB]/40 text-[#804116] shadow-xs'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#9E582C]" />
                      <span className="text-xs font-semibold">Cards</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#86736A]">Debit/Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('emi')}
                      className={`p-3 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'emi'
                          ? 'border-[#9E582C] bg-[#FFE7DB]/40 text-[#804116] shadow-xs'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <CalendarClock className="w-5 h-5 text-[#9E582C]" />
                      <span className="text-xs font-semibold">No-Cost EMI</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#804116] font-bold">0% Interest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#9E582C] bg-[#FFE7DB]/40 text-[#804116] shadow-xs'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-[#9E582C]" />
                      <span className="text-xs font-semibold">Net Banking</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#86736A]">All Banks</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-[4px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 col-span-2 sm:col-span-1 ${
                        paymentMethod === 'cod'
                          ? 'border-[#9E582C] bg-[#FFE7DB]/40 text-[#804116] shadow-xs'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-[#9E582C]" />
                      <span className="text-xs font-semibold">Pay on Delivery</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#804116]">Inspect 1st</span>
                    </button>
                  </div>

                  {/* METHOD 1: UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#2A2825]">
                          Select UPI Application or Scan QR
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">Instant Confirmation</span>
                      </div>

                      {/* UPI Apps Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setUpiApp('gpay')}
                          className={`p-2.5 rounded-[4px] border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                            upiApp === 'gpay'
                              ? 'border-[#9E582C] bg-white text-[#1C1C18] font-bold shadow-2xs'
                              : 'border-[#E7E2DA] bg-white text-[#53433B] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          <span className="text-[#4285F4] font-bold">G</span>
                          <span className="text-[#EA4335] font-bold">P</span>
                          <span className="text-[#FBBC05] font-bold">a</span>
                          <span className="text-[#34A853] font-bold">y</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUpiApp('phonepe')}
                          className={`p-2.5 rounded-[4px] border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                            upiApp === 'phonepe'
                              ? 'border-[#9E582C] bg-white text-[#5f259f] font-bold shadow-2xs'
                              : 'border-[#E7E2DA] bg-white text-[#53433B] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          <span className="text-[#5f259f] font-bold">PhonePe</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUpiApp('paytm')}
                          className={`p-2.5 rounded-[4px] border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                            upiApp === 'paytm'
                              ? 'border-[#9E582C] bg-white text-[#002e6e] font-bold shadow-2xs'
                              : 'border-[#E7E2DA] bg-white text-[#53433B] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          <span className="text-[#002e6e] font-bold">Paytm UPI</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUpiApp('qr')}
                          className={`p-2.5 rounded-[4px] border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                            upiApp === 'qr'
                              ? 'border-[#9E582C] bg-white text-[#804116] font-bold shadow-2xs'
                              : 'border-[#E7E2DA] bg-white text-[#53433B] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#9E582C]" />
                          <span>Scan QR</span>
                        </button>
                      </div>

                      {/* Dynamic QR Code display or Custom UPI ID */}
                      {upiApp === 'qr' ? (
                        <div className="p-4 bg-white border border-[#E7E2DA] rounded-[4px] text-center space-y-2">
                          <div className="w-32 h-32 mx-auto bg-white border-2 border-[#2A2825] p-2 flex flex-col items-center justify-center rounded-[4px] shadow-xs">
                            <QrCode className="w-24 h-24 text-[#2A2825]" />
                          </div>
                          <p className="text-[11px] font-mono text-[#804116]">
                            abhifurniture@icici · ₹{totals.total.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-[#86736A]">
                            Scan with Google Pay, PhonePe, Paytm, BHIM, or CRED
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider">
                            Or Enter UPI ID / VPA
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customUpiId}
                              onChange={(e) => setCustomUpiId(e.target.value)}
                              placeholder="e.g. mobileNumber@upi or name@okaxis"
                              className="flex-1 p-2.5 text-xs bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* METHOD 2: CREDIT / DEBIT CARDS */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-[#E7E2DA]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#2A2825]">
                          Card Information
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#86736A]">
                          <span className="px-1.5 py-0.5 bg-white rounded border border-[#E7E2DA]">RuPay</span>
                          <span className="px-1.5 py-0.5 bg-white rounded border border-[#E7E2DA]">Visa</span>
                          <span className="px-1.5 py-0.5 bg-white rounded border border-[#E7E2DA]">MasterCard</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4532 •••• •••• 8829"
                            className="w-full p-2.5 pl-9 text-xs font-mono bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                          />
                          <CreditCard className="w-4 h-4 text-[#86736A] absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. K. V. RAMANA"
                          className="w-full p-2.5 text-xs uppercase bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full p-2.5 text-xs font-mono bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full p-2.5 text-xs font-mono bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* METHOD 3: NO-COST EMI */}
                  {paymentMethod === 'emi' && (
                    <div className="p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] space-y-4">
                      <div className="flex items-center justify-between pb-1 border-b border-[#E7E2DA]">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#2A2825]">
                            No-Cost EMI (0% Interest)
                          </span>
                          <p className="text-[11px] text-[#804116]">
                            Zero extra interest. Pay over comfortable monthly tenures.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          Pre-Approved
                        </span>
                      </div>

                      {/* Bank Selector */}
                      <div>
                        <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                          Select EMI Issuing Bank
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                        >
                          <option value="HDFC Bank">HDFC Bank Credit/Debit EMI</option>
                          <option value="ICICI Bank">ICICI Bank Credit/Debit EMI</option>
                          <option value="State Bank of India">SBI Card EMI</option>
                          <option value="Axis Bank">Axis Bank EMI</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                      </div>

                      {/* Tenure Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { months: 3, popular: false },
                          { months: 6, popular: true },
                          { months: 9, popular: false },
                          { months: 12, popular: false },
                        ].map(({ months, popular }) => {
                          const monthly = Math.round(totals.total / months);
                          const isSelected = selectedEmiTenure === months;

                          return (
                            <button
                              key={months}
                              type="button"
                              onClick={() => setSelectedEmiTenure(months as 3 | 6 | 9 | 12)}
                              className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'border-[#9E582C] bg-white ring-1 ring-[#9E582C] shadow-2xs'
                                  : 'border-[#E7E2DA] bg-white hover:bg-[#F5F1EB]'
                              }`}
                            >
                              {popular && (
                                <span className="absolute -top-2 right-2 text-[8px] uppercase tracking-wider font-bold bg-[#9E582C] text-white px-1.5 py-0.2 rounded">
                                  Most Popular
                                </span>
                              )}
                              <div className="text-xs font-bold text-[#1C1C18]">{months} Months</div>
                              <div className="font-mono text-sm font-semibold text-[#804116] mt-0.5">
                                {formatPrice(monthly)}/mo
                              </div>
                              <div className="text-[10px] text-emerald-700 font-medium">0% Interest · ₹0 Fee</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* METHOD 4: NET BANKING */}
                  {paymentMethod === 'netbanking' && (
                    <div className="p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2A2825] block">
                        Popular Indian Banks
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {popularBanks.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            className={`p-2.5 rounded-[4px] border text-xs text-left transition-colors cursor-pointer flex items-center justify-between ${
                              selectedBank === b
                                ? 'border-[#9E582C] bg-white font-bold text-[#1C1C18] shadow-2xs'
                                : 'border-[#E7E2DA] bg-white text-[#53433B] hover:bg-[#F5F1EB]'
                            }`}
                          >
                            <span className="truncate">{b}</span>
                            {selectedBank === b && <Check className="w-3.5 h-3.5 text-[#9E582C] shrink-0" />}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] font-semibold text-[#53433B] uppercase tracking-wider mb-1">
                          Or Choose from 40+ Other Banks
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                        >
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="Canara Bank">Canara Bank</option>
                          <option value="Union Bank of India">Union Bank of India</option>
                          <option value="IndusInd Bank">IndusInd Bank</option>
                          <option value="Yes Bank">Yes Bank</option>
                          <option value="IDBI Bank">IDBI Bank</option>
                          <option value="Federal Bank">Federal Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* METHOD 5: PAY ON DELIVERY */}
                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] space-y-3">
                      <div className="flex items-center space-x-2 text-[#804116]">
                        <ShieldCheck className="w-5 h-5 text-[#9E582C] shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          White-Glove Inspection & Payment on Delivery
                        </span>
                      </div>
                      <p className="text-xs text-[#53433B] leading-relaxed">
                        Enjoy complete peace of mind. Our logistics team will bring your pieces, assemble them in your home, and invite you to inspect the wood grain, mortise-and-tenon joinery, and finish before you make payment.
                      </p>
                      <div className="p-2.5 bg-white rounded border border-[#E7E2DA] text-[11px] text-[#53433B] flex items-center justify-between">
                        <span>Payment modes accepted at delivery:</span>
                        <strong className="text-[#1C1C18]">Cash · UPI QR · Card Machine</strong>
                      </div>
                    </div>
                  )}

                  {/* Trust Signals Footer */}
                  <div className="flex items-center justify-center space-x-4 pt-1 text-[11px] text-[#86736A]">
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9E582C]" />
                      <span>10-Year Warranty</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-[#9E582C]" />
                      <span>RBI Compliant</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-[#9E582C]" />
                      <span>Insured Transit</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleCompleteOrder}
                      className="flex-1 py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Securing Transaction...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {paymentMethod === 'cod' ? 'Confirm Order' : `Pay ${formatPrice(totals.total)}`}
                          </span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setCheckoutStep('details')}
                      className="py-3 px-4 border border-[#E7E2DA] text-xs font-semibold uppercase text-[#53433B] hover:bg-[#F5F1EB] rounded-[4px] cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              onClick={() => {
                setIsCheckingOut(true);
                setCheckoutStep('details');
              }}
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
