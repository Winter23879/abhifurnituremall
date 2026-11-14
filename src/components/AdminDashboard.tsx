import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Copy,
  RotateCcw,
  Download,
  LogOut,
  Eye,
  Search,
  Filter,
  Package,
  Layers,
  ShoppingBag,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Grid as GridIcon,
  List as ListIcon,
  Tag,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../data/products';
import { OrderRecord, SwatchRequestRecord, ShowroomVisitRecord } from '../utils/storage';
import { formatPrice } from '../utils/pricing';
import { AdminProductModal } from './AdminProductModal';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefaultCatalog: () => void;
  onPreviewProduct: (prod: Product) => void;
  onLogout: () => void;
  onBackToStore: () => void;
  orders: OrderRecord[];
  swatches: SwatchRequestRecord[];
  visits: ShowroomVisitRecord[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaultCatalog,
  onPreviewProduct,
  onLogout,
  onBackToStore,
  orders,
  swatches,
  visits,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'swatches' | 'visits'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Confirmation Modals
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.materialsSummary && p.materialsSummary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Key metrics
  const totalProducts = products.length;
  const avgPrice = Math.round(
    products.reduce((acc, p) => acc + p.price, 0) / (totalProducts || 1)
  );
  const featuredCount = products.filter((p) => p.featured).length;

  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    const copyId = `${p.id}-copy-${Date.now().toString().slice(-4)}`;
    const copyProd: Product = {
      ...p,
      id: copyId,
      name: `${p.name} (Commission Copy)`,
      badge: 'Commission Copy',
      featured: false,
    };
    onAddProduct(copyProd);
    showNotification(`Duplicated "${p.name}" into a new piece.`);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      const prod = products.find((p) => p.id === deletingProductId);
      onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
      showNotification(`Deleted "${prod?.name || 'Item'}" from the catalog.`);
    }
  };

  const confirmReset = () => {
    onResetDefaultCatalog();
    setIsResetConfirmOpen(false);
    showNotification('Catalog restored to default handcrafted collection.');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `afh-catalog-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Catalog exported to JSON file.');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1C18] pb-24">
      {/* Top Banner Notice */}
      <div className="bg-[#2A2825] text-[#F5F1EB] px-4 py-2.5 text-xs flex flex-wrap justify-between items-center tracking-wider border-b border-[#3B3835]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
          <span className="font-semibold uppercase">Admin Studio Portal</span>
          <span className="text-[#86736A]">|</span>
          <span className="text-[#CBC6C1]">In-Browser Management Mode</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center space-x-1.5 text-[#D4A373] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
          <span className="text-[#55504A]">|</span>
          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-1 text-[#CBC6C1] hover:text-[#FF8B8B] transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9E582C]">
              <Package className="w-3.5 h-3.5" />
              <span>Studio Master Catalog & Lead Management</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18] mt-1">
              Store Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[#53433B] mt-1">
              Add new architectural pieces, update dimensions and prices, delete discontinued items, or view customer orders directly in the browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#53433B] hover:text-[#1C1C18] bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] hover:border-[#D4A373] shadow-2xs transition-all cursor-pointer"
              title="Download entire catalog as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#86736A]" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#804116] hover:text-[#9B1C1C] bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] hover:border-[#F8B4B4] shadow-2xs transition-all cursor-pointer"
              title="Restore original default collection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>

            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-[#FFFFFF] rounded-[4px] shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Piece</span>
            </button>
          </div>
        </div>

        {/* Success Notice Toast */}
        {actionSuccessNotice && (
          <div className="p-3.5 rounded-[4px] bg-[#F2FBF5] border border-[#B7E4C7] text-[#1B4332] text-xs flex items-center space-x-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <span className="font-medium">{actionSuccessNotice}</span>
          </div>
        )}

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86736A]">Total Pieces in Store</span>
            <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-1">{totalProducts}</div>
            <div className="text-[11px] text-[#804116] mt-1">{featuredCount} highlighted on home</div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86736A]">Average Commission Value</span>
            <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-1">{formatPrice(avgPrice)}</div>
            <div className="text-[11px] text-[#53433B] mt-1">Across 5 design categories</div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86736A]">Customer Orders</span>
            <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-1">{orders.length}</div>
            <div className="text-[11px] text-[#2D6A4F] mt-1">
              ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')} booked
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86736A]">Swatches & Visits</span>
            <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-1">
              {swatches.length + visits.length}
            </div>
            <div className="text-[11px] text-[#53433B] mt-1">
              {swatches.length} swatch kits · {visits.length} showroom visits
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E7E2DA] space-x-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-[#9E582C] text-[#9E582C]'
                : 'border-transparent text-[#86736A] hover:text-[#1C1C18]'
            }`}
          >
            Products & Inventory ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#9E582C] text-[#9E582C]'
                : 'border-transparent text-[#86736A] hover:text-[#1C1C18]'
            }`}
          >
            Orders Placed ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('swatches')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'swatches'
                ? 'border-[#9E582C] text-[#9E582C]'
                : 'border-transparent text-[#86736A] hover:text-[#1C1C18]'
            }`}
          >
            Material Kit Requests ({swatches.length})
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'visits'
                ? 'border-[#9E582C] text-[#9E582C]'
                : 'border-transparent text-[#86736A] hover:text-[#1C1C18]'
            }`}
          >
            Showroom Bookings ({visits.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#86736A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces by name, designer, materials..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {['all', 'living', 'dining', 'bedroom', 'study', 'lighting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs rounded-[3px] uppercase font-semibold tracking-wider transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#2A2825] text-[#FFFFFF]'
                        : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Switcher */}
              <div className="flex items-center space-x-1 border border-[#E7E2DA] p-0.5 rounded-[4px] bg-[#FBF9F5]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-[#FFFFFF] text-[#9E582C] shadow-2xs' : 'text-[#86736A]'
                  }`}
                  title="Table view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#FFFFFF] text-[#9E582C] shadow-2xs' : 'text-[#86736A]'
                  }`}
                  title="Grid view"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Table View */}
            {viewMode === 'table' ? (
              <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F5F1EB] border-b border-[#E7E2DA] text-[#53433B] uppercase font-semibold tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Piece</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Base Price</th>
                        <th className="py-3.5 px-4">Dimensions</th>
                        <th className="py-3.5 px-4">Finishes</th>
                        <th className="py-3.5 px-4">Status / Badge</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA]">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#86736A] italic">
                            No pieces found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FBF9F5] transition-colors">
                            {/* Item Photo & Title */}
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={p.primaryImage}
                                  alt={p.name}
                                  className="w-12 h-12 object-cover rounded-[3px] border border-[#E7E2DA] shrink-0"
                                />
                                <div>
                                  <div className="font-serif font-semibold text-sm text-[#1C1C18] line-clamp-1">
                                    {p.name}
                                  </div>
                                  <div className="text-[11px] text-[#86736A] font-mono">
                                    ID: {p.id} · {p.japaneseName}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="uppercase text-[11px] font-semibold text-[#804116] bg-[#9E582C]/10 px-2.5 py-1 rounded-[3px]">
                                {p.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 font-mono font-medium text-[#1C1C18]">
                              {formatPrice(p.price)}
                            </td>

                            {/* Dimensions */}
                            <td className="py-3 px-4 text-[#53433B] font-mono text-[11px]">
                              {p.dimensions.width} × {p.dimensions.depth} × {p.dimensions.height} cm
                            </td>

                            {/* Finishes */}
                            <td className="py-3 px-4">
                              <div className="text-[11px] text-[#53433B]">
                                <div>{p.woodOptions?.length || 0} Woods</div>
                                <div className="text-[#86736A]">{p.fabricOptions?.length || 0} Fabrics</div>
                              </div>
                            </td>

                            {/* Badge */}
                            <td className="py-3 px-4">
                              {p.badge && (
                                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-[#1C1C18] bg-[#E7E2DA] px-2 py-0.5 rounded-[3px]">
                                  {p.badge}
                                </span>
                              )}
                              {p.featured && (
                                <span className="ml-1 inline-block text-[10px] font-semibold tracking-wider uppercase text-[#804116] bg-[#D4A373]/30 px-2 py-0.5 rounded-[3px]">
                                  Featured
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center space-x-1.5">
                                <button
                                  onClick={() => onPreviewProduct(p)}
                                  className="p-1.5 text-[#53433B] hover:text-[#1C1C18] hover:bg-[#E7E2DA] rounded-[3px] transition-colors cursor-pointer"
                                  title="Preview in Storefront"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(p)}
                                  className="p-1.5 text-[#53433B] hover:text-[#1C1C18] hover:bg-[#E7E2DA] rounded-[3px] transition-colors cursor-pointer"
                                  title="Duplicate Item"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 text-[#804116] hover:text-[#FFFFFF] hover:bg-[#9E582C] rounded-[3px] transition-colors cursor-pointer"
                                  title="Edit Item Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingProductId(p.id)}
                                  className="p-1.5 text-[#86736A] hover:text-[#FFFFFF] hover:bg-[#9B1C1C] rounded-[3px] transition-colors cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 overflow-hidden bg-[#F5F1EB]">
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {p.badge && (
                          <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[2px] bg-[#FFFFFF]/90 backdrop-blur-xs text-[#1C1C18]">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-semibold text-[#804116] tracking-wider">
                            {p.category}
                          </span>
                          <span className="font-mono font-medium text-sm text-[#1C1C18]">
                            {formatPrice(p.price)}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-semibold text-[#1C1C18] line-clamp-1">
                          {p.name}
                        </h3>

                        <p className="text-xs text-[#53433B] line-clamp-2">
                          {p.description}
                        </p>

                        <div className="pt-2 text-[11px] text-[#86736A] font-mono border-t border-[#E7E2DA] flex justify-between">
                          <span>{p.dimensions.width}×{p.dimensions.depth}×{p.dimensions.height} cm</span>
                          <span>{p.weightKg} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FBF9F5] border-t border-[#E7E2DA] flex items-center justify-between text-xs">
                      <button
                        onClick={() => onPreviewProduct(p)}
                        className="inline-flex items-center space-x-1 text-[#53433B] hover:text-[#1C1C18] font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#9E582C] text-[#FFFFFF] rounded-[3px] font-semibold cursor-pointer hover:bg-[#804116]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-1.5 text-[#86736A] hover:text-[#9B1C1C] cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Submitted Store Orders ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <p className="text-xs text-[#86736A] py-8 text-center italic">
                No orders have been submitted through the checkout yet. Place an order in the Store to test!
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-[4px] border border-[#E7E2DA] bg-[#FBF9F5] space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E2DA] pb-2">
                      <div>
                        <span className="font-mono font-semibold text-[#804116]">Order #{ord.id}</span>
                        <span className="text-[#86736A] ml-2">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-[3px] bg-[#2D6A4F]/10 text-[#2D6A4F] font-bold uppercase tracking-wider text-[10px]">
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-[#1C1C18]">{ord.clientName}</div>
                        <div className="text-[#53433B]">{ord.clientEmail} · {ord.clientPhone}</div>
                        <div className="text-[#86736A]">
                          {ord.clientCity}, PIN: {ord.clientPinCode}
                        </div>
                      </div>

                      <div className="text-right sm:text-right">
                        <div className="font-mono text-sm font-bold text-[#1C1C18]">
                          Total: {formatPrice(ord.total)}
                        </div>
                        <div className="text-[#86736A] text-[11px]">
                          Subtotal: {formatPrice(ord.subtotal)} | GST: {formatPrice(ord.gst)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E7E2DA]">
                      <span className="font-semibold text-[#1C1C18] block mb-1">Items Commissioned:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[#53433B]">
                        {ord.items.map((it, idx) => (
                          <li key={idx}>
                            {it.quantity}× {it.productName} ({it.selectedWoodOption || 'Standard'} / {it.selectedFabricOption || 'Standard'}) — {formatPrice(it.basePrice + it.optionExtraPrice)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MATERIAL SWATCH REQUESTS */}
        {activeTab === 'swatches' && (
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Material Swatch Kit Requests ({swatches.length})
            </h3>
            {swatches.length === 0 ? (
              <p className="text-xs text-[#86736A] py-8 text-center italic">
                No swatch kit requests yet. Clients can request free samples via the top navigation bar.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {swatches.map((sw) => (
                  <div key={sw.id} className="p-4 rounded-[4px] border border-[#E7E2DA] bg-[#FBF9F5] text-xs space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>{sw.name}</span>
                      <span className="text-[#86736A] text-[10px]">
                        {new Date(sw.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[#53433B]">{sw.email} · {sw.phone}</div>
                    <div className="text-[#86736A]">{sw.address}, PIN: {sw.pinCode}</div>
                    <div className="pt-1">
                      <span className="font-semibold text-[#804116]">Requested Finishes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sw.selectedMaterials.map((mat, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#E7E2DA] rounded-[2px] text-[10px]">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHOWROOM VISIT BOOKINGS */}
        {activeTab === 'visits' && (
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
              Showroom Consultation Bookings ({visits.length})
            </h3>
            {visits.length === 0 ? (
              <p className="text-xs text-[#86736A] py-8 text-center italic">
                No showroom visits booked yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visits.map((vi) => (
                  <div key={vi.id} className="p-4 rounded-[4px] border border-[#E7E2DA] bg-[#FBF9F5] text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#804116] uppercase tracking-wider">
                        {vi.showroom}
                      </span>
                      <span className="text-[#86736A] text-[10px]">
                        Booked: {new Date(vi.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-medium text-[#1C1C18]">
                      Date: {vi.visitDate} at {vi.timeSlot}
                    </div>
                    <div className="text-[#53433B]">
                      {vi.name} ({vi.phone} · {vi.email})
                    </div>
                    {vi.notes && <p className="text-[#86736A] italic">"{vi.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal (Add / Edit) */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
        onSave={(savedProduct) => {
          if (editingProduct) {
            onUpdateProduct(savedProduct);
            showNotification(`Updated "${savedProduct.name}".`);
          } else {
            onAddProduct(savedProduct);
            showNotification(`Added "${savedProduct.name}" to the live catalog.`);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[6px] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-[#9B1C1C]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-[#1C1C18]">Delete Product?</h3>
            </div>
            <p className="text-[#53433B]">
              Are you sure you want to delete this piece? It will be removed immediately from the live storefront and spatial studio.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2 px-4 rounded-[4px] border border-[#E7E2DA] text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 rounded-[4px] bg-[#9B1C1C] hover:bg-[#771D1D] text-[#FFFFFF] font-semibold cursor-pointer"
              >
                Delete Piece
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[6px] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-[#804116]">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-[#1C1C18]">Reset Catalog?</h3>
            </div>
            <p className="text-[#53433B]">
              This will reset the entire product catalog back to the original handcrafted collection (12 default items). Any custom added items will be replaced.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2 px-4 rounded-[4px] border border-[#E7E2DA] text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="py-2 px-4 rounded-[4px] bg-[#9E582C] hover:bg-[#804116] text-[#FFFFFF] font-semibold cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

