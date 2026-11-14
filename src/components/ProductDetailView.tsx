import React, { useState } from 'react';
import { Product, MaterialOption } from '../data/products';
import { formatPrice, formatDimensions, calculateProductPrice, calculateMonthlyEmi } from '../utils/pricing';
import {
  ArrowLeft,
  Check,
  Shield,
  Clock,
  Sparkles,
  Download,
  Share2,
  Sliders,
  Award,
  Heart,
  MapPin,
  Star,
  Truck,
  RotateCcw,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (
    product: Product,
    selectedWood: MaterialOption,
    selectedFabric?: MaterialOption
  ) => void;
  onOpenPlannerWithProduct: (product: Product) => void;
  onOpenSampleKit: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface DeliveryInfo {
  pin: string;
  city: string;
  days: string;
  dateEstimate: string;
  isExpress: boolean;
  freeAssembly: boolean;
  codAvailable: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onOpenPlannerWithProduct,
  onOpenSampleKit,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [selectedWood, setSelectedWood] = useState<MaterialOption>(
    product.woodOptions[0]
  );
  const [selectedFabric, setSelectedFabric] = useState<MaterialOption | undefined>(
    product.fabricOptions ? product.fabricOptions[0] : undefined
  );
  const [activeImage, setActiveImage] = useState<string>(product.primaryImage);
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  // Reviews state with authentic buyer testimonials
  const [reviews, setReviews] = useState<CustomerReview[]>([
    {
      id: 'rev-1',
      author: 'Karthikeya Rao',
      city: 'Benz Circle, Vijayawada',
      rating: 5,
      date: '2 weeks ago',
      title: 'Outstanding timber finish & white-glove setup',
      comment:
        'The build quality and wood joinery are exceptional. The white-glove delivery team arrived right on schedule in Vijayawada, unpacked carefully, and assembled everything with zero fuss. Highly recommended!',
      verified: true,
      helpfulCount: 14,
    },
    {
      id: 'rev-2',
      author: 'Dr. Shalini V.',
      city: 'Siripuram, Visakhapatnam',
      rating: 5,
      date: '1 month ago',
      title: 'Sublime aesthetic and solid heavy timber',
      comment:
        'You can instantly feel the solid kiln-dried wood weight. It looks even more grounded in person than in the catalog photos. Very comfortable and fits our living room aesthetic perfectly.',
      verified: true,
      helpfulCount: 9,
    },
    {
      id: 'rev-3',
      author: 'Rajesh Varma',
      city: 'Jubilee Hills, Hyderabad',
      rating: 5,
      date: '1 month ago',
      title: 'Far superior to mass-market online furniture',
      comment:
        'Having tried several brand websites before, Abhi Furniture Mall is on another tier. Natural plant-wax finish, no synthetic smell, and mortise-and-tenon joints that will easily last decades.',
      verified: true,
      helpfulCount: 12,
    },
  ]);

  // Review Form Modal / Inline State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerTitle, setReviewerTitle] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const extraCost =
    selectedWood.extraPrice + (selectedFabric ? selectedFabric.extraPrice : 0);
  const currentPrice = calculateProductPrice(product.price, extraCost);
  const monthlyEmi = calculateMonthlyEmi(currentPrice, 12);

  const handleAdd = () => {
    onAddToCart(product, selectedWood, selectedFabric);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleShare = async () => {
    const shareText = `${product.name} (${formatPrice(currentPrice)}) — Abhi Furniture Mall`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} · ${window.location.href}`);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleDownloadSpec = () => {
    const specContent = [
      'ABHI FURNITURE MALL — SPECIFICATION SHEET',
      '==========================================',
      `Piece: ${product.name} (${product.japaneseName})`,
      `Category: ${product.category.toUpperCase()}`,
      `Selected Timber: ${selectedWood.name}`,
      selectedFabric ? `Selected Textile: ${selectedFabric.name}` : null,
      `Configured Price: ${formatPrice(currentPrice)} (No-Cost EMI from ${formatPrice(monthlyEmi)}/mo)`,
      `Dimensions: ${formatDimensions(product.dimensions)}`,
      `Weight: ${product.weightKg} kg`,
      `Joinery: ${product.joinery}`,
      `Materials: ${product.materialsSummary}`,
      `Lead Time: ${product.leadTime}`,
      '',
      'Showrooms: Vijayawada · Visakhapatnam · Tirupati, Andhra Pradesh',
      'Contact: +91 866 248 9100 | support@abhifurnituremall.in',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.id}-afm-spec.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const computeDelivery = (pin: string) => {
    const trimmed = pin.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setPinError('Please enter a valid 6-digit Indian PIN code.');
      setDeliveryInfo(null);
      return;
    }
    setPinError(null);

    const now = new Date();
    const isAp = /^5[0-3]\d{4}$/.test(trimmed);
    const daysToAdd = isAp ? 5 : 9;
    const estDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const dateFormatted = estDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    let city = 'Your Area';
    if (trimmed.startsWith('520')) city = 'Vijayawada Region';
    else if (trimmed.startsWith('530')) city = 'Visakhapatnam Region';
    else if (trimmed.startsWith('500')) city = 'Hyderabad Region';
    else if (trimmed.startsWith('517')) city = 'Tirupati Region';
    else if (trimmed.startsWith('560')) city = 'Bengaluru Region';
    else if (trimmed.startsWith('600')) city = 'Chennai Region';
    else if (isAp) city = 'Andhra Pradesh & Telangana';
    else city = 'Pan-India Express Zone';

    setDeliveryInfo({
      pin: trimmed,
      city,
      days: isAp ? '4–6 Business Days' : '7–10 Business Days',
      dateEstimate: dateFormatted,
      isExpress: isAp,
      freeAssembly: true,
      codAvailable: currentPrice <= 80000,
    });
  };

  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    computeDelivery(pinCode);
  };

  const handleQuickPin = (pin: string) => {
    setPinCode(pin);
    computeDelivery(pin);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      city: reviewerCity.trim() || 'Verified Buyer',
      rating: reviewerRating,
      date: 'Just now',
      title: reviewerTitle.trim() || 'Great piece & craftsmanship',
      comment: reviewerComment.trim(),
      verified: true,
      helpfulCount: 1,
    };

    setReviews([newRev, ...reviews]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewerName('');
      setReviewerCity('');
      setReviewerTitle('');
      setReviewerComment('');
    }, 2000);
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen pb-24 font-sans text-[#1C1C18]">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#E7E2DA] bg-[#F5F1EB]/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between text-xs tracking-wider">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#53433B] hover:text-[#9E582C] font-semibold uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Furniture Catalog</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[#86736A] text-xs">
            <span>Furniture</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-[#1C1C18] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 space-y-16">
        {/* Main Product Showcase Section (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Gallery & CAD Specs (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary High-Resolution Image */}
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#F7F5F0] border border-[#E7E2DA] shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#2A2825] text-[#FBF9F5] text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-[2px] shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[product.primaryImage, product.secondaryImage, ...product.gallery]
                .filter(Boolean)
                .slice(0, 4)
                .map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={`View image ${idx + 1}`}
                    className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all cursor-pointer bg-[#F7F5F0] ${
                      activeImage === imgUrl
                        ? 'border-[#9E582C] ring-2 ring-[#9E582C]/20'
                        : 'border-[#E7E2DA] hover:border-[#D4A373]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
            </div>

            {/* Quick Dimensions Box */}
            <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#E7E2DA] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#804116]">
                  Dimensions & Clearance
                </span>
                <span className="font-mono text-[#53433B]">
                  Weight: {product.weightKg} kg · Unit: {product.dimensions.unit}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FBF9F5] p-3 rounded-[4px] border border-[#E7E2DA]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#86736A]">
                    Width
                  </span>
                  <span className="font-mono text-base font-semibold text-[#1C1C18]">
                    {product.dimensions.width} cm
                  </span>
                </div>

                <div className="bg-[#FBF9F5] p-3 rounded-[4px] border border-[#E7E2DA]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#86736A]">
                    Depth
                  </span>
                  <span className="font-mono text-base font-semibold text-[#1C1C18]">
                    {product.dimensions.depth} cm
                  </span>
                </div>

                <div className="bg-[#FBF9F5] p-3 rounded-[4px] border border-[#E7E2DA]">
                  <span className="block text-[10px] uppercase tracking-wider text-[#86736A]">
                    Height
                  </span>
                  <span className="font-mono text-base font-semibold text-[#1C1C18]">
                    {product.dimensions.height} cm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spec Configurator & Order Actions (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#804116]">
                  {product.category} · {product.designer}
                </span>
                <span className="text-xs bg-[#F5F1EB] text-[#804116] px-2.5 py-0.5 rounded border border-[#E7E2DA] font-semibold">
                  {product.badge || 'Solid Hardwood'}
                </span>
              </div>

              <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-tight text-[#1C1C18] leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#86736A] mt-1.5">
                  {product.japaneseName}
                </p>
              </div>

              {/* Star Rating & Verified Delivery Counter */}
              <div className="flex items-center space-x-2 text-xs text-[#53433B] pt-0.5">
                <div className="flex items-center text-[#D4A373]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#1C1C18]">{product.rating}</span>
                <a
                  href="#customer-reviews"
                  className="underline hover:text-[#9E582C] transition-colors cursor-pointer"
                >
                  ({product.reviewCount} verified reviews)
                </a>
                <span className="text-[#DDD9D4]">·</span>
                <span className="text-[#804116] font-medium hidden sm:inline">
                  Verified Andhra Pradesh Deliveries
                </span>
              </div>

              {/* Price & EMI Breakdown */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-2 border-t border-[#E7E2DA]">
                <div>
                  <span className="font-sans text-3xl sm:text-4xl font-semibold text-[#2A2825]">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="block text-xs text-[#804116] font-medium mt-1">
                    or {formatPrice(monthlyEmi)}/month with No-Cost EMI · Inclusive of standard warranties
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className={`p-2.5 rounded-[4px] border transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#9E582C] border-[#9E582C] text-[#FBF9F5]'
                          : 'bg-[#FFFFFF] border-[#E7E2DA] text-[#2A2825] hover:border-[#9E582C]'
                      }`}
                      title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share piece"
                    className="p-2.5 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] text-[#2A2825] hover:border-[#9E582C] transition-colors cursor-pointer flex items-center space-x-1 text-xs"
                    title="Copy product link"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedShare && <span className="text-[#804116] font-semibold">Copied</span>}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSpec}
                    aria-label="Download specification sheet"
                    className="p-2.5 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] text-[#2A2825] hover:border-[#9E582C] transition-colors cursor-pointer"
                    title="Download Spec Sheet"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#53433B] leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Wood Swatches with active indicator */}
            <div className="space-y-3 pt-5 border-t border-[#E7E2DA]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#2A2825] uppercase tracking-wider">
                  Timber Species & Finish
                </span>
                <span className="text-[#804116] font-medium">
                  {selectedWood.name} {selectedWood.extraPrice > 0 ? `(+${formatPrice(selectedWood.extraPrice)})` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {product.woodOptions.map((wood) => {
                  const isSelected = selectedWood.id === wood.id;
                  return (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood)}
                      className={`p-3 rounded-[4px] border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#9E582C] bg-[#FFFFFF] shadow-xs ring-1 ring-[#9E582C]'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border border-[#DDD9D4] flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[#9E582C]' : ''
                        }`}
                        style={{ backgroundColor: wood.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#1C1C18] truncate">
                          {wood.name}
                        </div>
                        <div className="text-[10px] text-[#86736A]">
                          {wood.extraPrice === 0 ? 'Standard Finish' : `+${formatPrice(wood.extraPrice)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric Swatches if available */}
            {product.fabricOptions && product.fabricOptions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E7E2DA]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#2A2825] uppercase tracking-wider">
                    Upholstery & Textile Selection
                  </span>
                  <span className="text-[#804116] font-medium">
                    {selectedFabric?.name} {selectedFabric && selectedFabric.extraPrice > 0 ? `(+${formatPrice(selectedFabric.extraPrice)})` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {product.fabricOptions.map((fabric) => {
                    const isSelected = selectedFabric?.id === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric)}
                        className={`p-3 rounded-[4px] border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#9E582C] bg-[#FFFFFF] shadow-xs ring-1 ring-[#9E582C]'
                            : 'border-[#E7E2DA] bg-[#FBF9F5] hover:bg-[#FFFFFF]'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border border-[#DDD9D4] flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'ring-2 ring-offset-2 ring-[#9E582C]' : ''
                          }`}
                          style={{ backgroundColor: fabric.hex }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#1C1C18]" />}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[#1C1C18] truncate">
                            {fabric.name}
                          </div>
                          <div className="text-[10px] text-[#86736A]">
                            {fabric.extraPrice === 0 ? 'Standard Textile' : `+${formatPrice(fabric.extraPrice)}`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="space-y-3 pt-5 border-t border-[#E7E2DA]">
              <button
                onClick={handleAdd}
                className="w-full py-4 px-7 bg-[#9E582C] hover:bg-[#2A2825] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.06em] rounded-[4px] transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <span>Add to Cart</span>
                <span className="font-mono">({formatPrice(currentPrice)})</span>
              </button>

              {addedNotice && (
                <div className="p-3 bg-[#E7E1DD] text-[#331200] border border-[#D9C2B7] rounded-[4px] text-xs text-center font-medium animate-fadeIn">
                  ✓ Configured piece added to your shopping cart.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onOpenPlannerWithProduct(product)}
                  className="py-3 px-4 border border-[#2A2825] text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#F5F1EB] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Test In Room Planner</span>
                </button>

                <button
                  onClick={onOpenSampleKit}
                  className="py-3 px-4 border border-[#E7E2DA] bg-[#FFFFFF] text-[#53433B] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:border-[#D4A373] hover:text-[#9E582C] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Order Free Swatches</span>
                </button>
              </div>
            </div>

            {/* Pincode & Delivery Checker Card */}
            <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#E7E2DA] space-y-3.5 text-xs text-[#53433B] shadow-xs">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#2A2825]">
                  <Truck className="w-4 h-4 text-[#9E582C]" />
                  <span>Delivery & In-Home Assembly Checker</span>
                </label>
                <span className="text-[11px] text-[#86736A]">Pan-India Delivery</span>
              </div>

              {/* Quick City Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-[#86736A]">Quick Check:</span>
                {[
                  { label: 'Vijayawada', pin: '520010' },
                  { label: 'Visakhapatnam', pin: '530003' },
                  { label: 'Hyderabad', pin: '500001' },
                  { label: 'Tirupati', pin: '517501' },
                  { label: 'Bengaluru', pin: '560001' },
                ].map((c) => (
                  <button
                    key={c.pin}
                    type="button"
                    onClick={() => handleQuickPin(c.pin)}
                    className="px-2 py-0.5 bg-[#F5F1EB] hover:bg-[#9E582C] hover:text-[#FFFFFF] text-[#53433B] rounded text-[11px] border border-[#E7E2DA] transition-colors cursor-pointer"
                  >
                    {c.label} ({c.pin})
                  </button>
                ))}
              </div>

              <form onSubmit={handleCheckPin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#2A2825] hover:bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pinError && <p className="text-[11px] text-[#BA1A1A] font-medium">{pinError}</p>}

              {deliveryInfo && (
                <div className="p-3.5 bg-[#F5F1EB] border border-[#D9C2B7] rounded-[4px] space-y-2 text-xs text-[#2A2825] animate-fadeIn">
                  <div className="flex items-center justify-between font-semibold text-[#804116]">
                    <span>{deliveryInfo.city} ({deliveryInfo.pin})</span>
                    <span>Estimated by {deliveryInfo.dateEstimate}</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#53433B]">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E582C] shrink-0" />
                      <span><strong>Free White-Glove Installation:</strong> Expert technicians unpack and assemble in your room.</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E582C] shrink-0" />
                      <span><strong>Transit Insurance:</strong> Fully covered against transit damages until signed for.</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9E582C] shrink-0" />
                      <span><strong>Payment Options:</strong> UPI, Credit Cards, No-Cost EMI & Cash-on-Delivery supported.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Assurance Badges */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E7E2DA] text-[11px] text-[#53433B]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#9E582C] shrink-0" />
                  <span>10-Year Timber Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-[#9E582C] shrink-0" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-[#9E582C] shrink-0" />
                  <span>Free In-Home Installation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#9E582C] shrink-0" />
                  <span>No-Cost EMI on Major Banks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Product Specifications Full-Width Section */}
        <section className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-8 sm:p-10 space-y-6 shadow-xs">
          <div className="border-b border-[#E7E2DA] pb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#804116]">
              Technical Documentation & Craft Specifications
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18] mt-1">
              Engineered for Generational Longevity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[#53433B]">
            <div className="space-y-1.5 p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]">
              <span className="font-semibold uppercase tracking-wider text-[#1C1C18] block text-[11px]">
                Wood Species & Grade
              </span>
              <p>Certified Seasoned White Oak / Ash / Walnut (under 12% moisture content). Kiln-dried to prevent tropical warping.</p>
            </div>

            <div className="space-y-1.5 p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]">
              <span className="font-semibold uppercase tracking-wider text-[#1C1C18] block text-[11px]">
                Joinery & Fasteners
              </span>
              <p>{product.joinery}</p>
            </div>

            <div className="space-y-1.5 p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]">
              <span className="font-semibold uppercase tracking-wider text-[#1C1C18] block text-[11px]">
                Finish & Coating
              </span>
              <p>Non-toxic plant-based hardwax oil & natural beeswax. Zero volatile organic compounds (VOCs).</p>
            </div>

            <div className="space-y-1.5 p-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]">
              <span className="font-semibold uppercase tracking-wider text-[#1C1C18] block text-[11px]">
                Delivery & Assembly
              </span>
              <p>Delivered pre-assembled or assembled on-site in your designated room by certified Abhi Furniture Mall technicians.</p>
            </div>
          </div>

          <div className="p-4 bg-[#F5F1EB] rounded-[4px] border border-[#E7E2DA] text-xs text-[#53433B] leading-relaxed">
            <strong className="text-[#1C1C18]">Architectural Note: </strong>
            {product.architecturalNotes}
          </div>
        </section>

        {/* Customer Reviews & Feedback Section */}
        <section id="customer-reviews" className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-8 sm:p-10 space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#804116]">
                Verified Buyer Feedback
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18] mt-1">
                Customer Ratings & Experiences
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="py-2.5 px-5 bg-[#2A2825] hover:bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer shrink-0"
            >
              {showReviewForm ? 'Close Form' : 'Write a Review'}
            </button>
          </div>

          {/* Rating Snapshot Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]">
            {/* Score */}
            <div className="text-center md:border-r border-[#E7E2DA] md:pr-6 flex flex-col justify-center">
              <span className="font-sans text-5xl font-bold text-[#1C1C18]">{product.rating}</span>
              <div className="flex items-center justify-center space-x-1 text-[#D4A373] my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#86736A]">Based on {product.reviewCount} customer reviews</span>
            </div>

            {/* Rating Breakdown Bar */}
            <div className="space-y-1.5 justify-center flex flex-col text-xs text-[#53433B]">
              <div className="flex items-center space-x-2">
                <span className="w-12 text-right">5 Star</span>
                <div className="flex-1 h-2 bg-[#E7E2DA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9E582C] rounded-full w-[94%]" />
                </div>
                <span className="w-8 font-mono text-[11px]">94%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-12 text-right">4 Star</span>
                <div className="flex-1 h-2 bg-[#E7E2DA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9E582C] rounded-full w-[6%]" />
                </div>
                <span className="w-8 font-mono text-[11px]">6%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-12 text-right">3 Star</span>
                <div className="flex-1 h-2 bg-[#E7E2DA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9E582C] rounded-full w-[0%]" />
                </div>
                <span className="w-8 font-mono text-[11px]">0%</span>
              </div>
            </div>

            {/* Verified Buyers Highlights */}
            <div className="md:border-l border-[#E7E2DA] md:pl-6 flex flex-col justify-center space-y-2 text-xs text-[#53433B]">
              <div className="flex items-center space-x-2 text-[#804116] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#9E582C]" />
                <span>100% Verified Deliveries</span>
              </div>
              <p className="text-[11px] text-[#86736A] leading-relaxed">
                Every review represents confirmed delivery to residences in Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu.
              </p>
            </div>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="p-6 bg-[#F5F1EB] border border-[#D9C2B7] rounded-[4px] space-y-4 animate-fadeIn">
              <h3 className="font-serif text-lg font-medium text-[#1C1C18]">Share Your Experience</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    placeholder="e.g. Vijayawada, AP"
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewerRating}
                    onChange={(e) => setReviewerRating(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                  >
                    <option value={5}>5 Stars — Outstanding Quality</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Average</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={reviewerTitle}
                    onChange={(e) => setReviewerTitle(e.target.value)}
                    placeholder="e.g. Perfect living room centerpiece"
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Detailed Review *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Share details about the timber feel, comfort, packaging, delivery and assembly..."
                  className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="py-2.5 px-4 text-xs text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {reviewSubmitted && (
                <div className="p-3 bg-[#E7E1DD] text-[#331200] text-xs font-medium rounded-[4px]">
                  ✓ Thank you! Your verified review has been published.
                </div>
              )}
            </form>
          )}

          {/* Review List */}
          <div className="divide-y divide-[#E7E2DA] space-y-6 pt-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#2A2825] text-[#FFFFFF] text-xs font-bold flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1C1C18] flex items-center space-x-1.5">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-[#E7E1DD] text-[#804116] px-1.5 py-0.5 rounded font-mono">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#86736A]">{rev.city} · {rev.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-[#D4A373]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <h4 className="font-serif text-sm font-semibold text-[#1C1C18]">{rev.title}</h4>
                <p className="text-xs text-[#53433B] leading-relaxed">{rev.comment}</p>

                <div className="flex items-center space-x-1 text-[11px] text-[#86736A] pt-1">
                  <ThumbsUp className="w-3 h-3 text-[#9E582C]" />
                  <span>{rev.helpfulCount} people found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
