import React, { useState } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { calculateRoomSpatialLoad, formatPrice } from '../utils/pricing';
import {
  RotateCw,
  Trash2,
  Plus,
  Maximize2,
  Sparkles,
  ShoppingBag,
  Sliders,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';

export interface PlacedPiece {
  instanceId: string;
  productId: string;
  name: string;
  widthCm: number;
  depthCm: number;
  xPercent: number; // 0 to 100 within room
  yPercent: number;
  rotation: 0 | 90 | 180 | 270;
  woodColor: string;
  price: number;
}

interface SpatialStudioProps {
  onAddBundleToCart: (items: PlacedPiece[]) => void;
  onViewProduct: (product: Product) => void;
  preselectedProduct?: Product | null;
  products?: Product[];
}

const ROOM_TEMPLATES = [
  { id: 'living', name: 'Living Sanctuary', widthM: 5.2, lengthM: 4.2, description: 'Open-plan social and contemplative retreat' },
  { id: 'tea', name: 'Engawa Tea Salon', widthM: 3.6, lengthM: 3.6, description: 'Traditional wabi-sabi room with low furniture lines' },
  { id: 'dining', name: 'Nordic Dining Atelier', widthM: 6.0, lengthM: 4.2, description: 'Airy pavilion space for communal gatherings' },
  { id: 'bedroom', name: 'Serenity Bedroom', widthM: 4.5, lengthM: 4.0, description: 'Restful sleeping chamber with floating platform' },
];

export const SpatialStudio: React.FC<SpatialStudioProps> = ({
  onAddBundleToCart,
  onViewProduct,
  preselectedProduct,
  products = PRODUCTS,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('living');
  const [roomWidth, setRoomWidth] = useState(5.2);
  const [roomLength, setRoomLength] = useState(4.2);

  // Default pre-seeded furniture items for Living Sanctuary
  const [placedItems, setPlacedItems] = useState<PlacedPiece[]>([
    {
      instanceId: 'item-init-1',
      productId: 'kumo-modular-sectional',
      name: 'Kumo Modular Sectional',
      widthCm: 290,
      depthCm: 105,
      xPercent: 48,
      yPercent: 32,
      rotation: 0,
      woodColor: '#D6BA96',
      price: 4100,
    },
    {
      instanceId: 'item-init-2',
      productId: 'yugen-travertine-coffee-table',
      name: 'Yūgen Travertine Table',
      widthCm: 120,
      depthCm: 75,
      xPercent: 50,
      yPercent: 62,
      rotation: 0,
      woodColor: '#E7E2DA',
      price: 1650,
    },
    {
      instanceId: 'item-init-3',
      productId: 'komorebi-lounge-chair',
      name: 'Komorebi Lounge Chair',
      widthCm: 86,
      depthCm: 82,
      xPercent: 22,
      yPercent: 65,
      rotation: 90,
      woodColor: '#D6BA96',
      price: 1480,
    },
    {
      instanceId: 'item-init-4',
      productId: 'tsuki-washi-pendant',
      name: 'Tsuki Washi Pendant',
      widthCm: 55,
      depthCm: 55,
      xPercent: 78,
      yPercent: 70,
      rotation: 0,
      woodColor: '#8B6A45',
      price: 680,
    },
  ]);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(0);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  // Calculate live spatial load with tested utility
  const spatialMetrics = calculateRoomSpatialLoad(
    roomWidth,
    roomLength,
    placedItems.map((item) => ({ widthCm: item.widthCm, depthCm: item.depthCm }))
  );

  const totalBundlePrice = placedItems.reduce((acc, item) => acc + item.price, 0);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = ROOM_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setRoomWidth(tmpl.widthM);
      setRoomLength(tmpl.lengthM);
    }
  };

  const handleAddItem = (prod: Product) => {
    const newItem: PlacedPiece = {
      instanceId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: prod.id,
      name: prod.name,
      widthCm: prod.dimensions.width,
      depthCm: prod.dimensions.depth,
      xPercent: 50,
      yPercent: 50,
      rotation: 0,
      woodColor: prod.woodOptions[0]?.hex || '#D6BA96',
      price: prod.price,
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedItemIndex(placedItems.length);
  };

  const handleRotateSelected = () => {
    if (selectedItemIndex === null) return;
    setPlacedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== selectedItemIndex) return item;
        const rotations: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];
        const currentIdx = rotations.indexOf(item.rotation);
        const nextRotation = rotations[(currentIdx + 1) % 4];
        return { ...item, rotation: nextRotation };
      })
    );
  };

  const handleRemoveSelected = () => {
    if (selectedItemIndex === null) return;
    setPlacedItems((prev) => prev.filter((_, idx) => idx !== selectedItemIndex));
    setSelectedItemIndex(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on canvas background, clear selection or move selected
    const target = e.target as HTMLElement;
    if (target.getAttribute('data-canvas-bg') && selectedItemIndex !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;

      // Clamped
      const clampedX = Math.min(85, Math.max(15, clickX));
      const clampedY = Math.min(85, Math.max(15, clickY));

      setPlacedItems((prev) =>
        prev.map((item, idx) =>
          idx === selectedItemIndex
            ? { ...item, xPercent: Math.round(clampedX), yPercent: Math.round(clampedY) }
            : item
        )
      );
    }
  };

  const handleAddBundle = () => {
    onAddBundleToCart(placedItems);
    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 3000);
  };

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-8 lg:py-12 border-b border-[#E7E2DA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E7E2DA] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#804116] uppercase tracking-[0.06em] mb-2">
              <Compass className="w-3.5 h-3.5 text-[#9E582C]" />
              <span>Interactive 2D Room Planner</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C18] font-medium tracking-tight">
              Interactive Room Planner
            </h1>
            <p className="text-sm text-[#53433B] mt-1 max-w-2xl">
              Arrange furniture to scale in your room dimensions. Measure floor clearance, doorways, and circulation space before ordering.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setPlacedItems([])}
              className="text-xs uppercase tracking-wider text-[#53433B] hover:text-[#BA1A1A] py-2.5 px-3 border border-[#E7E2DA] rounded-[4px] hover:border-[#BA1A1A]/40 transition-colors bg-[#FFFFFF] cursor-pointer"
            >
              Reset Canvas
            </button>
            <button
              onClick={handleAddBundle}
              disabled={placedItems.length === 0}
              className="py-2.5 sm:py-3 px-4 sm:px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-[0.06em] rounded-[4px] hover:bg-[#2A2825] disabled:opacity-50 transition-colors shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="truncate">Add Bundle ({formatPrice(totalBundlePrice)})</span>
            </button>
          </div>
        </div>

        {isBundleAdded && (
          <div className="p-4 bg-[#E7E1DD] text-[#331200] border border-[#D9C2B7] rounded-[4px] text-xs flex items-center justify-between animate-fadeIn">
            <span className="font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#804116]" />
              <span>All {placedItems.length} architectural pieces from this sanctuary plan have been added to your Archive Bag.</span>
            </span>
          </div>
        )}

        {/* Room Presets & Dimension Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ROOM_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl.id)}
              className={`p-4 rounded-[4px] border text-left transition-all ${
                selectedTemplate === tmpl.id
                  ? 'border-[#9E582C] bg-[#FFFFFF] shadow-sm ring-1 ring-[#9E582C]'
                  : 'border-[#E7E2DA] bg-[#F5F1EB]/50 hover:bg-[#FFFFFF]'
              }`}
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-serif text-base font-semibold text-[#1C1C18]">
                  {tmpl.name}
                </span>
                <span className="font-mono text-xs text-[#804116] font-medium">
                  {tmpl.widthM}m × {tmpl.lengthM}m
                </span>
              </div>
              <p className="text-xs text-[#53433B] line-clamp-1">{tmpl.description}</p>
            </button>
          ))}
        </div>

        {/* Studio Workspace: Canvas & Live Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 2D Architectural Floorplan Grid (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-[#53433B]">
              <div className="flex items-center space-x-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9E582C]"></span>
                <span>Active Plan: {roomWidth}m × {roomLength}m ({spatialMetrics.roomAreaM2} m²)</span>
              </div>
              <span className="text-[#86736A] hidden sm:inline">
                Click canvas to reposition selected piece · Scale: 1 grid unit = 0.5m
              </span>
            </div>

            {/* Interactive Grid Canvas */}
            <div
              data-canvas-bg="true"
              onClick={handleCanvasClick}
              className="relative w-full aspect-[4/3] bg-[#FAF8F5] border-2 border-dashed border-[#DDD9D4] rounded-[4px] overflow-hidden select-none cursor-crosshair shadow-inner"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #EFECE6 1px, transparent 1px),
                  linear-gradient(to bottom, #EFECE6 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }}
            >
              {/* Compass North Indicator */}
              <div className="absolute top-3 right-3 text-[10px] font-mono font-semibold text-[#86736A] bg-[#FFFFFF]/90 px-2 py-0.5 border border-[#E7E2DA] rounded-[2px] pointer-events-none">
                NORTH ↑
              </div>

              {/* Architectural Dimensions labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#86736A] pointer-events-none">
                ↔ {roomWidth} meters
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-[#86736A] pointer-events-none">
                ↔ {roomLength} meters
              </div>

              {/* Placed Furniture Elements */}
              {placedItems.map((item, idx) => {
                const isSelected = selectedItemIndex === idx;
                // Scale physical dimensions to visual representation
                const visualWidthPercent = Math.max(10, Math.min(45, (item.widthCm / (roomWidth * 100)) * 100));
                const visualDepthPercent = Math.max(10, Math.min(35, (item.depthCm / (roomLength * 100)) * 100));

                const isRotated = item.rotation === 90 || item.rotation === 270;
                const renderW = isRotated ? visualDepthPercent : visualWidthPercent;
                const renderH = isRotated ? visualWidthPercent : visualDepthPercent;

                return (
                  <div
                    key={item.instanceId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItemIndex(idx);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[3px] p-2 flex flex-col justify-between transition-shadow cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'border-2 border-[#9E582C] ring-2 ring-[#9E582C]/20 shadow-lg z-20'
                        : 'border border-[#2A2825]/40 hover:border-[#9E582C] shadow-sm z-10'
                    }`}
                    style={{
                      left: `${item.xPercent}%`,
                      top: `${item.yPercent}%`,
                      width: `${renderW}%`,
                      height: `${renderH}%`,
                      backgroundColor: isSelected ? '#FFFFFF' : '#F5F1EB',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-serif font-semibold text-[#1C1C18] leading-tight truncate">
                        {item.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-[#DDD9D4] flex-shrink-0 ml-1"
                        style={{ backgroundColor: item.woodColor }}
                      />
                    </div>

                    <div className="flex justify-between items-end text-[9px] font-mono text-[#86736A] pt-1">
                      <span>{item.widthCm}×{item.depthCm}</span>
                      <span className="font-semibold text-[#804116]">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Item Control Bar */}
            {selectedItemIndex !== null && placedItems[selectedItemIndex] && (
              <div className="flex flex-wrap items-center justify-between p-3 bg-[#F5F1EB] rounded-[4px] border border-[#E7E2DA] text-xs gap-3">
                <div className="flex items-center space-x-3">
                  <span className="font-serif font-semibold text-[#1C1C18]">
                    Selected: {placedItems[selectedItemIndex].name}
                  </span>
                  <span className="text-xs font-mono text-[#86736A]">
                    ({placedItems[selectedItemIndex].widthCm} × {placedItems[selectedItemIndex].depthCm} cm)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRotateSelected}
                    aria-label="Rotate piece 90 degrees"
                    className="py-1.5 px-3 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] hover:border-[#9E582C] text-[#2A2825] flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#9E582C]" />
                    <span>Rotate 90° ({placedItems[selectedItemIndex].rotation}°)</span>
                  </button>

                  <button
                    onClick={handleRemoveSelected}
                    aria-label="Remove piece from floorplan"
                    className="py-1.5 px-3 bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] hover:border-[#BA1A1A] text-[#BA1A1A] flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Spatial Meter & Furniture Catalog Dock (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Spatial Harmony & Negative Space (Ma) Card */}
            <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-3">
                <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                  Room Space & Flow Analysis
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    spatialMetrics.spatialRating === 'optimal-zen'
                      ? 'bg-[#E7E1DD] text-[#804116]'
                      : spatialMetrics.spatialRating === 'harmonious'
                      ? 'bg-[#E4DFDA] text-[#65625E]'
                      : 'bg-[#FFDAD6] text-[#93000A]'
                  }`}
                >
                  {spatialMetrics.spatialRating.replace('-', ' ')}
                </span>
              </div>

              {/* Progress bar representing negative space proportion */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#53433B]">Furniture Footprint Density</span>
                  <span className="font-mono font-semibold text-[#1C1C18]">
                    {spatialMetrics.occupationPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F5F1EB] rounded-full overflow-hidden border border-[#E7E2DA]">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      spatialMetrics.occupationPercentage <= 35
                        ? 'bg-[#9E582C]'
                        : spatialMetrics.occupationPercentage <= 50
                        ? 'bg-[#D4A373]'
                        : 'bg-[#BA1A1A]'
                    }`}
                    style={{ width: `${Math.min(100, spatialMetrics.occupationPercentage)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
                <div className="bg-[#FBF9F5] p-2.5 rounded-[4px] border border-[#E7E2DA]">
                  <span className="block text-[10px] text-[#86736A] uppercase">Total Area</span>
                  <span className="font-mono font-semibold text-sm text-[#1C1C18]">
                    {spatialMetrics.roomAreaM2} m²
                  </span>
                </div>
                <div className="bg-[#FBF9F5] p-2.5 rounded-[4px] border border-[#E7E2DA]">
                  <span className="block text-[10px] text-[#86736A] uppercase">Furniture Footprint</span>
                  <span className="font-mono font-semibold text-sm text-[#1C1C18]">
                    {spatialMetrics.footprintM2} m²
                  </span>
                </div>
              </div>

              {/* Architectural Zen Guidance advice */}
              <div className="p-3 bg-[#F5F1EB] rounded-[4px] border border-[#E7E2DA] flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-[#9E582C] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#53433B] leading-relaxed">
                  {spatialMetrics.zenGuidance}
                </p>
              </div>
            </div>

            {/* Furniture Dock: Add Pieces onto Floorplan */}
            <div className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-3">
                <h3 className="font-serif text-lg font-medium text-[#1C1C18]">
                  Architectural Catalog Dock
                </h3>
                <span className="text-xs text-[#86736A]">Click (+) to place</span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-[4px] border border-[#E7E2DA] bg-[#FBF9F5] hover:bg-[#FFFFFF] hover:border-[#D4A373] transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.primaryImage}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-[2px] border border-[#E7E2DA]"
                      />
                      <div>
                        <h4 className="font-serif text-xs font-semibold text-[#1C1C18] line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="text-[10px] text-[#86736A] font-mono">
                          {prod.dimensions.width}×{prod.dimensions.depth} cm · {formatPrice(prod.price)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddItem(prod)}
                      aria-label={`Place ${prod.name} onto spatial grid`}
                      className="p-2 bg-[#9E582C] text-[#FBF9F5] rounded-[4px] hover:bg-[#2A2825] transition-colors"
                      title="Place in Room"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
