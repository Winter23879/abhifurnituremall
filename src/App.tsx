import React, { useEffect, useState } from 'react';
import { PRODUCTS, Product, MaterialOption } from './data/products';
import { CartItem } from './utils/pricing';
import {
  OrderRecord,
  ShowroomVisitRecord,
  SwatchRequestRecord,
  AdminAuthSession,
  STORAGE_KEYS,
  loadStoredJson,
  saveStoredJson,
  getAdminSession,
  clearAdminSession,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { HomeEditorialSpotlight } from './components/HomeEditorialSpotlight';
import { BrandValues } from './components/BrandValues';
import { StorePage } from './components/StorePage';
import { ProductQuickView } from './components/ProductQuickView';
import { ProductDetailView } from './components/ProductDetailView';
import { SpatialStudio, PlacedPiece } from './components/SpatialStudio';
import { SpacesLookbook } from './components/SpacesLookbook';
import { CraftJournal } from './components/CraftJournal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SampleKitModal } from './components/SampleKitModal';
import { ShowroomVisitModal } from './components/ShowroomVisitModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';

const DEFAULT_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-init-1',
    productId: 'komorebi-lounge-chair',
    productName: 'Komorebi Lounge Chair',
    basePrice: 44500,
    selectedWoodOption: 'Untreated Natural Oak',
    selectedFabricOption: 'Sand Tactile Bouclé',
    optionExtraPrice: 0,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
  },
];

// Helper to detect if accessing via admin subdomain (e.g. admin.abhifurnituremall.in), /admin route, or ?admin=true
const checkIsAdminContext = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    host.startsWith('admin.') ||
    path.startsWith('/admin') ||
    search.includes('mode=admin') ||
    search.includes('admin=true')
  );
};

