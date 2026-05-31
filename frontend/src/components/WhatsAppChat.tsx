import React, { useState, useRef, useEffect } from 'react';
import { X, Send, CheckCheck, Landmark, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WhatsAppChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'pharmacist' | 'user';
  text: string;
  timestamp: string;
}

export default function WhatsAppChat({ isOpen, onClose }: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'pharmacist',
      text: 'Asslam-o-Alaikum! Welcome to MedOne+ Pharmacy. 🏥',
      timestamp: 'Just now'
    },
    {
      id: 'init-2',
      sender: 'pharmacist',
      text: 'I am Dr. Haseeb Ahmed, your pharmacist on duty. How can I assist you with your prescriptions or daily healthcare products today? You can also upload/send us your prescription details here.',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate pharmacist professional response
    setTimeout(() => {
      setIsTyping(false);
      let pharmacistResponseText = "Thank you for reaching out. Let me check the availability of these items in our Dharampura Bazar, Lahore stock immediately.";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('prescription') || lowerInput.includes('rx') || lowerInput.includes('doctor')) {
        pharmacistResponseText = "Please send over a clear photo of your prescription. We will verify the authorization and dispatch licensed medicines via our cold-chain secure delivery riders.";
      } else if (lowerInput.includes('delivery') || lowerInput.includes('shipping') || lowerInput.includes('order')) {
        pharmacistResponseText = "Yes, we dispatch throughout Lahore (Dharampura, Gulberg, Defense, Model Town, Johar Town, etc.). Delivery usually takes 60-90 minutes. Would you like to share your address?";
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('discount')) {
        pharmacistResponseText = "We offer 100% genuine medicines at standard government regulatory prices, with up to a 10% discount on wellness products and multi-vitamins!";
      } else if (lowerInput.includes('vitamin') || lowerInput.includes('supplement')) {
        pharmacistResponseText = "We have major multi-vitamin brands (Centrum, Solgar, Nature’s Bounty) 100% in stock. Let us know which vitamins you require.";
      }

      setMessages(prev => [...prev, {
        id: `pharmacist-${Date.now()}`,
        sender: 'pharmacist',
        text: pharmacistResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          id="whatsapp-chat-widget"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-full max-w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[520px]"
        >
          {/* Header */}
          <div className="bg-[#10b981] p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              {/* Avatar Indicator */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
                  alt="Dr. Haseeb Ahmed"
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#10b981] rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight leading-snug">Dr. Haseeb Ahmed, RPh</h4>
                <p className="text-[10px] text-emerald-100 flex items-center">
                  <span className="mr-1">🛡️</span> On-Duty Pharmacist (Online)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-whatsapp-widget"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-[#efeae2]/45 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-left font-sans">
            
            {/* Disclaimer Security Notification */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-[10px] text-amber-700 flex items-start space-x-1.5 leading-normal">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <span>
                <strong>Verified Order Dispatch</strong>: All healthcare distributions comply with DRAP guidelines. Prescription orders undergo mandatory medical pharmacist verification.
              </span>
            </div>

            {messages.map((msg) => {
              const IsPharmacist = msg.sender === 'pharmacist';
              return (
                <div
                  key={msg.id}
                  className={`flex ${IsPharmacist ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm relative ${
                      IsPharmacist
                        ? 'bg-white text-slate-800 rounded-tl-none'
                        : 'bg-emerald-100/60 text-emerald-950 rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {!IsPharmacist && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center space-x-1 shadow-sm">
                  <span className="font-semibold text-emerald-600">Dr. Haseeb is typing</span>
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 bg-slate-50 border-t border-slate-100 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Type message or ask for order..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]"
            />
            <button
              type="submit"
              id="send-whatsapp-message-button"
              className="w-10 h-10 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-md hover:shadow-emerald-100 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
