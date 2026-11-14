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
  const [pinStatus, setPinStatus] = useState<string | null>(null);

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
    const shareText = `${product.name} (${formatPrice(currentPrice)}) — Abhi Furniture Hall`;
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
      'ABHI FURNITURE MALL — ARCHITECTURAL SPECIFICATION',
      '==================================================',
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
    link.download = `${product.id}-afh-spec.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pinCode.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setPinStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (/^5[0-3]\d{4}$/.test(trimmed)) {
      setPinStatus(`Express Andhra Pradesh delivery to ${trimmed}: 4–7 business days with free installation.`);
    } else {
      setPinStatus(`Pan-India insured freight to ${trimmed}: 7–12 business days.`);
    }
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen pb-24">
      {/* Back button & Breadcrumbs */}
      <div className="border-b border-[#E7E2DA] bg-[#F5F1EB]/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between text-xs tracking-wider">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#53433B] hover:text-[#9E582C] font-semibold uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Collection</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[#86736A]">
            <span>Archive</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-[#1C1C18] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Gallery & Architectural CAD Diagram */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] rounded-[4px] overflow-hidden bg-[#F7F5F0] border border-[#E7E2DA] shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Floating Architectural Dimension Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-xs font-mono font-medium tracking-wider uppercase bg-[#FFFFFF]/95 text-[#2A2825] border border-[#E7E2DA] rounded-full shadow-sm">
                  {formatDimensions(product.dimensions)}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  aria-label={`View perspective ${i + 1}`}
                  className={`aspect-[4/3] rounded-[4px] overflow-hidden border transition-all ${
                    activeImage === imgUrl
                      ? 'border-[#9E582C] ring-2 ring-offset-2 ring-[#9E582C]'
                      : 'border-[#E7E2DA] opacity-80 hover:opacity-100'
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

            {/* Architectural Drawing & Joinery Spec Sheet Card */}
            <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9E582C]">
                    Structural Provenance
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1C1C18]">
                    Traditional Joinery & Craft
                  </h3>
                </div>
                <Award className="w-6 h-6 text-[#9E582C]" />
              </div>

              <div className="space-y-3 text-sm text-[#53433B] leading-relaxed">
                <p>
                  <strong className="text-[#1C1C18]">Joinery Method:</strong>{' '}
                  {product.joinery}
                </p>
                <p>
                  <strong className="text-[#1C1C18]">Architectural Intent:</strong>{' '}
                  {product.architecturalNotes}
                </p>
                <p>
                  <strong className="text-[#1C1C18]">Materiality:</strong>{' '}
                  {product.materialsSummary}. All wood components are sourced from sustainably managed FSC-certified forests and air-dried for 18 months before shaping.
                </p>
              </div>

              {/* Dimensional Diagram Preview */}
              <div className="pt-4 border-t border-[#F5F1EB] grid grid-cols-3 gap-4 text-center">
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

          {/* Right Column: Spec Configurator & Order Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.06em] font-semibold text-[#804116]">
                  {product.category} · {product.designer}
                </span>
                <span className="font-serif text-2xl text-[#86736A]">
                  {product.japaneseName}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1C1C18]">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
                <div>
                  <span className="font-sans text-3xl font-semibold text-[#2A2825]">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="block text-xs text-[#804116] font-medium mt-0.5">
                    No-Cost EMI from {formatPrice(monthlyEmi)}/month (12 mos) · GST extra at checkout
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className={`p-2 rounded-[4px] border transition-colors cursor-pointer ${
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
                    className="p-2 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] text-[#2A2825] hover:border-[#9E582C] transition-colors cursor-pointer flex items-center space-x-1 text-[11px]"
                    title="Copy product link"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedShare && <span className="text-[#804116] font-semibold">Copied</span>}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSpec}
                    aria-label="Download specification sheet"
                    className="p-2 rounded-[4px] border border-[#E7E2DA] bg-[#FFFFFF] text-[#2A2825] hover:border-[#9E582C] transition-colors cursor-pointer"
                    title="Download Spec Sheet"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-base text-[#53433B] leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Wood Swatches with active dual-ring indicator */}
            <div className="space-y-3 pt-6 border-t border-[#E7E2DA]">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-[#2A2825] uppercase tracking-wider text-xs">
                  Timber Species & Finish
                </span>
                <span className="text-xs text-[#804116] font-medium">
                  {selectedWood.name} {selectedWood.extraPrice > 0 ? `(+${formatPrice(selectedWood.extraPrice)})` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {product.woodOptions.map((wood) => {
                  const isSelected = selectedWood.id === wood.id;
                  return (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood)}
                      className={`p-3 rounded-[4px] border text-left flex items-center space-x-3 transition-all ${
                        isSelected
                          ? 'border-[#9E582C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#9E582C]'
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
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#2A2825] uppercase tracking-wider text-xs">
                    Textile & Upholstery Selection
                  </span>
                  <span className="text-xs text-[#804116] font-medium">
                    {selectedFabric?.name} {selectedFabric && selectedFabric.extraPrice > 0 ? `(+${formatPrice(selectedFabric.extraPrice)})` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {product.fabricOptions.map((fabric) => {
                    const isSelected = selectedFabric?.id === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric)}
                        className={`p-3 rounded-[4px] border text-left flex items-center space-x-3 transition-all ${
                          isSelected
                            ? 'border-[#9E582C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#9E582C]'
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

            {/* Interactive Actions */}
            <div className="space-y-3 pt-6 border-t border-[#E7E2DA]">
              <button
                onClick={handleAdd}
                className="w-full py-4 px-7 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.06em] rounded-[4px] hover:bg-[#2A2825] transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Add Selected Configuration to Archive</span>
                <span className="font-mono">({formatPrice(currentPrice)})</span>
              </button>

              {addedNotice && (
                <div className="p-3 bg-[#E7E1DD] text-[#331200] border border-[#D9C2B7] rounded-[4px] text-xs text-center font-medium animate-fadeIn">
                  ✓ Configured piece added to your architectural archive bag.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onOpenPlannerWithProduct(product)}
                  className="py-3 px-4 border border-[#2A2825] text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#F5F1EB] transition-colors flex items-center justify-center space-x-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Test In Spatial Studio</span>
                </button>

                <button
                  onClick={onOpenSampleKit}
                  className="py-3 px-4 border border-[#E7E2DA] bg-[#FFFFFF] text-[#53433B] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:border-[#D4A373] hover:text-[#9E582C] transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Order Swatch Kit</span>
                </button>
              </div>
            </div>

            {/* Lead Time & PIN Code Delivery Check */}
            <div className="p-5 rounded-[4px] bg-[#F5F1EB] border border-[#E7E2DA] space-y-3 text-xs text-[#53433B]">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#9E582C] flex-shrink-0" />
                <span><strong>Production:</strong> {product.leadTime} in our Vijayawada or Visakhapatnam workshop.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-[#9E582C] flex-shrink-0" />
                <span><strong>Architectural Guarantee:</strong> 12-year structural integrity warranty against joint fatigue.</span>
              </div>

              <form onSubmit={handleCheckPin} className="pt-2 border-t border-[#E7E2DA] space-y-2">
                <label className="flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#2A2825]">
                  <MapPin className="w-3.5 h-3.5 text-[#9E582C]" />
                  <span>Check Andhra Pradesh / India Delivery</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 520010)"
                    className="flex-1 p-2 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2A2825] hover:bg-[#9E582C] text-[#FBF9F5] text-[11px] font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {pinStatus && (
                  <p className="text-[11px] text-[#804116] font-medium">{pinStatus}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
