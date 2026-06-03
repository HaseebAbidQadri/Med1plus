import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send,
  CheckCircle2, Compass, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_CONFIG } from '../constants';

interface ContactUsViewProps {
  onWhatsAppClick: () => void;
}

export default function ContactUsView({ onWhatsAppClick }: ContactUsViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const contactDetails = [
    {
      id: 'location',
      icon: <MapPin className="w-5 h-5 text-[#10b981]" />,
      label: 'Our Location',
      value: CONTACT_CONFIG.address
    },
    {
      id: 'phone',
      icon: <Phone className="w-5 h-5 text-[#10b981]" />,
      label: 'Phone Number',
      value: CONTACT_CONFIG.phone
    },
    {
      id: 'email',
      icon: <Mail className="w-5 h-5 text-[#10b981]" />,
      label: 'Email Address',
      value: CONTACT_CONFIG.email
    },
    {
      id: 'hours',
      icon: <Clock className="w-5 h-5 text-[#10b981]" />,
      label: 'Opening Hours',
      value: '9:00 AM – 11:00 PM (Everyday)'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^\+?92\d{10}$|^03\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format: +92XXXXXXXXXX or 03XXXXXXXXX';
    }

    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmittedName(formData.name);

    // Simulate sending payload
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setErrors({});

      // Auto-hide toast
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

      {/* Toast Notification for form submission success */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-4 z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex items-start space-x-3 max-w-sm border border-slate-800 backdrop-blur-md"
            id="submission-success-toast"
          >
            <CheckCircle2 className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Message Dispatched!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Thank you <span className="font-bold text-[#10b981]">{submittedName}</span>. One of our MedOne+ pharmacists will respond shortly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-xs font-bold tracking-widest text-[#10b981] uppercase block mb-3 animate-pulse">
        Contact Us
      </span>

      {/* Grid: 3 columns layout (Info, Form, Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">

        {/* Column 1: "We Are Here to Help" details */}
        <div className="lg:col-span-4 bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col space-y-6 text-left justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black font-display tracking-tight text-slate-900 leading-[1.12]">
              We Are Here <br />
              To <span className="text-[#10b981] relative inline-block">
                Help You
                <span className="absolute left-0 bottom-1 w-full h-1.5 bg-emerald-100 -skew-x-12 rounded-full -z-10" />
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              Have a question or need assistance? Reach out to us. We are happy to help!
            </p>
          </div>

          <div className="space-y-5 py-4">
            {contactDetails.map((detail) => (
              <div key={detail.id} className="flex items-start space-x-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/60 flex-shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-300">
                  {detail.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-slate-400 font-semibold">{detail.label}</span>
                  <span className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5 leading-snug">
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Compass className="w-5 h-5 text-[#0d5cb5] animate-spin" />
              <div className="text-left">
                <p className="text-[11px] text-[#0d5cb5] font-bold">Emergency Pharmacy</p>
                <p className="text-[10px] text-slate-400">On-call 24 hours a day</p>
              </div>
            </div>
            <a
              href={`tel:${CONTACT_CONFIG.phone}`}
              className="text-xs font-bold text-white bg-[#0d5cb5] px-3.5 py-1.5 rounded-full hover:bg-blue-700 shadow-sm"
            >
              Call
            </a>
          </div>
        </div>

        {/* Column 2: Send Us a Message message form */}
        <div className="lg:col-span-4 bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 text-left flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black font-display text-slate-900">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-400 mt-1">Our customer experience agents are online helper dispatchers.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 mt-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Your Name</span>
                {errors.name && <span className="text-rose-500 normal-case font-medium">{errors.name}</span>}
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4.5 py-3.5 bg-slate-50 border ${errors.name ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200/60'} rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] focus:bg-white transition-all`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Phone Number</span>
                {errors.phone && <span className="text-rose-500 normal-case font-medium">{errors.phone}</span>}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+92 3XX XXXXXXX"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4.5 py-3.5 bg-slate-50 border ${errors.phone ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200/60'} rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] focus:bg-white transition-all`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Email Address</span>
                {errors.email && <span className="text-rose-500 normal-case font-medium">{errors.email}</span>}
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4.5 py-3.5 bg-slate-50 border ${errors.email ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200/60'} rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] focus:bg-white transition-all`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Your Message</span>
                {errors.message && <span className="text-rose-500 normal-case font-medium">{errors.message}</span>}
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Describe your query or prescription needs..."
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full px-4.5 py-3.5 bg-slate-50 border ${errors.message ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200/60'} rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] focus:bg-white transition-all resize-none`}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full text-xs sm:text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300 hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Column 3: The styled premium vector map */}
        <div className="lg:col-span-4 h-full flex flex-col justify-between">
          <div className="bg-white p-2.5 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">

            {/* Custom stylized vector map design */}
            <div className="w-full h-[480px] bg-sky-50 rounded-[24px] relative overflow-hidden flex items-center justify-center border border-slate-100/40">

              {/* Styled SVG map grids resembling roads & parks of Gulberg, Lahore */}
              <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <radialGradient id="greenPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                {/* Parks and canals in green / blue */}
                <rect x="10%" y="15%" width="85" height="120" rx="4" fill="#d1fae5" />
                <rect x="70%" y="40%" width="120" height="90" rx="8" fill="#ecfdf5" />
                <path d="M -20,220 Q 150,180 320,300" stroke="#bae6fd" strokeWidth="12" fill="none" />

                {/* Regular grid networks (streets) */}
                <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="#ffffff" strokeWidth="5" />
                <line x1="30%" y1="0%" x2="30%" y2="100%" stroke="#ffffff" strokeWidth="5" />
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="5" />
                <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="#ffffff" strokeWidth="5" />

                <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="#ffffff" strokeWidth="5" />
                <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="5" />
                <line x1="0%" y1="78%" x2="100%" y2="78%" stroke="#ffffff" strokeWidth="5" />

                {/* Diagonal Main Boulevard */}
                <line x1="-10%" y1="10%" x2="110%" y2="90%" stroke="#f1f5f9" strokeWidth="18" />
                <line x1="-10%" y1="10%" x2="110%" y2="90%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />

                {/* Hotspots pulse indicator */}
                <circle cx="50%" cy="50%" r="50" fill="url(#greenPulse)" className="animate-ping" style={{ animationDuration: '4s' }} />
                <circle cx="50%" cy="50%" r="6" fill="#10b981" />
                <circle cx="50%" cy="50%" r="10" stroke="#10b981" strokeWidth="2" fill="none" className="animate-pulse" />
              </svg>

              {/* Float badge labeled "Our Pharmacy" */}
              <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-lg text-left">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse mr-0.5" />
                  <span className="text-xs font-bold text-slate-800">Our Pharmacy</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                  Dharampura Bazar, Lahore, Pakistan
                </p>
                <a
                  href="https://maps.google.com/?q=Dharampura+Bazar+Lahore"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  id="get-directions-button"
                  className="mt-3.5 w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform shadow-md shadow-emerald-200 inline-block text-center"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </a>
              </div>

              {/* Canal icon */}
              <div className="absolute right-6 bottom-4 bg-[#0d5cb5] text-white text-[9px] font-bold px-2.5 py-1.5 rounded-full shadow-sm">
                Near Dharampura Canal
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Big Bottom WhatsApp Sync Banner */}
      <div
        className="bg-[#10b981] text-white rounded-[32px] p-8 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-emerald-200/30 animate-pulse"
        style={{ animationDuration: '8s' }}
        id="contact-whatsapp-footer-panel"
      >
        {/* Subtle SVG circular backgrounds inside the banner */}
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-4.5 text-left relative z-10">
          <div className="w-14 h-14 bg-white text-[#10b981] rounded-2xl flex items-center justify-center border border-white/20 shadow-md">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg md:text-xl font-black font-display text-white">
              Need Help? Chat With Us On WhatsApp
            </h3>
            <p className="text-xs md:text-sm text-emerald-50 mt-1 max-w-xl">
              We're here to help you with your medicines and health needs. Send us a photo of your prescription and we'll fulfill it!
            </p>
          </div>
        </div>

        <button
          onClick={onWhatsAppClick}
          id="whatsapp-contact-footer-button"
          className="w-full md:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-[#10b981] font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all relative z-10 flex items-center justify-center space-x-2"
        >
          {/* WhatsApp Custom SVG */}
          <svg className="w-5 h-5 fill-[#10b981]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Chat on WhatsApp</span>
        </button>
      </div>

    </div>
  );
}
