import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProductPrice,
  formatPrice,
  formatDimensions,
  calculateCartTotals,
  calculateRoomSpatialLoad,
} from './pricing';

test('calculateProductPrice sums base price and options correctly', () => {
  assert.equal(calculateProductPrice(1200, 150), 1350);
  assert.equal(calculateProductPrice(850, 0), 850);
  assert.equal(calculateProductPrice(-50, 0), 0);
});

test('formatPrice formats INR correctly', () => {
  assert.equal(formatPrice(145000), '₹1,45,000');
  assert.equal(formatPrice(0), '₹0');
});

test('formatDimensions creates architectural notation', () => {
  const result = formatDimensions({ width: 86, depth: 82, height: 74, unit: 'cm' });
  assert.equal(result, 'W 86 × D 82 × H 74 cm');
});

test('calculateCartTotals computes shipping thresholds and taxes', () => {
  const items = [
    {
      id: 'item-1',
      productId: 'p-1',
      productName: 'Komorebi Chair',
      basePrice: 44500,
      optionExtraPrice: 3500,
      quantity: 1,
      image: '',
    },
    {
      id: 'item-2',
      productId: 'p-2',
      productName: 'Yūgen Table',
      basePrice: 49500,
      optionExtraPrice: 0,
      quantity: 1,
      image: '',
    },
  ];

  // Subtotal: 48000 + 49500 = 97500 (>= 75000, so shipping is free ₹0)
  // 2 items -> 5% Buy More Save More bundle discount = 4875 -> discountedSubtotal = 92625
  // 12% GST on 92625 = 11115
  const totals = calculateCartTotals(items, true);
  assert.equal(totals.subtotal, 97500);
  assert.equal(totals.bundleDiscountRate, 0.05);
  assert.equal(totals.bundleDiscount, Math.round(97500 * 0.05));
  assert.equal(totals.discountedSubtotal, 97500 - Math.round(97500 * 0.05));
  assert.equal(totals.shipping, 0);
  assert.equal(totals.whiteGloveDelivery, 4500);
  assert.equal(totals.tax, Math.round(totals.discountedSubtotal * 0.12));
  assert.equal(totals.total, totals.discountedSubtotal + 0 + 4500 + totals.tax);
  assert.equal(totals.itemCount, 2);
});

test('calculateCartTotals applies shipping under threshold', () => {
  const items = [
    {
      id: 'item-1',
      productId: 'p-1',
      productName: 'Tsuki Lamp',
      basePrice: 18500,
      optionExtraPrice: 0,
      quantity: 1,
      image: '',
    },
  ];

  const totals = calculateCartTotals(items, false);
  assert.equal(totals.subtotal, 18500);
  assert.equal(totals.bundleDiscount, 0);
  assert.equal(totals.shipping, 3500);
  assert.equal(totals.whiteGloveDelivery, 0);
  assert.equal(totals.tax, Math.round(18500 * 0.12));
  assert.equal(totals.total, 18500 + 3500 + Math.round(18500 * 0.12));
});

test('calculateCartTotals applies promo codes and 4-item 15% tier', () => {
  const items = [
    {
      id: 'item-1',
      productId: 'p-1',
      productName: 'Dining Chair',
      basePrice: 20000,
      optionExtraPrice: 0,
      quantity: 4,
      image: '',
    },
  ];

  const totals = calculateCartTotals(items, false, 'DIWALI10');
  assert.equal(totals.subtotal, 80000);
  assert.equal(totals.bundleDiscountRate, 0.15);
  assert.equal(totals.bundleDiscount, 12000);
  assert.equal(totals.promoDiscount, 6800);
  assert.equal(totals.discountedSubtotal, 61200);
  assert.equal(totals.monthlyEmi, Math.round(totals.total / 12));
});

test('calculateRoomSpatialLoad evaluates Japandi negative space (Ma)', () => {
  // 5m x 4m = 20 m2
  const roomWidth = 5;
  const roomLength = 4;
  const items = [
    { widthCm: 220, depthCm: 90 }, // Sofa: 1.98 m2
    { widthCm: 110, depthCm: 70 }, // Coffee table: 0.77 m2
  ];
  // Footprint: 2.75 m2 out of 20 m2 = 13.75% -> optimal-zen
  const analysis = calculateRoomSpatialLoad(roomWidth, roomLength, items);
  assert.equal(analysis.roomAreaM2, 20);
  assert.equal(analysis.footprintM2, 2.75);
  assert.equal(analysis.spatialRating, 'optimal-zen');
});
