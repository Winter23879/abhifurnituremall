import { CartItem } from './pricing';

export interface OrderRecord {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPinCode: string;
  clientCity: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  whiteGloveDelivery: number;
  total: number;
  promoCode?: string;
  status: 'submitted';
}

export interface SwatchRequestRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  pinCode: string;
  address: string;
  selectedMaterials: string[];
}

export interface ShowroomVisitRecord {
  id: string;
  createdAt: string;
  showroom: string;
  visitDate: string;
  timeSlot: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export const STORAGE_KEYS = {
  cart: 'afh_cart_v1',
  wishlist: 'afh_wishlist_v1',
  orders: 'afh_orders_v1',
  swatches: 'afh_swatches_v1',
  visits: 'afh_visits_v1',
} as const;

export function loadStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveStoredJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode failures cleanly
  }
}

