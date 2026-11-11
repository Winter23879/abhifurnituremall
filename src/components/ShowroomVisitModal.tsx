import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { ShowroomVisitRecord } from '../utils/storage';

interface ShowroomVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (visit: ShowroomVisitRecord) => void;
}

const SHOWROOMS = [
  'Vijayawada Flagship Showroom · MG Road, Benz Circle',
  'Visakhapatnam Coastal Studio · Beach Road, Siripuram',
  'Tirupati Design Hall · Air Bypass Road, Karakambadi',
];

const TIME_SLOTS = [
  '10:30 AM – 12:00 PM',
  '12:30 PM – 02:30 PM',
  '04:00 PM – 06:00 PM',
  '06:30 PM – 08:00 PM',
];

export const ShowroomVisitModal: React.FC<ShowroomVisitModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [showroom, setShowroom] = useState(SHOWROOMS[0]);
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedVisit, setSubmittedVisit] = useState<ShowroomVisitRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !visitDate) return;

    const record: ShowroomVisitRecord = {
      id: `AFH-VST-${(Date.now() % 100000).toString().padStart(5, '0')}`,
      createdAt: new Date().toISOString(),
      showroom,
      visitDate,
      timeSlot,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    };
    onSubmitted?.(record);
    setSubmittedVisit(record);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#2A2825]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-[#FFFFFF] border border-[#E7E2DA] rounded-[4px] max-w-lg w-full p-6 sm:p-8 shadow-[0_12px_36px_-8px_rgba(42,40,37,0.15)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close showroom booking modal"
          className="absolute top-4 right-4 p-2 rounded-[4px] hover:bg-[#F5F1EB] text-[#2A2825] border border-[#E7E2DA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedVisit ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#E7E1DD] text-[#804116] flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#1C1C18]">
              Showroom Visit Confirmed
            </h3>
            <p className="text-xs text-[#53433B] leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-[#1C1C18]">{submittedVisit.name}</strong>. Our specialist at <strong className="text-[#1C1C18]">{submittedVisit.showroom.split('·')[0].trim()}</strong> will welcome you on <strong className="text-[#1C1C18]">{submittedVisit.visitDate}</strong> ({submittedVisit.timeSlot}).
            </p>
            <div className="p-3 bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-xs font-mono text-[#53433B]">
              Booking Ref: {submittedVisit.id}
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmittedVisit(null);
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
                <MapPin className="w-3.5 h-3.5 text-[#9E582C]" />
                <span>Andhra Pradesh Showrooms</span>
              </div>
              <h2 id="visit-modal-title" className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1C18]">
                Book a Showroom Consultation
              </h2>
              <p className="text-xs text-[#53433B] mt-1">
                Experience solid timber finishes, cane joinery, and spatial layout consultations in person.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                Select Showroom *
              </label>
              <select
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
              >
                {SHOWROOMS.map((sr) => (
                  <option key={sr} value={sr}>
                    {sr}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                  Preferred Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                  Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Srinivasulu Naidu"
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.in"
                className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A2825] mb-1">
                Pieces or Room Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Living room sofa & dining table consultation"
                className="w-full p-2.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] text-[#2A2825] focus:outline-none focus:border-[#9E582C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#9E582C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#2A2825] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm Showroom Appointment</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

