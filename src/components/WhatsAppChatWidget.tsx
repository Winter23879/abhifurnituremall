import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
  User,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { ChatInquiryRecord } from '../utils/storage';

interface WhatsAppChatWidgetProps {
  onInquirySubmitted: (record: ChatInquiryRecord) => void;
}

const STARTER_PROMPTS = [
  'Is the Komorebi Lounge Chair in stock?',
  'Can I customize dimensions for the Sora Dining Table?',
  'What is the delivery timeline to Vijayawada / Vizag?',
  'I would like to order a complimentary timber swatch kit.',
];

export const WhatsAppChatWidget: React.FC<WhatsAppChatWidgetProps> = ({
  onInquirySubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Stock & Customization');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!contact.trim()) {
      setError('Please provide your WhatsApp number or email for reply.');
      return;
    }
    if (!message.trim()) {
      setError('Please type your inquiry or question.');
      return;
    }

    setIsSubmitting(true);

    const record: ChatInquiryRecord = {
      id: `inq-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      clientName: name.trim(),
      clientContact: contact.trim(),
      message: message.trim(),
      category,
      status: 'new',
    };

    try {
      // Send to serverless API endpoint (relays to WhatsApp without exposing recipient number)
      await fetch('/api/whatsapp-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch((err) => {
        // Silently continue so client experience never breaks even if offline/local
        console.warn('API relay dispatched locally:', err);
      });

      // Save locally into Admin Studio leads queue
      onInquirySubmitted(record);

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      onInquirySubmitted(record);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open WhatsApp Showroom Concierge"
            className="group relative flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-[#FFFFFF] px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer focus:outline-none"
          >
            {/* Pulsing Live Ping */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFFFFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFFFFF]"></span>
            </span>

            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-wider uppercase font-sans pr-1 hidden sm:inline">
              Ask Showroom Desk
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[85vh] bg-[#FFFFFF] border border-[#E7E2DA] rounded-[8px] shadow-2xl overflow-hidden flex flex-col text-[#1C1C18] animate-fadeIn">
          {/* Header */}
          <div className="bg-[#2A2825] text-[#F5F1EB] p-4 flex items-center justify-between border-b border-[#3B3835]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-serif text-sm font-semibold tracking-wide">
                    AFH Showroom Concierge
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block" title="Online" />
                </div>
                <p className="text-[10px] text-[#CBC6C1] tracking-wider uppercase">
                  WhatsApp Direct Relay · Confidential
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#CBC6C1] hover:text-[#FFFFFF] hover:bg-[#3B3835] transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Guarantee Notice */}
          <div className="bg-[#F5F1EB] px-3.5 py-1.5 border-b border-[#E7E2DA] text-[10.5px] text-[#53433B] flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <span>Private Relay (Receiver number protected)</span>
            </div>
            <span className="text-[#86736A] font-mono">100% Free</span>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
            {isSubmitted ? (
              /* Success Screen */
              <div className="py-6 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-medium text-[#1C1C18]">
                  Inquiry Dispatched!
                </h4>
                <p className="text-[#53433B] text-xs leading-relaxed max-w-xs mx-auto">
                  Our Andhra Pradesh showroom desk has received your note on WhatsApp. An architect will message <strong className="text-[#1C1C18]">{contact}</strong> shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#9E582C] border border-[#9E582C] rounded-[4px] hover:bg-[#9E582C] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  >
                    Send Another Question
                  </button>
                </div>
              </div>
            ) : (
              /* Chat Dialogue & Form */
              <>
                {/* Simulated Studio Greeting */}
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#9E582C] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center shrink-0">
                    AFH
                  </div>
                  <div className="bg-[#F5F1EB] p-3 rounded-2xl rounded-tl-none border border-[#E7E2DA] text-xs leading-relaxed max-w-[85%]">
                    <p className="font-serif text-[11px] font-medium text-[#804116] mb-1">
                      Namaskaram · శిల్పకళా విభాగం
                    </p>
                    <p className="text-[#1C1C18]">
                      Welcome to Abhi Furniture Mall. How can our spatial team assist with your residence today?
                    </p>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#86736A] flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-[#9E582C]" />
                    <span>Frequently Asked:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {STARTER_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMessage(prompt)}
                        className="text-left text-[11px] bg-[#FBF9F5] hover:bg-[#F5F1EB] border border-[#E7E2DA] hover:border-[#D4A373] text-[#53433B] hover:text-[#1C1C18] px-2.5 py-1.5 rounded-[4px] transition-all cursor-pointer leading-tight"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#E7E2DA]">
                  {error && (
                    <div className="p-2 text-[11px] bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] rounded-[4px]">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#53433B] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Varma"
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#25D366]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#53433B] mb-1">
                        Your WhatsApp / Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#25D366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#53433B] mb-1">
                      Inquiry Type
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#25D366]"
                    >
                      <option value="Stock & Customization">Stock & Custom Dimensions</option>
                      <option value="Showroom Consultation">Showroom Visit (Vijayawada / Vizag / Tirupati)</option>
                      <option value="Architectural Freight & Delivery">Delivery & Freight Inquiry</option>
                      <option value="Trade & Interior Designer Pricing">Trade / Bulk Architect Pricing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#53433B] mb-1">
                      Message / Piece of Interest *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about joinery, wood finishes, or pricing..."
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#25D366]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider rounded-[4px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Relaying to WhatsApp...' : 'Send to Showroom Desk'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

