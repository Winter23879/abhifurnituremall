import React, { useState } from 'react';
import { X, Check, Sparkles, PackageCheck } from 'lucide-react';
import { SwatchRequestRecord } from '../utils/storage';

interface SampleKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (record: SwatchRequestRecord) => void;
}

export const SampleKitModal: React.FC<SampleKitModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [submittedRecord, setSubmittedRecord] = useState<SwatchRequestRecord | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [selectedWoods, setSelectedWoods] = useState<string[]>([
    'Natural White Oak',
    'Japanese Hinoki Cypress',
    'Tactile Sand Bouclé',
  ]);

  if (!isOpen) return null;

  const toggleMaterial = (item: string) => {
    if (selectedWoods.includes(item)) {
      if (selectedWoods.length > 1) {
        setSelectedWoods(selectedWoods.filter((w) => w !== item));
      }
    } else {
      setSelectedWoods([...selectedWoods, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !pinCode.trim() || !address.trim()) return;

    const record: SwatchRequestRecord = {
      id: `AFH-SWT-${(Date.now() % 100000).toString().padStart(5, '0')}`,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      pinCode: pinCode.trim(),
      address: address.trim(),
      selectedMaterials: selectedWoods,
    };
    onSubmitted?.(record);
    setSubmittedRecord(record);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swatch-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#2A2825]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] max-w-xl w-full p-6 sm:p-8 shadow-[0_12px_36px_-8px_rgba(42,40,37,0.15)] animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close swatch modal"
          className="absolute top-4 right-4 p-2 rounded-[4px] hover:bg-[#F5F1EB] text-[#2A2825] border border-[#E7E2DA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRecord ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#1C1C18]">
              Tactile Swatch Kit Dispatched
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed max-w-md mx-auto">
              Your personalized Abhi Furniture Hall material box has been scheduled for preparation at our Vijayawada workshop and will ship to <strong className="text-[#1C1C18]">{submittedRecord.address} ({submittedRecord.pinCode})</strong>.
            </p>
            <div className="p-3 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-xs font-mono text-[#53433B] space-y-1">
              <div>Ref: {submittedRecord.id}</div>
              <div>Selected Samples: {submittedRecord.selectedMaterials.join(', ')}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmittedRecord(null);
                onClose();
              }}
              className="py-3 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#804116] uppercase tracking-[0.06em] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#9E582C]" />
                <span>Complimentary Architectural Material Box</span>
              </div>
              <h2 id="swatch-title" className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18]">
                Experience The Tactile Grain
              </h2>
              <p className="text-xs text-[#53433B] mt-1 leading-relaxed">
                Order solid timber blocks, tactile bouclé weaves, and honed stone samples directly to your home or practice across Andhra Pradesh and India—complimentary with no obligations.
              </p>
            </div>

            {/* Material Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825]">
                Select Samples for Your Box:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Natural White Oak',
                  'Smoked Nordic Oak',
                  'Japanese Hinoki Cypress',
                  'Tactile Sand Bouclé',
                  'Natural Belgian Linen',
                  'Honed Roman Travertine',
                ].map((mat) => {
                  const isChecked = selectedWoods.includes(mat);
                  return (
                    <button
                      type="button"
                      key={mat}
                      onClick={() => toggleMaterial(mat)}
                      className={`p-2.5 rounded-[4px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#9E582C] bg-[#F5F1EB] text-[#1C1C18] font-medium'
                          : 'border-[#E7E2DA] bg-[#FBF9F5] text-[#53433B]'
                      }`}
                    >
                      <span className="truncate">{mat}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#9E582C] flex-shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                  Recipient Name / Studio *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raghavendra Rao or Amaravati Architects"
                  className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.in"
                    className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9+\-\s]{10,15}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="520010"
                    className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                    Delivery Street, Area & City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="MG Road, Benz Circle, Vijayawada, AP"
                    className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors cursor-pointer"
              >
                Dispatch Swatch Box (₹0 Complimentary)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
