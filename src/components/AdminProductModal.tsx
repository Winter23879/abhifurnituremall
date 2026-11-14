import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Product, MaterialOption } from '../data/products';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

const PRESET_IMAGES = [
  { label: 'Nordic Oak Lounge', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Minimalist Dining Slab', url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Low Platform Bed', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Architect Credenza', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Rice Paper Lantern Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Organic Coffee Table', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Writing Bureau Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Upholstered Daybed', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80' },
];

const DEFAULT_WOOD_OPTIONS: MaterialOption[] = [
  { id: 'w-oak-natural', name: 'Untreated Natural Oak', type: 'wood', hex: '#D6BA96', extraPrice: 0 },
  { id: 'w-oak-smoked', name: 'Smoked Nordic Oak', type: 'wood', hex: '#6D533E', extraPrice: 3500 },
  { id: 'w-walnut-raw', name: 'Raw Black Walnut', type: 'wood', hex: '#4B382A', extraPrice: 7200 },
];

const DEFAULT_FABRIC_OPTIONS: MaterialOption[] = [
  { id: 'f-sand-boucle', name: 'Sand Tactile Bouclé', type: 'fabric', hex: '#EFE7DA', extraPrice: 0 },
  { id: 'f-raw-linen', name: 'Natural Belgian Linen', type: 'fabric', hex: '#DDD4C5', extraPrice: 2400 },
  { id: 'f-charcoal-wool', name: 'Charcoal Merino Wool', type: 'fabric', hex: '#3B3835', extraPrice: 4500 },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [japaneseName, setJapaneseName] = useState('');
  const [category, setCategory] = useState<'living' | 'dining' | 'bedroom' | 'study' | 'lighting'>('living');
  const [price, setPrice] = useState<number>(45000);
  const [badge, setBadge] = useState('Architectural Signature');
  const [width, setWidth] = useState<number>(85);
  const [depth, setDepth] = useState<number>(80);
  const [height, setHeight] = useState<number>(75);
  const [weightKg, setWeightKg] = useState<number>(18);
  const [materialsSummary, setMaterialsSummary] = useState('Solid FSC Certified Oak & Natural Wool');
  const [primaryImage, setPrimaryImage] = useState(PRESET_IMAGES[0].url);
  const [secondaryImage, setSecondaryImage] = useState('');
  const [description, setDescription] = useState('');
  const [architecturalNotes, setArchitecturalNotes] = useState('');
  const [joinery, setJoinery] = useState('Hand-chiseled mortise and tenon joinery; zero visible metal fasteners');
  const [leadTime, setLeadTime] = useState('Made to order in 3–5 weeks');
  const [designer, setDesigner] = useState('Studio Kanso & Sørensen');
  const [featured, setFeatured] = useState(false);

  // Wood & Fabric options list
  const [woodOptions, setWoodOptions] = useState<MaterialOption[]>(DEFAULT_WOOD_OPTIONS);
  const [fabricOptions, setFabricOptions] = useState<MaterialOption[]>(DEFAULT_FABRIC_OPTIONS);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setJapaneseName(productToEdit.japaneseName || '');
      setCategory(
        productToEdit.category === 'all' ? 'living' : (productToEdit.category as any)
      );
      setPrice(productToEdit.price);
      setBadge(productToEdit.badge || '');
      setWidth(productToEdit.dimensions?.width || 80);
      setDepth(productToEdit.dimensions?.depth || 80);
      setHeight(productToEdit.dimensions?.height || 75);
      setWeightKg(productToEdit.weightKg || 15);
      setMaterialsSummary(productToEdit.materialsSummary || '');
      setPrimaryImage(productToEdit.primaryImage || PRESET_IMAGES[0].url);
      setSecondaryImage(productToEdit.secondaryImage || '');
      setDescription(productToEdit.description || '');
      setArchitecturalNotes(productToEdit.architecturalNotes || '');
      setJoinery(productToEdit.joinery || 'Traditional Mortise & Tenon');
      setLeadTime(productToEdit.leadTime || 'Made to order in 4 weeks');
      setDesigner(productToEdit.designer || 'Studio AFH');
      setFeatured(Boolean(productToEdit.featured));
      setWoodOptions(
        productToEdit.woodOptions?.length ? productToEdit.woodOptions : DEFAULT_WOOD_OPTIONS
      );
      setFabricOptions(productToEdit.fabricOptions || []);
    } else {
      // Defaults for brand new piece
      setName('');
      setJapaneseName('');
      setCategory('living');
      setPrice(45000);
      setBadge('New Arrival');
      setWidth(90);
      setDepth(85);
      setHeight(75);
      setWeightKg(20);
      setMaterialsSummary('Solid White Oak & Natural Tactile Bouclé');
      setPrimaryImage(PRESET_IMAGES[0].url);
      setSecondaryImage('');
      setDescription('An architectural sanctuary piece balancing organic timber warmth with restrained Japandi proportions.');
      setArchitecturalNotes('Engineered with low sightline clearance to integrate seamlessly into open residential pavilions.');
      setJoinery('Hand-chiseled mortise and tenon joinery; zero visible metal fasteners');
      setLeadTime('Made to order in 3–5 weeks');
      setDesigner('Studio AFH & Sørensen');
      setFeatured(false);
      setWoodOptions(DEFAULT_WOOD_OPTIONS);
      setFabricOptions(DEFAULT_FABRIC_OPTIONS);
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddWoodOption = () => {
    const newOpt: MaterialOption = {
      id: `w-custom-${Date.now()}`,
      name: 'Custom Timber Finish',
      type: 'wood',
      hex: '#B89B72',
      extraPrice: 3000,
    };
    setWoodOptions([...woodOptions, newOpt]);
  };

  const handleRemoveWoodOption = (idx: number) => {
    setWoodOptions(woodOptions.filter((_, i) => i !== idx));
  };

  const handleAddFabricOption = () => {
    const newOpt: MaterialOption = {
      id: `f-custom-${Date.now()}`,
      name: 'Custom Woven Textile',
      type: 'fabric',
      hex: '#C5BCAC',
      extraPrice: 2000,
    };
    setFabricOptions([...fabricOptions, newOpt]);
  };

  const handleRemoveFabricOption = (idx: number) => {
    setFabricOptions(fabricOptions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!primaryImage.trim()) {
      setError('Primary image URL is required.');
      return;
    }
    if (price <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    const id = productToEdit?.id || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const savedProduct: Product = {
      id,
      name: name.trim(),
      japaneseName: japaneseName.trim() || 'శిల్పకళ',
      category,
      price: Number(price),
      badge: badge.trim() || undefined,
      dimensions: {
        width: Number(width) || 80,
        depth: Number(depth) || 80,
        height: Number(height) || 75,
        unit: 'cm',
      },
      weightKg: Number(weightKg) || 15,
      materialsSummary: materialsSummary.trim() || 'Solid Natural Timber',
      woodOptions: woodOptions.length ? woodOptions : DEFAULT_WOOD_OPTIONS,
      fabricOptions: fabricOptions.length ? fabricOptions : undefined,
      primaryImage: primaryImage.trim(),
      secondaryImage: secondaryImage.trim() || primaryImage.trim(),
      gallery: [primaryImage.trim(), secondaryImage.trim()].filter(Boolean),
      description: description.trim() || 'Handcrafted architectural furniture piece by Abhi Furniture Mall.',
      architecturalNotes: architecturalNotes.trim() || 'Designed for organic harmony and architectural balance.',
      joinery: joinery.trim() || 'Traditional hand-chiseled joinery',
      leadTime: leadTime.trim() || 'Made to order in 3–5 weeks',
      designer: designer.trim() || 'Studio AFH',
      rating: productToEdit?.rating || 5.0,
      reviewCount: productToEdit?.reviewCount || 1,
      featured,
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[6px] max-w-3xl w-full my-8 p-6 sm:p-8 shadow-2xl relative text-[#1C1C18] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#86736A] hover:text-[#1C1C18] p-1.5 rounded-full hover:bg-[#F5F1EB] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#E7E2DA] pb-4 mb-6">
          <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#9E582C]">
            {isEditing ? 'Catalog Revision' : 'New Piece Commission'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18]">
            {isEditing ? `Edit "${productToEdit?.name}"` : 'Add Architectural Piece to Catalog'}
          </h2>
          <p className="text-xs text-[#53433B] mt-1">
            All additions and modifications are saved instantly into the live browser database.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-[4px] bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-semibold text-[#1C1C18] border-b border-[#E7E2DA] pb-1 uppercase tracking-wider">
              1. Identity & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Komorebi Lounge Chair"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Telugu / Subtitle Script
                </label>
                <input
                  type="text"
                  value={japaneseName}
                  onChange={(e) => setJapaneseName(e.target.value)}
                  placeholder="e.g. ఆకుచాటు వెలుగు or Minimalist Armchair"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                >
                  <option value="living">Living Room</option>
                  <option value="dining">Dining Room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="study">Study & Office</option>
                  <option value="lighting">Lighting & Lamps</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Base Price (₹ INR) *
                </label>
                <input
                  type="number"
                  min="500"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Badge / Editorial Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Architectural Signature, New Arrival"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Designer / Studio
                </label>
                <input
                  type="text"
                  value={designer}
                  onChange={(e) => setDesigner(e.target.value)}
                  placeholder="e.g. Studio AFH & Sørensen"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                  Lead Time
                </label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  placeholder="e.g. Made to order in 3–5 weeks"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#9E582C] focus:ring-[#9E582C] border-[#E7E2DA]"
              />
              <label htmlFor="featured-check" className="text-xs font-semibold text-[#1C1C18] cursor-pointer">
                Feature on Homepage Hero & Curated Highlights
              </label>
            </div>
          </div>

          {/* Section 2: Media & Images */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-sm font-semibold text-[#1C1C18] border-b border-[#E7E2DA] pb-1 uppercase tracking-wider">
              2. Photography & Imagery
            </h3>

            <div>
              <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                Primary Image URL *
              </label>
              <input
                type="url"
                required
                value={primaryImage}
                onChange={(e) => setPrimaryImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1C1C18] uppercase tracking-wider mb-1">
                Secondary Angle Image URL
              </label>
              <input
                type="url"
                value={secondaryImage}
                onChange={(e) => setSecondaryImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C]"
              />
            </div>

            {/* Quick Preset Selector */}
            <div>
              <span className="text-[11px] font-semibold text-[#804116] flex items-center space-x-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
                <span>Or select from curated architectural imagery presets:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrimaryImage(preset.url);
                      if (!secondaryImage) setSecondaryImage(preset.url);
                    }}
                    className={`p-2 text-left rounded-[4px] border transition-all cursor-pointer flex flex-col items-center text-center ${
                      primaryImage === preset.url
                        ? 'border-[#9E582C] bg-[#9E582C]/5 font-semibold text-[#9E582C]'
                        : 'border-[#E7E2DA] bg-[#FBF9F5] hover:border-[#D4A373]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-14 object-cover rounded-[2px] mb-1.5"
                    />
                    <span className="text-[10px] line-clamp-1">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Dimensions & Craftsmanship */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif text-sm font-semibold text-[#1C1C18] border-b border-[#E7E2DA] pb-1 uppercase tracking-wider">
              3. Architectural Dimensions & Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Width (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Depth (cm)</label>
                <input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Joinery Method</label>
                <input
                  type="text"
                  value={joinery}
                  onChange={(e) => setJoinery(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase mb-1">Materials Summary</label>
                <input
                  type="text"
                  value={materialsSummary}
                  onChange={(e) => setMaterialsSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase mb-1">Architectural Spatial Notes</label>
              <textarea
                rows={2}
                value={architecturalNotes}
                onChange={(e) => setArchitecturalNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px]"
              />
            </div>
          </div>

          {/* Section 4: Material Options */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-1">
              <h3 className="font-serif text-sm font-semibold text-[#1C1C18] uppercase tracking-wider">
                4. Wood & Finish Options ({woodOptions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddWoodOption}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#9E582C] hover:text-[#804116] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Timber Option</span>
              </button>
            </div>

            <div className="space-y-2">
              {woodOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#FBF9F5] p-2 rounded-[4px] border border-[#E7E2DA]">
                  <input
                    type="color"
                    value={opt.hex}
                    onChange={(e) => {
                      const updated = [...woodOptions];
                      updated[idx].hex = e.target.value;
                      setWoodOptions(updated);
                    }}
                    className="w-7 h-7 rounded border border-[#E7E2DA] cursor-pointer p-0 shrink-0"
                    title="Choose finish swatch color"
                  />
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => {
                      const updated = [...woodOptions];
                      updated[idx].name = e.target.value;
                      setWoodOptions(updated);
                    }}
                    placeholder="Finish name"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[3px]"
                  />
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[#86736A]">+₹</span>
                    <input
                      type="number"
                      value={opt.extraPrice}
                      onChange={(e) => {
                        const updated = [...woodOptions];
                        updated[idx].extraPrice = Number(e.target.value);
                        setWoodOptions(updated);
                      }}
                      className="w-20 px-2 py-1.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[3px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveWoodOption(idx)}
                    className="text-[#86736A] hover:text-[#9B1C1C] p-1.5 cursor-pointer"
                    title="Delete finish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Fabric Options */}
            <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-1 pt-2">
              <h3 className="font-serif text-sm font-semibold text-[#1C1C18] uppercase tracking-wider">
                Fabric / Textile Options ({fabricOptions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddFabricOption}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#9E582C] hover:text-[#804116] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Fabric Option</span>
              </button>
            </div>

            <div className="space-y-2">
              {fabricOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#FBF9F5] p-2 rounded-[4px] border border-[#E7E2DA]">
                  <input
                    type="color"
                    value={opt.hex}
                    onChange={(e) => {
                      const updated = [...fabricOptions];
                      updated[idx].hex = e.target.value;
                      setFabricOptions(updated);
                    }}
                    className="w-7 h-7 rounded border border-[#E7E2DA] cursor-pointer p-0 shrink-0"
                    title="Choose textile swatch color"
                  />
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => {
                      const updated = [...fabricOptions];
                      updated[idx].name = e.target.value;
                      setFabricOptions(updated);
                    }}
                    placeholder="Textile name"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[3px]"
                  />
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[#86736A]">+₹</span>
                    <input
                      type="number"
                      value={opt.extraPrice}
                      onChange={(e) => {
                        const updated = [...fabricOptions];
                        updated[idx].extraPrice = Number(e.target.value);
                        setFabricOptions(updated);
                      }}
                      className="w-20 px-2 py-1.5 text-xs bg-[#FFFFFF] border border-[#E7E2DA] rounded-[3px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFabricOption(idx)}
                    className="text-[#86736A] hover:text-[#9B1C1C] p-1.5 cursor-pointer"
                    title="Delete textile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-[#E7E2DA] pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-[#53433B] hover:text-[#1C1C18] border border-[#E7E2DA] rounded-[4px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-[#FFFFFF] rounded-[4px] shadow-sm transition-all cursor-pointer flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Revisions' : 'Publish to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