export default function App() {
  const isAdminDomain = typeof window !== 'undefined' && checkIsAdminContext();
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'spaces' | 'planner' | 'craft' | 'admin'>(() =>
    checkIsAdminContext() ? 'admin' : 'home'
  );
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSampleKitOpen, setIsSampleKitOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [plannerPreselectedProduct, setPlannerPreselectedProduct] = useState<Product | null>(null);

  // Admin Studio State
  const [adminSession, setAdminSessionState] = useState<AdminAuthSession | null>(() => getAdminSession());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(() =>
    checkIsAdminContext() && !getAdminSession()
  );

  // Live Catalog State (Backed by LocalStorage, defaulting to handcrafted collection)
  const [products, setProducts] = useState<Product[]>(() =>
    loadStoredJson<Product[]>(STORAGE_KEYS.products, PRODUCTS)
  );

  // Persistent Storefront State (ready to swap for backend API + User Dashboard)
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStoredJson<CartItem[]>(STORAGE_KEYS.cart, DEFAULT_CART_ITEMS)
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadStoredJson<string[]>(STORAGE_KEYS.wishlist, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    loadStoredJson<OrderRecord[]>(STORAGE_KEYS.orders, [])
  );
  const [swatchRequests, setSwatchRequests] = useState<SwatchRequestRecord[]>(() =>
    loadStoredJson<SwatchRequestRecord[]>(STORAGE_KEYS.swatches, [])
  );
  const [showroomVisits, setShowroomVisits] = useState<ShowroomVisitRecord[]>(() =>
    loadStoredJson<ShowroomVisitRecord[]>(STORAGE_KEYS.visits, [])
  );

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.cart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.wishlist, wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.swatches, swatchRequests);
  }, [swatchRequests]);

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.visits, showroomVisits);
  }, [showroomVisits]);

  // Admin Product CRUD Actions
  const handleAdminAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleAdminUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedDetailProduct?.id === updatedProduct.id) {
      setSelectedDetailProduct(updatedProduct);
    }
  };

  const handleAdminDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    if (selectedDetailProduct?.id === productId) {
      setSelectedDetailProduct(null);
    }
  };

  const handleAdminResetCatalog = () => {
    setProducts(PRODUCTS);
    saveStoredJson(STORAGE_KEYS.products, PRODUCTS);
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setAdminSessionState(null);
    setActiveTab('catalog');
  };

  const handleOpenAdminTrigger = () => {
    const currentSession = getAdminSession();
    if (currentSession?.isAuthenticated) {
      setAdminSessionState(currentSession);
      setActiveTab('admin');
      setSelectedDetailProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Selected Category for Full-Screen Store View
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const openStoreCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedDetailProduct(null);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Cart actions
  const handleAddToCart = (
    product: Product,
    selectedWood?: MaterialOption,
    selectedFabric?: MaterialOption
  ) => {
    const wood = selectedWood || product.woodOptions[0];
    const fabric = selectedFabric || (product.fabricOptions ? product.fabricOptions[0] : undefined);
    const extraPrice = (wood?.extraPrice || 0) + (fabric?.extraPrice || 0);

    const newItemId = `${product.id}-${wood?.id || 'def'}-${fabric?.id || 'def'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === newItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: newItemId,
          productId: product.id,
          productName: product.name,
          basePrice: product.price,
          selectedWoodOption: wood?.name,
          selectedFabricOption: fabric?.name,
          optionExtraPrice: extraPrice,
          quantity: 1,
          image: product.primaryImage,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddBundleToCart = (placedPieces: PlacedPiece[]) => {
    placedPieces.forEach((piece) => {
      const matchedProd = products.find((p) => p.id === piece.productId);
      if (matchedProd) {
        const newItemId = `${piece.productId}-${piece.woodColor}-${Date.now()}`;
        setCartItems((prev) => [
          ...prev,
          {
            id: newItemId,
            productId: matchedProd.id,
            productName: matchedProd.name,
            basePrice: matchedProd.price,
            selectedWoodOption: 'Custom Spatial Finish',
            optionExtraPrice: 0,
            quantity: 1,
            image: matchedProd.primaryImage,
          },
        ]);
      }
    });
    setIsCartOpen(true);
  };

  const handleOpenPlannerWithProduct = (product: Product) => {
    setPlannerPreselectedProduct(product);
    setSelectedDetailProduct(null);
    setActiveTab('planner');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1C18] flex flex-col font-sans selection:bg-[#9E582C]/20 selection:text-[#804116]">
      {/* Global Architectural Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedDetailProduct(null);
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlistProducts.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSampleKit={() => setIsSampleKitOpen(true)}
        onOpenVisitModal={() => setIsVisitModalOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={Boolean(adminSession?.isAuthenticated)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {selectedDetailProduct ? (
          /* Deep Product Detail Specification View */
          <ProductDetailView
            product={selectedDetailProduct}
            onBack={() => setSelectedDetailProduct(null)}
            onAddToCart={handleAddToCart}
            onOpenPlannerWithProduct={handleOpenPlannerWithProduct}
            onOpenSampleKit={() => setIsSampleKitOpen(true)}
            isWishlisted={wishlistIds.includes(selectedDetailProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : activeTab === 'admin' ? (
          /* Admin Dashboard: Full-Browser Item Management & Lead Viewer */
          adminSession?.isAuthenticated ? (
            <AdminDashboard
              products={products}
              onAddProduct={handleAdminAddProduct}
              onUpdateProduct={handleAdminUpdateProduct}
              onDeleteProduct={handleAdminDeleteProduct}
              onResetDefaultCatalog={handleAdminResetCatalog}
              onPreviewProduct={(p) => {
                setSelectedDetailProduct(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={handleAdminLogout}
              onBackToStore={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              orders={orders}
              swatches={swatchRequests}
              visits={showroomVisits}
            />
          ) : (
            <div className="max-w-md mx-auto py-24 px-4 text-center space-y-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#9E582C]/10 border border-[#9E582C]/20 flex items-center justify-center text-[#9E582C]">
                <span className="font-serif font-bold text-lg">AFH</span>
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#1C1C18]">
                Staff & Studio Authentication
              </h2>
              <p className="text-xs text-[#53433B] leading-relaxed">
                Administrative session is required to manage pieces, modify inventory, or view submitted orders.
              </p>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="py-3 px-8 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#804116] shadow-sm transition-all cursor-pointer"
              >
                Sign In to Admin Studio
              </button>
            </div>
          )
        ) : activeTab === 'spaces' ? (
          /* Lookbook & Spaces with Interactive Hotspot Pins */
          <SpacesLookbook
            products={products}
            onSelectProduct={(p) => setSelectedDetailProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onOpenPlanner={() => setActiveTab('planner')}
          />
        ) : activeTab === 'planner' ? (
          /* Interactive Sanctuary Spatial Studio / 2D Room Planner */
          <SpatialStudio
            products={products}
            onAddBundleToCart={handleAddBundleToCart}
            onViewProduct={(p) => setSelectedDetailProduct(p)}
            preselectedProduct={plannerPreselectedProduct}
          />
        ) : activeTab === 'craft' ? (
          /* Craft, Joinery & Philosophy */
          <CraftJournal
            onExploreCollection={() => openStoreCategory('all')}
            onOpenSampleKit={() => setIsSampleKitOpen(true)}
          />
        ) : activeTab === 'catalog' ? (
          /* Full-Screen Store Page with Left-Hand Filters */
          <StorePage
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onBackHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={(p) => setSelectedDetailProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : (
          /* Landing Page: Full-Screen Carousel, Category Tiles, Spatial Studio, Spotlight & Values */
          <div>
            <Hero
              onExploreCollection={() => openStoreCategory('all')}
              onOpenPlanner={() => setActiveTab('planner')}
              onSelectSpace={() => setActiveTab('spaces')}
              onSelectCategory={(cat) => openStoreCategory(cat)}
            />

            <CategoryShowcase
              activeCategory=""
              onSelectCategory={(cat) => openStoreCategory(cat)}
              products={products}
            />

            {/* Material & Spatial Planner Teaser Banner */}
            <section className="bg-[#F5F1EB] border-y border-[#E7E2DA] py-16">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-8 lg:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9E582C]">
                      Architectural Staging Experience
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1C18]">
                      Stage Your Sanctuary in Spatial Studio
                    </h3>
                    <p className="text-xs sm:text-sm text-[#53433B] leading-relaxed">
                      Calibrate furniture circulation and measure negative space (<em className="italic">విశాల అంతరం</em>) in meters before ordering. Review room bundles with custom timber specifications.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveTab('planner')}
                      className="py-3.5 px-7 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
                    >
                      Launch Spatial Studio
                    </button>
                    <button
                      onClick={() => setIsSampleKitOpen(true)}
                      className="py-3.5 px-6 border border-[#2A2825] text-[#2A2825] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                    >
                      Order Swatches (₹0)
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <HomeEditorialSpotlight
              onSelectCategory={(cat) => openStoreCategory(cat)}
            />

            <BrandValues
              onExploreCraft={() => {
                setActiveTab('craft');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Global Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewFullSpecs={(p) => {
          setSelectedDetailProduct(p);
          setQuickViewProduct(null);
        }}
      />

      {/* Global Slide-out Architectural Archive Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenSampleKit={() => {
          setIsCartOpen(false);
          setIsSampleKitOpen(true);
        }}
        onOrderSubmitted={(order) => setOrders((prev) => [order, ...prev])}
      />

      {/* Saved Wishlist Slide-out Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveItem={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
        onSelectProduct={(p) => setSelectedDetailProduct(p)}
      />

      {/* Free Architectural Swatch Box Modal */}
      <SampleKitModal
        isOpen={isSampleKitOpen}
        onClose={() => setIsSampleKitOpen(false)}
        onSubmitted={(record) => setSwatchRequests((prev) => [record, ...prev])}
      />

      {/* Andhra Pradesh Showroom Visit Booking Modal */}
      <ShowroomVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSubmitted={(visit) => setShowroomVisits((prev) => [visit, ...prev])}
      />

      {/* Admin Studio Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminSessionState(getAdminSession());
          setActiveTab('admin');
          setSelectedDetailProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Architectural Studio Footer */}
      <Footer
        onSelectCategory={(cat) => openStoreCategory(cat)}
        onOpenSampleKit={() => setIsSampleKitOpen(true)}
        onOpenPlanner={() => {
          setActiveTab('planner');
          setSelectedDetailProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVisitModal={() => setIsVisitModalOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />
    </div>
  );
}
