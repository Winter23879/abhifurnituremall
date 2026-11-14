import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { ChatInquiryRecord } from '../utils/storage';

interface WhatsAppChatWidgetProps {
  onInquirySubmitted: (record: ChatInquiryRecord) => void;
}

const QUICK_TOPICS = [
  'Check piece availability',
  'Custom dimensions & finishes',
  'Delivery timeline to my city',
  'Book a showroom visit',
];

export const WhatsAppChatWidget: React.FC<WhatsAppChatWidgetProps> = ({
  onInquirySubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your WhatsApp or phone number.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your question.');
      return;
    }

    setIsSubmitting(true);

    const record: ChatInquiryRecord = {
      id: `inq-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      clientName: name.trim(),
      clientContact: phone.trim(),
      message: message.trim(),
      category: 'Store Inquiry',
      status: 'new',
    };

    try {
      await fetch('/api/whatsapp-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch((err) => {
        console.warn('Inquiry queued locally:', err);
      });

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
            aria-label="Chat on WhatsApp"
            className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer focus:outline-none"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="text-xs font-semibold tracking-wide">
              Chat with us
            </span>
          </button>
        )}
      </div>

      {/* WhatsApp Chat Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E7E2DA] flex flex-col animate-fadeIn font-sans">
          {/* Header */}
          <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center font-serif font-bold text-white text-sm border border-white/20">
                  AF
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white">
                  Abhi Furniture Mall
                </h3>
                <p className="text-[11px] text-emerald-100">
                  Typically replies in a few minutes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#ECE5DD]/40 flex-1 space-y-3.5 max-h-[70vh] overflow-y-auto">
            {isSubmitted ? (
              /* Success Confirmation */
              <div className="bg-white rounded-xl p-6 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-base text-[#1C1C18]">
                  Message Sent!
                </h4>
                <p className="text-xs text-[#53433B] leading-relaxed">
                  Thanks, <strong className="text-[#1C1C18]">{name}</strong>. Our team has received your inquiry and will reply to <strong className="text-[#1C1C18]">{phone}</strong> on WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 text-xs font-semibold text-[#075E54] hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {/* Greeting Bubble */}
                <div className="flex items-start space-x-2">
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-[#1C1C18] space-y-1 max-w-[90%] border border-[#E7E2DA]/50">
                    <p className="font-medium text-[#075E54]">Hello! 👋</p>
                    <p className="text-[#53433B] leading-relaxed">
                      Welcome to Abhi Furniture Mall. Have a question about our pieces, customization, or delivery? Message us here!
                    </p>
                  </div>
                </div>

                {/* Quick Topics */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86736A] block">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TOPICS.map((topic, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMessage(topic)}
                        className="text-[11px] bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-[#E7E2DA] text-[#53433B] hover:text-[#075E54] px-2.5 py-1.5 rounded-full transition-all cursor-pointer text-left leading-tight shadow-2xs"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E7E2DA]/50 space-y-2.5">
                  {error && (
                    <div className="p-2 text-[11px] bg-red-50 text-red-700 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#075E54] focus:bg-white text-[#1C1C18] transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp phone number"
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#075E54] focus:bg-white text-[#1C1C18] transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg focus:outline-none focus:border-[#075E54] focus:bg-white text-[#1C1C18] resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>

                  <div className="flex items-center justify-center space-x-1 text-[10px] text-[#86736A] pt-1">
                    <Shield className="w-3 h-3 text-[#25D366]" />
                    <span>Private & confidential inquiry</span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
