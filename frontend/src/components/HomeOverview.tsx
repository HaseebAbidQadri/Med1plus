import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Pill, Award, Heart, Sparkles, ShieldCheck,
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Users, Clock, MapPin, Upload, Truck, MessageSquare, Check, Smile, Phone, ArrowRight, Lock, Activity, UserCheck
} from 'lucide-react';

// Live Branded Pharmacy Mockups from User Files
import pharmacyHeroImg from '../assets/images/pharmacy_hero_1779732503274.png';
import pharmacyShelvesImg from '../assets/images/pharmacy_shelves_1779732545142.png';
import pharmacyStorefrontImg from '../assets/images/pharmacy_storefront_1779732567610.png';

// -------------------------------------------------------------
// Beautiful Landing Page Overview (Used for activeTab: 'home')
// -------------------------------------------------------------
interface HomeOverviewProps {
  onBrowseCatalog: () => void;
  onExploreServices: () => void;
  onVisitAbout: () => void;
  onWhatsAppClick: () => void;
  onAddToCart: (item: { id: string; name: string; price: number }) => void;
  cartItems: { id: string; name: string; price: number; quantity: number }[];
  medicinesList?: {
    id: string;
    name: string;
    price: number;
    imgGradient?: string;
    imgUrl?: string;
    category: string;
    [key: string]: any;
  }[];
}

