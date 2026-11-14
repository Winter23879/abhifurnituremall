import React, { useState, useMemo } from 'react';
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
  MessageCircle,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
  ArrowUpRight,
  Inbox,
  Palette,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Product, PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import {
  OrderRecord,
  SwatchRequestRecord,
  ShowroomVisitRecord,
  ChatInquiryRecord,
} from '../utils/storage';
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
  chatInquiries?: ChatInquiryRecord[];
}

type TabType = 'analytics' | 'catalog' | 'new-items' | 'bookings';

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
  chatInquiries = [],
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [salesTimeframe, setSalesTimeframe] = useState<'monthly' | 'weekly'>('monthly');
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'orders' | 'visits' | 'swatches' | 'chat'>('all');

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

  // Identify newly added / custom pieces (not in the default catalog)
  const defaultProductIds = useMemo(() => new Set(DEFAULT_PRODUCTS.map((p) => p.id)), []);
  const customNewlyAddedPieces = useMemo(
    () => products.filter((p) => !defaultProductIds.has(p.id) || p.badge?.toLowerCase().includes('new')),
    [products, defaultProductIds]
  );

  // Filtered products list for Master Catalog
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

  // Calculate Sales & Analytics Data
  const orderTotalSum = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  // Realistic base sales baseline combined with real live orders
  const baseDemonstrationRevenue = 1845000;
  const totalRevenueNumber = baseDemonstrationRevenue + orderTotalSum;
  const totalOrdersCount = 28 + orders.length;
  const averageOrderValue = Math.round(totalRevenueNumber / totalOrdersCount);
  const avgPrice = Math.round(
    products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1)
  );

  // Graph Data (Monthly and Weekly distribution)
  const monthlySalesData = [
    { label: 'Jun', amount: 145000, height: '35%' },
    { label: 'Jul', amount: 210000, height: '48%' },
    { label: 'Aug', amount: 280000, height: '62%' },
    { label: 'Sep', amount: 340000, height: '75%' },
    { label: 'Oct', amount: 410000, height: '88%' },
    { label: 'Nov', amount: 495000 + orderTotalSum, height: '100%', current: true },
  ];

  const weeklySalesData = [
    { label: 'Week 1', amount: 85000, height: '55%' },
    { label: 'Week 2', amount: 120000, height: '75%' },
    { label: 'Week 3', amount: 142000, height: '88%' },
    { label: 'Week 4 (Current)', amount: 148000 + orderTotalSum, height: '100%', current: true },
  ];

  const activeGraphData = salesTimeframe === 'monthly' ? monthlySalesData : weeklySalesData;

  // Category Revenue Share
  const categoryRevenueStats = [
    { name: 'Living Sanctuary', percentage: 44, value: '₹8,12,000', color: 'bg-[#9E582C]' },
    { name: 'Nordic Dining', percentage: 28, value: '₹5,16,000', color: 'bg-[#D4A373]' },
    { name: 'Bedroom Suites', percentage: 16, value: '₹2,95,000', color: 'bg-[#2A2825]' },
    { name: 'Architectural Study', percentage: 8, value: '₹1,47,000', color: 'bg-[#804116]' },
    { name: 'Wabi-Sabi Lighting', percentage: 4, value: '₹75,000', color: 'bg-[#A39281]' },
  ];

  // Actions
  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    const copyId = `${p.id}-custom-${Date.now().toString().slice(-4)}`;
    const copyProd: Product = {
      ...p,
      id: copyId,
      name: `${p.name} (Custom Studio Edition)`,
      badge: 'Custom Piece',
      featured: false,
    };
    onAddProduct(copyProd);
    showNotification(`Duplicated "${p.name}" into newly added pieces.`);
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
    downloadAnchor.setAttribute('download', `afm-catalog-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Catalog JSON exported successfully.');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1C18] scroll-smooth pb-28 font-sans selection:bg-[#9E582C]/20 selection:text-[#804116]">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#2A2825]/95 backdrop-blur-md text-[#F5F1EB] px-4 sm:px-6 lg:px-12 py-3 flex flex-wrap justify-between items-center border-b border-[#3B3835] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#9E582C] text-[#FFFFFF] flex items-center justify-center font-serif font-bold text-xs shadow-xs">
            AFM
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs uppercase tracking-wider text-white">
                Abhi Furniture Mall
              </span>
              <span className="text-[10px] bg-[#9E582C]/40 text-[#D4A373] px-2 py-0.5 rounded-full font-mono border border-[#9E582C]">
                Studio Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center space-x-1.5 text-[#D4A373] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
          <span className="text-[#55504A]">|</span>
          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-1 text-[#CBC6C1] hover:text-[#FF8B8B] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Wrapper */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        {/* Title Bar & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E582C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Command Center</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1C18] mt-1">
              Store & Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#53433B] mt-1">
              Visual analytics, inventory revisions, custom newly added pieces, and customer bookings in one unified interface.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#53433B] hover:text-[#1C1C18] bg-white border border-[#E7E2DA] rounded-[4px] hover:border-[#D4A373] shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#86736A]" />
              <span>Export Catalog</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#804116] hover:text-red-700 bg-white border border-[#E7E2DA] rounded-[4px] hover:border-red-300 shadow-2xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-white rounded-[4px] shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Piece</span>
            </button>
          </div>
        </div>

        {/* Action Notice Toast */}
        {actionSuccessNotice && (
          <div className="p-3.5 rounded-[4px] bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionSuccessNotice}</span>
          </div>
        )}

        {/* Modern Graphical Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E7E2DA] pb-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#1C1C18] text-white shadow-sm'
                : 'bg-white text-[#53433B] border border-[#E7E2DA] hover:bg-[#F5F1EB]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Sales & Visual Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#1C1C18] text-white shadow-sm'
                : 'bg-white text-[#53433B] border border-[#E7E2DA] hover:bg-[#F5F1EB]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>All Catalog Items ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new-items')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'new-items'
                ? 'bg-[#9E582C] text-white shadow-sm'
                : 'bg-white text-[#804116] border border-[#D4A373]/60 hover:bg-[#F5F1EB]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Newly Added Items ({customNewlyAddedPieces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#1C1C18] text-white shadow-sm'
                : 'bg-white text-[#53433B] border border-[#E7E2DA] hover:bg-[#F5F1EB]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>
              Orders & Bookings ({orders.length + visits.length + swatches.length + chatInquiries.length})
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: SALES & GRAPHICAL ANALYTICS                       */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 4 Graphical Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#86736A]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Commission Revenue</span>
                  <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-2">
                  {formatPrice(totalRevenueNumber)}
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% growth this quarter</span>
                </div>
              </div>

              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#86736A]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Total Commission Orders</span>
                  <div className="p-2 rounded-full bg-amber-50 text-[#9E582C]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-2">
                  {totalOrdersCount}
                </div>
                <div className="text-xs text-[#53433B] mt-2">
                  {orders.length} submitted directly in browser
                </div>
              </div>

              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#86736A]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Average Order Value</span>
                  <div className="p-2 rounded-full bg-stone-100 text-[#1C1C18]">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-2">
                  {formatPrice(averageOrderValue)}
                </div>
                <div className="text-xs text-[#86736A] mt-2">
                  Solid timber architectural pieces
                </div>
              </div>

              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-5 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between text-[#86736A]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Customer Inquiries & Leads</span>
                  <div className="p-2 rounded-full bg-emerald-50 text-[#25D366]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-medium text-[#1C1C18] mt-2">
                  {swatches.length + visits.length + chatInquiries.length}
                </div>
                <div className="text-xs text-[#53433B] mt-2">
                  {visits.length} showroom visits · {chatInquiries.length} WhatsApp chats
                </div>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Interactive Bar Chart */}
              <div className="lg:col-span-2 bg-white border border-[#E7E2DA] rounded-[8px] p-6 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E2DA] pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                      Revenue Velocity & Trajectory
                    </h3>
                    <p className="text-xs text-[#53433B]">
                      Gross commission volume in Indian Rupees (₹) across months.
                    </p>
                  </div>

                  <div className="flex items-center bg-[#F5F1EB] p-1 rounded-[6px] border border-[#E7E2DA] text-xs">
                    <button
                      onClick={() => setSalesTimeframe('monthly')}
                      className={`px-3 py-1 rounded-[4px] font-semibold transition-all cursor-pointer ${
                        salesTimeframe === 'monthly'
                          ? 'bg-white text-[#1C1C18] shadow-2xs'
                          : 'text-[#86736A] hover:text-[#1C1C18]'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setSalesTimeframe('weekly')}
                      className={`px-3 py-1 rounded-[4px] font-semibold transition-all cursor-pointer ${
                        salesTimeframe === 'weekly'
                          ? 'bg-white text-[#1C1C18] shadow-2xs'
                          : 'text-[#86736A] hover:text-[#1C1C18]'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div className="space-y-2">
                  <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E7E2DA]">
                    {activeGraphData.map((bar, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2A2825] text-white text-[11px] font-mono py-1 px-2 rounded-[4px] pointer-events-none whitespace-nowrap z-10 shadow-md">
                          {formatPrice(bar.amount)}
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: bar.height }}
                          className={`w-full max-w-[48px] rounded-t-[4px] transition-all duration-500 ${
                            bar.current
                              ? 'bg-gradient-to-t from-[#804116] to-[#D4A373] shadow-sm'
                              : 'bg-[#E7E2DA] hover:bg-[#D4A373]'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Graph Labels */}
                  <div className="flex justify-between px-2 text-xs font-medium text-[#86736A]">
                    {activeGraphData.map((bar, idx) => (
                      <span key={idx} className="flex-1 text-center truncate">
                        {bar.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FBF9F5] p-3.5 rounded-[6px] border border-[#E7E2DA] text-xs text-[#53433B] flex items-center justify-between">
                  <span>Peak commission volume: <strong>November (Current)</strong></span>
                  <span className="text-[#804116] font-semibold font-mono">
                    Average per piece: {formatPrice(avgPrice)}
                  </span>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-6 shadow-2xs space-y-5">
                <div className="border-b border-[#E7E2DA] pb-3">
                  <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                    Category Distribution
                  </h3>
                  <p className="text-xs text-[#53433B]">
                    Revenue share by furniture category.
                  </p>
                </div>

                <div className="space-y-4">
                  {categoryRevenueStats.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#1C1C18]">{cat.name}</span>
                        <span className="text-[#86736A] font-mono">{cat.value} ({cat.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-[#F5F1EB] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cat.percentage}%` }}
                          className={`h-full ${cat.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E7E2DA] text-xs text-[#53433B] leading-relaxed">
                  Living & Dining suites represent <strong>72%</strong> of store turnover, led by the Komorebi Lounge Chair and Sora Table.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MASTER CATALOG (ALL PRODUCTS)                    */}
        {/* ======================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#86736A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces, dimensions, materials..."
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
                        ? 'bg-[#2A2825] text-white'
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
                    viewMode === 'table' ? 'bg-white text-[#9E582C] shadow-2xs' : 'text-[#86736A]'
                  }`}
                  title="Table view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-[#9E582C] shadow-2xs' : 'text-[#86736A]'
                  }`}
                  title="Grid view"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' ? (
              <div className="bg-white border border-[#E7E2DA] rounded-[8px] overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F5F1EB] border-b border-[#E7E2DA] text-[#53433B] uppercase font-semibold tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Piece</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Base Price</th>
                        <th className="py-3.5 px-4">Dimensions</th>
                        <th className="py-3.5 px-4">Finishes</th>
                        <th className="py-3.5 px-4">Status</th>
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
                        filteredProducts.map((p) => {
                          const isCustom = !defaultProductIds.has(p.id);
                          return (
                            <tr key={p.id} className="hover:bg-[#FBF9F5] transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={p.primaryImage}
                                    alt={p.name}
                                    className="w-12 h-12 object-cover rounded-[3px] border border-[#E7E2DA] shrink-0"
                                  />
                                  <div>
                                    <div className="font-serif font-semibold text-sm text-[#1C1C18] line-clamp-1 flex items-center space-x-1.5">
                                      <span>{p.name}</span>
                                      {isCustom && (
                                        <span className="text-[9px] bg-amber-100 text-[#804116] px-1.5 py-0.2 rounded font-sans font-bold">
                                          CUSTOM
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-[#86736A] font-mono">
                                      ID: {p.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="uppercase text-[11px] font-semibold text-[#804116] bg-[#9E582C]/10 px-2.5 py-1 rounded-[3px]">
                                  {p.category}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono font-medium text-[#1C1C18]">
                                {formatPrice(p.price)}
                              </td>

                              <td className="py-3 px-4 text-[#53433B] font-mono text-[11px]">
                                {p.dimensions.width} × {p.dimensions.depth} × {p.dimensions.height} cm
                              </td>

                              <td className="py-3 px-4">
                                <div className="text-[11px] text-[#53433B]">
                                  <div>{p.woodOptions?.length || 0} Woods</div>
                                  <div className="text-[#86736A]">{p.fabricOptions?.length || 0} Fabrics</div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {p.badge && (
                                  <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-[#1C1C18] bg-[#E7E2DA] px-2 py-0.5 rounded-[3px]">
                                    {p.badge}
                                  </span>
                                )}
                              </td>

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
                                    className="p-1.5 text-[#804116] hover:text-white hover:bg-[#9E582C] rounded-[3px] transition-colors cursor-pointer"
                                    title="Edit Item Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingProductId(p.id)}
                                    className="p-1.5 text-[#86736A] hover:text-white hover:bg-red-700 rounded-[3px] transition-colors cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                    className="bg-white border border-[#E7E2DA] rounded-[8px] overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 overflow-hidden bg-[#F5F1EB]">
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {p.badge && (
                          <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[2px] bg-white/90 backdrop-blur-xs text-[#1C1C18]">
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
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#9E582C] text-white rounded-[3px] font-semibold cursor-pointer hover:bg-[#804116]"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-1.5 text-[#86736A] hover:text-red-700 cursor-pointer"
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

        {/* ======================================================== */}
        {/* TAB 3: NEWLY ADDED ITEMS (CUSTOM PIECES)                 */}
        {/* ======================================================== */}
        {activeTab === 'new-items' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#804116] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#9E582C]" />
                  <span>Custom Studio Pieces & Recent Commissions</span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1C18] mt-1">
                  Newly Added Items ({customNewlyAddedPieces.length})
                </h3>
                <p className="text-xs text-[#53433B] mt-1 max-w-xl">
                  These items were created directly in your browser session. They are immediately live in the catalog, 2D room planner, and checkout.
                </p>
              </div>

              <button
                onClick={handleOpenNewModal}
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-white rounded-[4px] shadow-sm transition-all cursor-pointer self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Commission New Piece</span>
              </button>
            </div>

            {customNewlyAddedPieces.length === 0 ? (
              <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-12 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-[#9E582C] flex items-center justify-center">
                  <Package className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl font-medium text-[#1C1C18]">
                  No custom pieces added yet
                </h4>
                <p className="text-xs text-[#53433B] max-w-md mx-auto">
                  You are currently using the default collection of 12 handcrafted pieces. Click below to add your first custom piece to the store!
                </p>
                <button
                  onClick={handleOpenNewModal}
                  className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-white rounded-[4px] shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Custom Piece</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customNewlyAddedPieces.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border-2 border-[#D4A373]/60 rounded-[8px] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 overflow-hidden bg-[#F5F1EB]">
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[2px] bg-[#9E582C] text-white shadow-sm">
                          {p.badge || 'New Piece'}
                        </span>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="uppercase font-semibold text-[#804116] tracking-wider">
                            {p.category}
                          </span>
                          <span className="font-mono font-bold text-sm text-[#1C1C18]">
                            {formatPrice(p.price)}
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-medium text-[#1C1C18]">
                          {p.name}
                        </h4>

                        <p className="text-xs text-[#53433B] line-clamp-2">
                          {p.description}
                        </p>

                        <div className="pt-3 border-t border-[#E7E2DA] flex justify-between text-[11px] font-mono text-[#86736A]">
                          <span>{p.dimensions.width}×{p.dimensions.depth}×{p.dimensions.height} cm</span>
                          <span>{p.weightKg} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#FBF9F5] border-t border-[#E7E2DA] flex items-center justify-between text-xs">
                      <button
                        onClick={() => onPreviewProduct(p)}
                        className="inline-flex items-center space-x-1 text-[#1C1C18] hover:text-[#9E582C] font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Live</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-3 py-1.5 bg-[#9E582C] hover:bg-[#804116] text-white rounded-[3px] font-semibold cursor-pointer"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
                          className="p-1.5 text-[#86736A] hover:text-red-700 cursor-pointer"
                          title="Delete piece"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ORDERS & BOOKINGS (CENTRAL LEADS HUB)              */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Pills */}
            <div className="bg-white border border-[#E7E2DA] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLeadsFilter('all')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    leadsFilter === 'all'
                      ? 'bg-[#1C1C18] text-white'
                      : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                  }`}
                >
                  All Inquiries ({orders.length + visits.length + swatches.length + chatInquiries.length})
                </button>

                <button
                  onClick={() => setLeadsFilter('orders')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    leadsFilter === 'orders'
                      ? 'bg-[#1C1C18] text-white'
                      : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                  }`}
                >
                  Store Orders ({orders.length})
                </button>

                <button
                  onClick={() => setLeadsFilter('visits')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    leadsFilter === 'visits'
                      ? 'bg-[#1C1C18] text-white'
                      : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                  }`}
                >
                  Showroom Visits ({visits.length})
                </button>

                <button
                  onClick={() => setLeadsFilter('swatches')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    leadsFilter === 'swatches'
                      ? 'bg-[#1C1C18] text-white'
                      : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                  }`}
                >
                  Swatch Requests ({swatches.length})
                </button>

                <button
                  onClick={() => setLeadsFilter('chat')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    leadsFilter === 'chat'
                      ? 'bg-[#25D366] text-white'
                      : 'bg-[#F5F1EB] text-[#53433B] hover:bg-[#E7E2DA]'
                  }`}
                >
                  WhatsApp Chats ({chatInquiries.length})
                </button>
              </div>

              <span className="text-xs text-[#86736A] font-medium">
                Live client interactions across Andhra Pradesh
              </span>
            </div>

            {/* Inquiries Stream */}
            <div className="space-y-4">
              {/* 1. Store Orders */}
              {(leadsFilter === 'all' || leadsFilter === 'orders') && (
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-semibold text-[#1C1C18] flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-[#9E582C]" />
                    <span>Store Orders Placed ({orders.length})</span>
                  </h4>

                  {orders.length === 0 ? (
                    <div className="bg-white border border-[#E7E2DA] rounded-[6px] p-6 text-center text-xs text-[#86736A] italic">
                      No customer orders submitted yet.
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-[6px] border border-[#E7E2DA] bg-white shadow-2xs space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E2DA] pb-2">
                          <span className="font-mono font-semibold text-[#804116]">
                            Order #{ord.id} · {new Date(ord.createdAt).toLocaleString()}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-[3px] bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            {ord.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="font-semibold text-sm text-[#1C1C18]">{ord.clientName}</div>
                            <div className="text-[#53433B]">{ord.clientEmail} · {ord.clientPhone}</div>
                            <div className="text-[#86736A]">{ord.clientCity}, PIN: {ord.clientPinCode}</div>
                          </div>

                          <div className="sm:text-right">
                            <div className="font-mono text-base font-bold text-[#1C1C18]">
                              {formatPrice(ord.total)}
                            </div>
                            <div className="text-[11px] text-[#86736A]">
                              Subtotal: {formatPrice(ord.subtotal)} | GST: {formatPrice(ord.gst)}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E7E2DA] text-[#53433B]">
                          <span className="font-semibold text-[#1C1C18]">Items:</span>
                          <ul className="list-disc list-inside mt-1">
                            {ord.items.map((it, idx) => (
                              <li key={idx}>
                                {it.quantity}× {it.productName} ({it.selectedWoodOption || 'Standard'}) — {formatPrice(it.basePrice + it.optionExtraPrice)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 2. Showroom Bookings */}
              {(leadsFilter === 'all' || leadsFilter === 'visits') && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif text-base font-semibold text-[#1C1C18] flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#9E582C]" />
                    <span>Showroom Visit Bookings ({visits.length})</span>
                  </h4>

                  {visits.length === 0 ? (
                    <div className="bg-white border border-[#E7E2DA] rounded-[6px] p-6 text-center text-xs text-[#86736A] italic">
                      No showroom visits booked yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visits.map((vi) => (
                        <div
                          key={vi.id}
                          className="p-4 rounded-[6px] border border-[#E7E2DA] bg-white shadow-2xs text-xs space-y-2"
                        >
                          <div className="flex justify-between items-center border-b border-[#E7E2DA] pb-2">
                            <span className="font-semibold text-[#804116] uppercase tracking-wider flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{vi.showroom}</span>
                            </span>
                            <span className="text-[#86736A] text-[10px]">
                              {new Date(vi.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="font-semibold text-sm text-[#1C1C18]">
                            {vi.name}
                          </div>
                          <div className="text-[#53433B]">
                            📅 <strong>{vi.visitDate}</strong> at <strong>{vi.timeSlot}</strong>
                          </div>
                          <div className="text-[#86736A]">
                            Contact: {vi.phone} · {vi.email}
                          </div>
                          {vi.notes && <p className="text-[#86736A] italic pt-1">"{vi.notes}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Swatch Requests */}
              {(leadsFilter === 'all' || leadsFilter === 'swatches') && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif text-base font-semibold text-[#1C1C18] flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-[#9E582C]" />
                    <span>Material Swatch Kit Requests ({swatches.length})</span>
                  </h4>

                  {swatches.length === 0 ? (
                    <div className="bg-white border border-[#E7E2DA] rounded-[6px] p-6 text-center text-xs text-[#86736A] italic">
                      No swatch sample requests yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {swatches.map((sw) => (
                        <div
                          key={sw.id}
                          className="p-4 rounded-[6px] border border-[#E7E2DA] bg-white shadow-2xs text-xs space-y-2"
                        >
                          <div className="flex justify-between font-semibold border-b border-[#E7E2DA] pb-1.5">
                            <span>{sw.name}</span>
                            <span className="text-[#86736A] text-[10px]">
                              {new Date(sw.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-[#53433B]">{sw.email} · {sw.phone}</div>
                          <div className="text-[#86736A]">{sw.address}, PIN: {sw.pinCode}</div>
                          <div className="pt-1">
                            <span className="font-semibold text-[#804116]">Finishes Requested:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sw.selectedMaterials.map((mat, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#F5F1EB] border border-[#E7E2DA] rounded text-[10px]">
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

              {/* 4. WhatsApp Inquiries */}
              {(leadsFilter === 'all' || leadsFilter === 'chat') && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif text-base font-semibold text-[#1C1C18] flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Showroom Desk Messages ({chatInquiries.length})</span>
                  </h4>

                  {chatInquiries.length === 0 ? (
                    <div className="bg-white border border-[#E7E2DA] rounded-[6px] p-6 text-center text-xs text-[#86736A] italic">
                      No WhatsApp concierge messages yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-[6px] border border-[#E7E2DA] bg-white shadow-2xs space-y-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E2DA] pb-2">
                            <span className="font-semibold text-sm text-[#1C1C18]">{inq.clientName}</span>
                            <span className="text-[#86736A] text-[10px]">
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="p-3 bg-[#FBF9F5] rounded border border-[#E7E2DA] text-[#1C1C18] italic">
                            "{inq.message}"
                          </div>

                          <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                            <div className="text-[#53433B]">
                              Contact: <strong className="text-[#1C1C18]">{inq.clientContact}</strong>
                            </div>

                            <a
                              href={`https://wa.me/${inq.clientContact.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Reply on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
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
          <div className="bg-white border border-[#E7E2DA] rounded-[8px] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-red-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-[#1C1C18]">Delete Product?</h3>
            </div>
            <p className="text-[#53433B]">
              Are you sure you want to delete this piece? It will be removed immediately from the live storefront and spatial studio.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2 px-4 rounded border border-[#E7E2DA] text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 rounded bg-red-700 hover:bg-red-800 text-white font-semibold cursor-pointer"
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
          <div className="bg-white border border-[#E7E2DA] rounded-[8px] max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-[#804116]">
              <RotateCcw className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-semibold text-[#1C1C18]">Reset Catalog?</h3>
            </div>
            <p className="text-[#53433B]">
              This will reset the entire product catalog back to the original handcrafted collection (12 default items).
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2 px-4 rounded border border-[#E7E2DA] text-[#53433B] hover:text-[#1C1C18] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="py-2 px-4 rounded bg-[#9E582C] hover:bg-[#804116] text-white font-semibold cursor-pointer"
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
