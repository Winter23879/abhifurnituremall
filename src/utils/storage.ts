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

export interface AdminAuthSession {
  isAuthenticated: boolean;
  email: string;
  loggedAt: string;
}

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@abhifurnituremall.in',
  password: 'admin123',
};

export const STORAGE_KEYS = {
  cart: 'afh_cart_v1',
  wishlist: 'afh_wishlist_v1',
  orders: 'afh_orders_v1',
  swatches: 'afh_swatches_v1',
  visits: 'afh_visits_v1',
  products: 'afh_products_v1',
  adminAuth: 'afh_admin_auth_v1',
} as const;

export function getAdminSession(): AdminAuthSession | null {
  const session = loadStoredJson<AdminAuthSession | null>(STORAGE_KEYS.adminAuth, null);
  if (session && session.isAuthenticated) return session;
  return null;
}

export function setAdminSession(email: string): void {
  saveStoredJson<AdminAuthSession>(STORAGE_KEYS.adminAuth, {
    isAuthenticated: true,
    email,
    loggedAt: new Date().toISOString(),
  });
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.adminAuth);
  } catch {
    // Ignore storage quota or private-mode failures
  }
}

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