export default function HomeOverview({ onBrowseCatalog, onExploreServices, onVisitAbout, onWhatsAppClick, onAddToCart, cartItems, medicinesList }: HomeOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCat, setSelectedSearchCat] = useState('All Categories');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load real user images from localStorage if uploaded, otherwise fallback to default mockups
  const [storefrontImg, setStorefrontImg] = useState<string>(pharmacyStorefrontImg);
  const [heroImg, setHeroImg] = useState<string>(pharmacyHeroImg);
  const [shelvesImg, setShelvesImg] = useState<string>(pharmacyShelvesImg);
  const [pharmacistImg, setPharmacistImg] = useState<string>("https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop");
  const [waitingImg, setWaitingImg] = useState<string>("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop");
  const [babyImg, setBabyImg] = useState<string>("https://images.unsplash.com/photo-1519689680058-324335c77ebd?q=80&w=800&auto=format&fit=crop");
  const [vitaminsImg, setVitaminsImg] = useState<string>("https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop");
  const [fridgeImg, setFridgeImg] = useState<string>("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop");

  useEffect(() => {
    const customStorefront = localStorage.getItem('medone_custom_image_storefront');
    const customHero = localStorage.getItem('medone_custom_image_hero');
    const customShelves = localStorage.getItem('medone_custom_image_shelves');
    const customPharmacist = localStorage.getItem('medone_custom_image_pharmacist');
    const customWaiting = localStorage.getItem('medone_custom_image_waiting');
    const customBaby = localStorage.getItem('medone_custom_image_baby');
    const customVitamins = localStorage.getItem('medone_custom_image_vitamins');
    const customFridge = localStorage.getItem('medone_custom_image_fridge');

    if (customStorefront) setStorefrontImg(customStorefront);
    if (customHero) setHeroImg(customHero);
    if (customShelves) setShelvesImg(customShelves);
    if (customPharmacist) setPharmacistImg(customPharmacist);
    if (customWaiting) setWaitingImg(customWaiting);
    if (customBaby) setBabyImg(customBaby);
    if (customVitamins) setVitaminsImg(customVitamins);
    if (customFridge) setFridgeImg(customFridge);
  }, []);

  // Categories list for slider
  const categorySliderItems = [
    { id: 'all-meds', label: 'All Medicines', icon: <Pill className="w-5 h-5 text-emerald-500" />, color: 'bg-emerald-50' },
    { id: 'vitamins', label: 'Vitamins & Supplements', icon: <Award className="w-5 h-5 text-amber-500" />, color: 'bg-amber-50' },
    { id: 'personal', label: 'Personal Care', icon: <ShieldCheck className="w-5 h-5 text-[#0d5cb5]" />, color: 'bg-blue-50' },
    { id: 'baby', label: 'Baby Care', icon: <Smile className="w-5 h-5 text-sky-500" />, color: 'bg-sky-50' },
    { id: 'skin', label: 'Skin & Hair Care', icon: <Sparkles className="w-5 h-5 text-pink-500" />, color: 'bg-pink-50' },
    { id: 'diabetes', label: 'Diabetes Care', icon: <Activity className="w-4.5 h-4.5 text-blue-500" />, color: 'bg-blue-50' },
    { id: 'elderly', label: 'Elderly Care', icon: <UserCheck className="w-4.5 h-4.5 text-indigo-500" />, color: 'bg-indigo-50' },
  ];

  // Core medicines mock list for interactive Grid
  const featuredMedicines = medicinesList || [
    { id: 'panadol', name: 'Panadol 500mg', price: 120, imgGradient: 'from-rose-50 to-rose-100 text-rose-500', icon: <Pill className="w-12 h-12" />, imgUrl: '', category: 'Pain Relief' },
    { id: 'brufen', name: 'Brufen 400mg', price: 150, imgGradient: 'from-indigo-50 to-indigo-100 text-indigo-500', icon: <Pill className="w-12 h-12" />, imgUrl: '', category: 'Pain Relief' },
    { id: 'augmentin', name: 'Augmentin 625mg', price: 280, imgGradient: 'from-emerald-50 to-emerald-100 text-[#10b981]', icon: <Pill className="w-12 h-12" />, imgUrl: '', category: 'Antibiotics' },
    { id: 'caltrate', name: 'Caltrate Plus', price: 950, imgGradient: 'from-amber-50 to-amber-100 text-amber-500', icon: <Award className="w-12 h-12" />, imgUrl: '', category: 'Vitamins & Supp.' },
    { id: 'supradyn', name: 'Supradyn', price: 850, imgGradient: 'from-sky-50 to-sky-100 text-sky-500', icon: <Sparkles className="w-12 h-12" />, imgUrl: '', category: 'Vitamins' },
  ];

  const filteredMedicines = featuredMedicines.filter((med) => {
    const term = searchQuery.toLowerCase();
    // Search only filters medicines by name
    return med.name.toLowerCase().includes(term);
  });

  const nextSlide = () => {
    if (startIndex + 5 < filteredMedicines.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Reset slider when search changes
  useEffect(() => {
    setStartIndex(0);
  }, [searchQuery]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleSearchChange = (val: string) => {
    setTempSearchQuery(val);
    setShowSuggestions(val.length > 0);
  };

  const executeSearch = (val: string = tempSearchQuery) => {
    setSearchQuery(val);
    setTempSearchQuery(val);
    setShowSuggestions(false);
    if (val.length > 0) {
      const target = document.getElementById('featured-medicines-section');
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const suggestions = tempSearchQuery.length > 0
    ? featuredMedicines
      .filter(m => m.name.toLowerCase().includes(tempSearchQuery.toLowerCase()))
      .slice(0, 5)
    : [];

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = () => {
    if (uploadFile) {
      setIsSubmitSuccessful(true);
      setTimeout(() => {
        setIsSubmitSuccessful(false);
        setUploadFile(null);

        const msg = encodeURIComponent("Assalamu Alaikum MedOne+ Pharmacy. I have attached my prescription for review. Please check and guide me on the medicines.");
        window.open(`https://wa.me/923315569472?text=${msg}`, '_blank');
      }, 1000);
    }
  };

  return (
    <div className="pb-8 overflow-x-hidden">

      {/* 1. Hero Header Section */}
      <div className="relative bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent pt-12 pb-20 text-left overflow-hidden">
        {/* Decorative background visual ambient spots */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#0d5cb5]/10 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Hero Left Content Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">

            {/* Top trusted badge */}
            <div className="inline-flex items-center space-x-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100/40 rounded-full px-4.5 py-2.5 w-fit select-none">
              <span className="w-4.5 h-4.5 bg-[#10b981] text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Trusted Pharmacy in Lahore</span>
            </div>

            {/* Huge Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.1] text-left">
              Your Health, <br />
              <span className="text-[#10b981] relative inline-block">
                Our Priority.
                <span className="absolute left-0 bottom-2 w-full h-2.5 bg-emerald-150 -skew-x-12 rounded-full -z-10" />
              </span>
            </h1>

            {/* Paragraph describing medicines */}
            <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed text-left">
              All your medicines, healthcare products and wellness essentials under one roof. Genuine. Safe. Reliable. We bring certified drug formulations and round-the-clock specialists straight to your doorstep.
            </p>

            {/* Flat bullets list with unique colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 max-w-xl py-2">
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <span className="w-5.5 h-5.5 bg-emerald-50 rounded-full flex items-center justify-center text-[#10b981] border border-emerald-100 flex-shrink-0">✓</span>
                <span>100% Genuine Medicines</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <span className="w-5.5 h-5.5 bg-sky-50 rounded-full flex items-center justify-center text-[#0e7490] border border-sky-100 flex-shrink-0">✓</span>
                <span>Fast & Reliable Service</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <span className="w-5.5 h-5.5 bg-purple-50 rounded-full flex items-center justify-center text-[#7e22ce] border border-purple-100 flex-shrink-0">✓</span>
                <span>Friendly Support</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <span className="w-5.5 h-5.5 bg-amber-50 rounded-full flex items-center justify-center text-[#b45309] border border-amber-100 flex-shrink-0">✓</span>
                <span>Secure Payments</span>
              </div>
            </div>

            {/* Buttons list */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  const target = document.getElementById('upload-prescription-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center space-x-2.5 cursor-pointer w-full sm:w-auto"
              >
                <Upload className="w-4.5 h-4.5" />
                <span>Upload Prescription</span>
              </button>
              <a
                href="tel:+923001234567"
                className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold rounded-2xl text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Phone className="w-4.5 h-4.5" />
                <span>Call Now</span>
              </a>
              <button
                onClick={() => {
                  const target = document.getElementById('visit-map-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-4 bg-white hover:bg-slate-50 text-[#0d5cb5] border border-slate-200 font-extrabold rounded-2xl text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
              >
                <MapPin className="w-4.5 h-4.5" />
                <span>Visit Our Store</span>
              </button>
            </div>

          </div>

          {/* Hero Right visual mockup - Styled real pharmacy desk showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="relative w-full max-w-[440px]">

              {/* Flying decorative elements */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 z-20 text-3xl select-none"
              >
                💚
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 right-8 z-20 text-2xl select-none"
              >
                💊
              </motion.div>

              {/* Real Branch visual showcase frame */}
              <div className="bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 shadow-slate-300/40 relative overflow-hidden transition-all duration-500 hover:scale-[1.01] group">
                <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100">
                  <img
                    src={heroImg}
                    alt="MedOne+ Pharmacy Counter Checkout"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Real visual watermark badge corresponding to photo */}
                  <div className="absolute top-3.5 left-3.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[9px] font-bold tracking-widest uppercase flex items-center space-x-1.5 font-sans">
                    <span className="w-1.5 h-1.5 bg-emerald-450 bg-emerald-400 rounded-full animate-ping"></span>
                    <span>Live Store Shot</span>
                  </div>
                </div>

                {/* Info Card Block below image */}
                <div className="p-4 pt-5 text-left">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center space-x-2.5 font-sans">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-[#10b981] font-black border border-emerald-100">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#10b981] leading-none">MedOne<span className="text-[#0d5cb5]">+</span> Pharmacy</h4>
                        <p className="text-[10px] text-slate-400 font-extrabold mt-1">PMDC Certified Setup</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-sans">
                      Branch Lahore
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Actual picture of our premium digital checkout counter from our main branch in Dharampura Bazar, Lahore, featuring our official brand motto "The One Your Trust".
                  </p>

                  {/* Badges strip */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 font-sans">
                    <span className="text-[9px] bg-slate-50 text-slate-550 text-slate-500 font-extrabold px-2.5 py-1 rounded-full border border-slate-100">
                      📍 Dharampura Bazar, Lahore
                    </span>
                    <span className="text-[9px] bg-slate-50 text-slate-550 text-slate-500 font-extrabold px-2.5 py-1 rounded-full border border-slate-100">
                      🛡️ Authentic stock
                    </span>
                    <span className="text-[9px] bg-emerald-50/60 text-[#10b981] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100/50">
                      🟢 Pharmacist On Duty
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating Search Panel Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white p-2.5 rounded-full shadow-2xl border border-slate-100/70 shadow-slate-300/60 flex items-center justify-between">
          <div className="flex items-center space-x-3 pl-4 flex-1">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="relative flex-1">
              <input
                type="text"
                value={tempSearchQuery}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => tempSearchQuery.length > 0 && setShowSuggestions(true)}
                placeholder="Search for medicines..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs sm:text-sm font-sans"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => executeSearch(s.name)}
                      className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center space-x-3 group"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#10b981]" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">

            {/* Magnifying search badge container click action */}
            <button
              onClick={() => executeSearch()}
              className="w-11 h-11 bg-[#10b981] hover:bg-[#059669] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-250 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Shop by Categories Slider Layout */}
      <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900">
              Shop by <span className="text-[#10b981]">Categories</span>
            </h2>
            <div className="w-12 h-1 bg-[#10b981] rounded-full mt-1.5" />
          </div>

          {/* Indicators Left / Right (pure visual chevrons) */}
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-white flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Flex Row deck scrollable */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categorySliderItems.map((cat) => (
            <div
              key={cat.id}
              onClick={onBrowseCatalog}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-200/40 hover:shadow-xl hover:shadow-emerald-200/10 cursor-pointer text-center flex flex-col items-center justify-between group transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-11 h-11 rounded-full ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight block">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Horizontal Trust Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 p-6 rounded-[24px] border border-slate-150 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-white text-[#10b981] flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">Serving Lahore</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">With Care & Trust</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-left border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-4">
            <div className="w-11 h-11 rounded-xl bg-white text-[#10b981] flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">Trusted by</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Thousands of Families</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-left border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-4">
            <div className="w-11 h-11 rounded-xl bg-white text-[#10b981] flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">One Branch</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">In Lahore</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-left border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-4">
            <div className="w-11 h-11 rounded-xl bg-white text-[#10b981] flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">24/7 Customer</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Support Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Why Choose Us Section */}
      <div className="py-14 bg-white border-y border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900">
              Why <span className="text-[#10b981]">Choose Us</span>
            </h2>
            <div className="w-16 h-1 bg-[#10b981] rounded-full mt-2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 text-left">

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100/60 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl text-[#10b981] flex items-center justify-center border border-emerald-100/50 mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">100% Genuine Products</h3>
              <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">
                We ensure only authentic and high quality medicines directly imported from original clinical batches.
              </p>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100/60 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl text-[#0d5cb5] flex items-center justify-center border border-blue-100/50 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Expert Pharmacist</h3>
              <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">
                Our experienced, registered RPh pharmacist is always on duty here to consult and help you with guidelines.
              </p>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100/60 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl text-[#10b981] flex items-center justify-center border border-emerald-100/50 mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Fast Delivery in Lahore</h3>
              <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">
                Quick, safe cold-chain delivery of medicines right at your doorstep in any sector of Lahore.
              </p>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100/60 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl text-amber-600 flex items-center justify-center border border-amber-100/50 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Affordable Prices</h3>
              <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">
                Best price guarantees on medicines with seasonal package and support help benefits.
              </p>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-100/60 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl text-purple-600 flex items-center justify-center border border-purple-100/50 mb-4">
                <Smile className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Customer Satisfaction</h3>
              <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">
                Your health, immediate feedback and overall peace of mind represents our ultimate benchmark.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 6. Healthcare Services We Provide */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            <span className="text-xs font-bold text-[#10b981] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black font-display tracking-tight text-slate-900 leading-tight">
              Healthcare <span className="text-[#10b981]">Services</span> We Provide
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We are more than just a regular pharmacy store. Our certified clinical staff is deeply committed to delivering authentic consultations, physical test measurements, and critical cold-chain delivery.
            </p>
            <div>
              <button
                onClick={onExploreServices}
                className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                View All Services
              </button>
            </div>
          </div>

          {/* Right Cards Stack Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#10b981] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">Rx Approved</span>
                <h3 className="text-xs font-black text-slate-900 mt-4">Prescription Medicines</h3>
                <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">Wide range of prescription-based imported medicines available safely.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#0d5cb5] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full font-bold">Doorstep</span>
                <h3 className="text-xs font-black text-slate-900 mt-4">Medicine Home Delivery</h3>
                <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">Fast and temperature-secured delivery of medicines across Lahore.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-bold">Registered RPh</span>
                <h3 className="text-xs font-black text-slate-900 mt-4">Health Consultation</h3>
                <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">Get friendly, expert help and prescription verification from our pharmacist.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#10b981] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">Free Diagnostics</span>
                <h3 className="text-xs font-black text-slate-900 mt-4">Blood Pressure Checking</h3>
                <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">Get complimentary pressure monitoring checks at our physical branch store.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between sm:col-span-2 xl:col-span-1">
              <div>
                <span className="text-xs text-[#06b6d4] bg-cyan-50 border border-cyan-101 px-2.5 py-1 rounded-full font-bold">Specialized Care</span>
                <h3 className="text-xs font-black text-slate-900 mt-4">Diabetes Management</h3>
                <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">High precision testing strips, glucometer calibrations and custom care support.</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 7. Featured Medicines (Connected directly to Cart) */}
      <div className="py-14 bg-slate-50" id="featured-medicines-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#10b981] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full">
                Popular Products
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 mt-4">
                Featured <span className="text-[#10b981]">Medicines</span>
              </h2>
              <div className="w-16 h-1 bg-[#10b981] rounded-full mt-2" />
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                disabled={startIndex === 0}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${startIndex === 0 ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-200 text-slate-400 hover:text-[#10b981] hover:border-[#10b981] cursor-pointer'
                  }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={startIndex + 5 >= filteredMedicines.length}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${startIndex + 5 >= filteredMedicines.length ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-[#10b981] bg-[#10b981] text-white hover:bg-[#059669] cursor-pointer shadow-lg shadow-emerald-200'
                  }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
              <button
                onClick={onBrowseCatalog}
                className="text-xs font-extrabold text-[#10b981] hover:text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Medicines Horizontal Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredMedicines.slice(startIndex, startIndex + 5).map((med) => {
              const cartItem = cartItems.find((c) => c.id === med.id);
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={med.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transform transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Medicine Visual Box Placeholder instead of missing external assets */}
                    <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${med.imgGradient || 'from-teal-50 to-emerald-50 text-emerald-600'} flex items-center justify-center overflow-hidden mb-4`}>
                      {med.imgUrl ? (
                        <img src={med.imgUrl} alt={med.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center flex flex-col items-center justify-center p-4">
                          {typeof med.icon === 'string' || !med.icon ? (
                            <Pill className="w-12 h-12" />
                          ) : (
                            med.icon
                          )}
                          <span className="text-[10px] font-bold mt-1.5 block opacity-85">{med.name}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit">
                      {med.category}
                    </span>

                    <h3 className="text-sm font-bold text-slate-800 tracking-tight mt-2 min-h-[38px]">
                      {med.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-sm font-black text-[#10b981]">
                      PKR {med.price}
                    </span>

                    <button
                      onClick={() => onAddToCart({ id: med.id, name: med.name, price: med.price })}
                      className="px-4.5 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-250 hover:scale-[1.03] transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>Add to Cart</span>
                      {qty > 0 && <span className="bg-white text-emerald-600 rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold ml-1">{qty}</span>}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredMedicines.length === 0 && (
              <div className="col-span-full bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">No matching medicines found</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 py-2 px-4 bg-[#10b981] text-white rounded-xl text-xs font-bold hover:bg-[#059669]"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 8. Upload Prescription Timeline Module */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="upload-prescription-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left illustration */}
          <div className="lg:col-span-5">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="bg-white p-8 rounded-[32px] border-2 border-dashed border-slate-200 shadow-lg text-center flex flex-col items-center justify-center space-y-4 hover:border-[#10b981] hover:bg-emerald-50/10 cursor-pointer transition-all h-[360px]"
              onClick={triggerUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10b981] border border-emerald-100">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {uploadFile ? uploadFile.name : 'Drag & Drop prescription here'}
              </p>
              <p className="text-xs text-slate-400 max-w-[200px] leading-normal mx-auto">
                {uploadFile ? `Size: ${(uploadFile.size / 1024).toFixed(1)} KB` : 'or browse files from your storage (JPEG, PNG, PDF supported)'}
              </p>

              {uploadFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadSubmit();
                  }}
                  className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md transition-all mt-4 w-full"
                >
                  Submit to Certified RPh
                </button>
              )}
            </div>
          </div>

          {/* Right text layout timeline info */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <span className="text-xs font-bold text-[#10b981] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit">
              Upload Prescription
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-black font-display tracking-tight text-slate-900 leading-tight">
              Upload Prescription <br />
              We Will <span className="text-[#10b981]">Take Care</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Upload your prescription and our registered, licensed pharmacist will immediately review your clinical file, contact you for details, and prepare doorway cold-chain delivery.
            </p>

            {/* How it works details */}
            <div>
              <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest mb-4">How It Works?</h3>
              <div className="space-y-4">

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 text-[#10b981] rounded-full flex items-center justify-center text-xs font-black font-mono">1</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Upload Prescription</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">Upload a clear file photo or pdf receipt of your doctor-authorized slip safely.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 text-[#10b981] rounded-full flex items-center justify-center text-xs font-black font-mono">2</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Review & Confirm</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">pharmacist will match original batches, review quantities, and verify availability.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 text-[#10b981] rounded-full flex items-center justify-center text-xs font-black font-mono">3</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Fast Delivery</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed mt-0.5">We dispatch your medicine under temperature controls directly to Lahore addresses.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 9. Your Trusted Pharmacy In Lahore Section */}
      <div className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-6">
              <span className="text-xs font-bold text-[#10b981] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit">
                About Us
              </span>
              <h2 className="text-3xl sm:text-4.5xl font-black font-display tracking-tight text-slate-900 leading-tight">
                Your Trusted Pharmacy <br />
                In <span className="text-[#10b981]">Lahore</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                MedOne+ Pharmacy is a premium, fully-licensed pharmaceutical supplier set up in Lahore, Pakistan. We are committed to distributing DRAP-registered imported drugs, original vitamins, and professional health support utilities with strict safety check guarantees.
              </p>

              {/* Checks */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-5.5 h-5.5 bg-emerald-50 text-[#10b981] border border-emerald-100 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span className="text-xs font-extrabold">Licensed & Registered Pharmacy</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-5.5 h-5.5 bg-emerald-50 text-[#10b981] border border-emerald-100 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span className="text-xs font-extrabold">100% Genuine Clinical Medicines</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-5.5 h-5.5 bg-emerald-50 text-[#10b981] border border-emerald-100 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span className="text-xs font-extrabold">Serving the Community with Trust</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-5.5 h-5.5 bg-emerald-50 text-[#10b981] border border-emerald-100 rounded-full flex items-center justify-center font-bold text-[10px]">✓</div>
                  <span className="text-xs font-extrabold">Continuous Doctor Verification Desk</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onVisitAbout}
                  className="px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-250 transition-all cursor-pointer"
                >
                  Learn More About Us
                </button>
              </div>
            </div>

            {/* Right Picture Collage Column (7 cols) */}
            <div className="lg:col-span-12 xl:col-span-7">
              <div className="grid grid-cols-12 gap-4 h-[380px]">

                {/* Image 1: Pharmacy Storefront exterior (Top Left, 7 cols) */}
                <div className="col-span-7 h-48 rounded-[24px] overflow-hidden border border-slate-100 shadow-md transform hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={storefrontImg}
                    alt="MedOne+ Pharmacy Glass Sliding Storefront in Lahore"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Image 2: inside medicine shelves (Right, 5 cols) */}
                <div className="col-span-5 h-[340px] rounded-[24px] overflow-hidden border border-slate-100 shadow-md row-span-2 transform hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={shelvesImg}
                    alt="MedOne+ Pharmacy Medicine Shelves Stock"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Image 3: RPh Doctor Consultation Corner (Bottom Left, 7 cols) */}
                <div className="col-span-7 h-40 rounded-[24px] overflow-hidden border border-slate-100 shadow-md transform hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src={pharmacistImg}
                    alt="MedOne+ Pharmacy Dedicated Pharmacist Consultation Corner in Lahore"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Stats Bar Underneath About Layout */}
          <div className="mt-14 bg-slate-50 border border-slate-150 p-6 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2.5xl font-black text-[#10b981]">5000+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Happy Customers</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xl sm:text-2.5xl font-black text-[#10b981]">1000+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Medicines Available</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xl sm:text-2.5xl font-black text-[#10b981]">1</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Branch in Lahore</p>
            </div>
            <div className="border-l border-slate-200">
              <p className="text-xl sm:text-2.5xl font-black text-[#10b981]">100%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Customer Satisfaction</p>
            </div>
          </div>

        </div>
      </div>

      {/* 10. Visit Us in Lahore Location Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="visit-map-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Columns details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <span className="text-xs font-bold text-[#10b981] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit">
              Our Location
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-black font-display tracking-tight text-slate-900 leading-tight">
              Visit Us In <span className="text-[#10b981]">Lahore</span>
            </h2>

            {/* details card layout */}
            <div className="space-y-4">

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#10b981] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Branch Address</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Dharampura Bazar, Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#10b981] flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Open Everyday</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Monday to Sunday: 9:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-[#10b981] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Phone Contact</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">+92 300 1234567</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Map Mockup Illustration (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200/50 h-[360px] relative shadow-lg">

              {/* Styled clean vector map contours */}
              <div className="absolute inset-0 bg-[#e2e8f0]">
                {/* River contour drawing */}
                <div className="absolute left-0 right-0 top-1/2 h-12 bg-sky-200 -skew-y-3 opacity-60" />
                {/* Roads lines */}
                <div className="absolute w-4 h-full bg-white left-1/3 rotate-12 opacity-80" />
                <div className="absolute w-full h-4 bg-white top-1/4 -rotate-6 opacity-80" />
                <div className="absolute w-full h-5 bg-white top-2/3 rotate-3 opacity-80" />
                {/* Green park shapes */}
                <div className="absolute w-24 h-24 bg-emerald-100/80 rounded-full top-1/3 left-12" />
                <div className="absolute w-32 h-20 bg-emerald-150 rounded-full bottom-10 right-16" />
              </div>

              {/* Pin marker */}
              <div className="absolute top-[48%] left-[45%] z-20 flex flex-col items-center">
                <div className="w-4 h-4 bg-[#0d5cb5] rounded-full absolute -top-1 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-[#10b981] shadow-xl border-2 border-white flex items-center justify-center relative">
                  <MapPin className="w-4.5 h-4.5 text-white" />
                </div>
              </div>

              {/* In-map Pharmacy Address Label */}
              <div className="absolute top-6 left-6 z-20 bg-white p-4.5 rounded-2xl shadow-2xl border border-slate-100 max-w-[240px] text-left font-sans text-slate-800">
                <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md block w-fit">Our Pharmacy</span>
                <p className="text-xs font-black mt-2 text-[#10b981]">MedOne<span className="text-[#0d5cb5]">+</span> Pharmacy Store</p>
                <p className="text-[10px] text-slate-400 mt-1">Dharampura Bazar, Lahore.</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-[10px] rounded-lg text-center shadow-md transition-colors leading-none"
                >
                  Get Directions
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 11. Bottom Banner (WhatsApp Floating trigger) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-[#10b981] rounded-[24px] p-8 text-white flex flex-col md:flex-row items-center justify-between text-left shadow-xl shadow-emerald-100/50">
          <div className="flex items-center space-x-5 mb-6 md:mb-0">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white">
              {/* WhatsApp icon */}
              <svg
                className="w-7 h-7 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-black leading-none">Need Help? Chat with Us On WhatsApp</h3>
              <p className="text-xs text-emerald-100 font-semibold mt-2.5">We're here to help you live a healthy, genuine, verified lifestyle.</p>
            </div>
          </div>
          <button
            onClick={onWhatsAppClick}
            className="px-6 py-3.5 bg-white text-[#10b981] hover:bg-slate-50 font-extrabold rounded-full text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}
