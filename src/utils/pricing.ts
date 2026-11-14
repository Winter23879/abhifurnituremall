/**
 * Pure calculation utilities for pricing, architectural dimensions, and spatial analysis
 */

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  selectedWoodOption?: string;
  selectedFabricOption?: string;
  optionExtraPrice: number;
  quantity: number;
  image: string;
}

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
  unit?: string;
}

export interface FilterState {
  category: string;
  material: string;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name';
}

export function calculateProductPrice(
  basePrice: number,
  optionsExtraCost: number
): number {
  return Math.max(0, basePrice + optionsExtraCost);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDimensions(dim: Dimensions): string {
  const unit = dim.unit || 'cm';
  return `W ${dim.width} × D ${dim.depth} × H ${dim.height} ${unit}`;
}

export function calculateBundleDiscountRate(itemCount: number): number {
  if (itemCount >= 4) return 0.15;
  if (itemCount === 3) return 0.10;
  if (itemCount === 2) return 0.05;
  return 0;
}

export function evaluatePromoCode(code: string): number {
  const normalized = code.trim().toUpperCase();
  if (normalized === 'FESTIVE15') return 0.15;
  if (normalized === 'DIWALI10') return 0.10;
  if (normalized === 'AFM5' || normalized === 'AFH5') return 0.05;
  return 0;
}

export function calculateMonthlyEmi(amount: number, months: number = 12): number {
  if (amount <= 0 || months <= 0) return 0;
  return Math.round(amount / months);
}

export function calculateCartTotals(
  items: CartItem[],
  includeWhiteGlove: boolean = false,
  promoCode: string = ''
): {
  subtotal: number;
  bundleDiscountRate: number;
  bundleDiscount: number;
  promoDiscount: number;
  discountedSubtotal: number;
  tax: number;
  shipping: number;
  whiteGloveDelivery: number;
  total: number;
  itemCount: number;
  monthlyEmi: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.basePrice + (item.optionExtraPrice || 0)) * item.quantity,
    0
  );

  // "Buy More, Save More" automatic multi-piece discount (up to 15%)
  const bundleDiscountRate = calculateBundleDiscountRate(itemCount);
  const bundleDiscount = Math.round(subtotal * bundleDiscountRate);

  const afterBundle = Math.max(0, subtotal - bundleDiscount);
  const promoRate = evaluatePromoCode(promoCode);
  const promoDiscount = Math.round(afterBundle * promoRate);
  const discountedSubtotal = Math.max(0, afterBundle - promoDiscount);

  // Free standard freight on architectural orders over ₹75,000; else ₹3,500
  const shipping = subtotal > 0 ? (subtotal >= 75000 ? 0 : 3500) : 0;
  // White glove assembly & placement option
  const whiteGloveDelivery = includeWhiteGlove && subtotal > 0 ? 4500 : 0;
  // Indian GST @ 12% on discounted furniture value
  const tax = Math.round(discountedSubtotal * 0.12);
  const total = discountedSubtotal + shipping + whiteGloveDelivery + tax;
  const monthlyEmi = calculateMonthlyEmi(total, 12);

  return {
    subtotal,
    bundleDiscountRate,
    bundleDiscount,
    promoDiscount,
    discountedSubtotal,
    tax,
    shipping,
    whiteGloveDelivery,
    total,
    itemCount,
    monthlyEmi,
  };
}

export function calculateRoomSpatialLoad(
  roomWidthM: number,
  roomLengthM: number,
  placedFurnitureItems: Array<{ widthCm: number; depthCm: number }>
): {
  roomAreaM2: number;
  footprintM2: number;
  occupationPercentage: number;
  spatialRating: 'optimal-zen' | 'harmonious' | 'dense' | 'overcrowded';
  zenGuidance: string;
} {
  const roomAreaM2 = Math.max(1, +(roomWidthM * roomLengthM).toFixed(2));
  const footprintM2 = +(
    placedFurnitureItems.reduce(
      (acc, item) => acc + (item.widthCm / 100) * (item.depthCm / 100),
      0
    )
  ).toFixed(2);

  const occupationPercentage = Math.round((footprintM2 / roomAreaM2) * 100);

  let spatialRating: 'optimal-zen' | 'harmonious' | 'dense' | 'overcrowded' = 'optimal-zen';
  let zenGuidance = 'Ideal negative space (Ma); light flows uninhibited through the room.';

  if (occupationPercentage <= 28) {
    spatialRating = 'optimal-zen';
    zenGuidance = 'Sublime spatial harmony. Ample negative space allows each piece to breathe.';
  } else if (occupationPercentage <= 42) {
    spatialRating = 'harmonious';
    zenGuidance = 'Balanced proportion between tactile materials and walking circulation.';
  } else if (occupationPercentage <= 55) {
    spatialRating = 'dense';
    zenGuidance = 'Approaching physical capacity. Consider floating furniture away from partitions.';
  } else {
    spatialRating = 'overcrowded';
    zenGuidance = 'Excess visual weight. Remove 1-2 sculptural elements to restore serenity.';
  }

  return {
    roomAreaM2,
    footprintM2,
    occupationPercentage,
    spatialRating,
    zenGuidance,
  };
}
