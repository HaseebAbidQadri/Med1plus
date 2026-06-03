import { useState, useRef } from 'react';
import {
  Search, Pill, Award, Heart, BriefcaseMedical,
  Sparkles, Activity, UserCheck, Dumbbell, ShieldAlert,
  Eye, Droplets, Baby, ArrowLeft, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryItem } from '../types';
import { CONTACT_CONFIG } from '../constants';

interface CategoriesViewProps {
  onSelectCategory?: (category: string) => void;
  medicinesList: any[];
  onAddToCart: (item: { id: string; name: string; price: number }) => void;
  cartItems: { id: string; name: string; price: number; quantity: number }[];
}

export default function CategoriesView({ onSelectCategory, medicinesList, onAddToCart, cartItems }: CategoriesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSidebarTab, setSelectedSidebarTab] = useState('All Categories');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (id: string) => {
    setSelectedSidebarTab(id);
    if (id === 'All Categories') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories: CategoryItem[] = [
    { id: 'all-meds', name: 'All Medicines', productCount: '2000+ Products', iconName: 'briefcase', color: 'bg-emerald-50 text-emerald-500 border-emerald-100', description: 'Comprehensive collection of all clinical and general medicines.' },
    { id: 'vitamins', name: 'Vitamins & Supplements', productCount: '850+ Products', iconName: 'award', color: 'bg-amber-50 text-amber-500 border-amber-100', description: 'Daily nutrients, mineral blends, and immunity boosters.' },
    { id: 'personal', name: 'Personal Care', productCount: '700+ Products', iconName: 'shield', color: 'bg-teal-50 text-teal-500 border-teal-100', description: 'Vibrant skincare, bath essentials, and personal hygiene products.' },
    { id: 'baby', name: 'Baby Care', productCount: '600+ Products', iconName: 'baby', color: 'bg-sky-50 text-sky-500 border-sky-100', description: 'Gentle infant formula, sensitive wipes, and toddler care.' },
    { id: 'skin', name: 'Skin & Hair Care', productCount: '650+ Products', iconName: 'sparkles', color: 'bg-pink-50 text-pink-500 border-pink-100', description: 'Advanced dermatological serums and organic hair solutions.' },
    { id: 'diabetes', name: 'Diabetes Care', productCount: '350+ Products', iconName: 'activity', color: 'bg-blue-50 text-blue-500 border-blue-100', description: 'Glucometers, testing strips, and insulin utilities.' },
    { id: 'elderly', name: 'Elderly Care', productCount: '400+ Products', iconName: 'usercheck', color: 'bg-indigo-50 text-indigo-500 border-indigo-100', description: 'Mobility assistance devices, physical supports, and vital gears.' }
  ];

  const sidebarLinks = [
    'All Categories',
    'All Medicines',
    'Vitamins & Supplements',
    'Personal Care',
    'Baby Care',
    'Skin & Hair Care',
    'Diabetes Care',
    'Elderly Care'
  ];

  // Map icon names to real Lucide icon components
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: "w-10 h-10 transition-transform duration-300 group-hover:scale-110" };
    switch (iconName) {
      case 'pill': return <Pill {...props} />;
      case 'award': return <Award {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'baby': return <Baby {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      case 'activity': return <Activity {...props} />;
      case 'usercheck': return <UserCheck {...props} />;
      case 'briefcase': return <BriefcaseMedical {...props} />;
      case 'dumbbell': return <Dumbbell {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'eye': return <Eye {...props} />;
      default: return <BriefcaseMedical {...props} />;
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedSidebarTab === 'All Categories') {
      return matchesSearch;
    }
    return matchesSearch && category.name === selectedSidebarTab;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Mini Title Breadcrumb */}
      <span className="text-xs font-bold tracking-widest text-[#0cb863] uppercase block mb-3 animate-pulse">
        Categories
      </span>

      {/* Main Container Layout: Sidebar on Left, Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Side Navigation List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 self-start h-auto">
          <div className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = selectedSidebarTab === link || (selectedSidebarTab === 'All Categories' && link === 'All Categories');
              return (
                <button
                  key={link}
                  id={`sidebar-${link.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => scrollToSection(link)}
                  className={`w-full text-left px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#10b981] hover:pl-5'
                    }`}
                >
                  {link}
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 text-center">
            <p className="text-xs font-bold text-emerald-800">Support Line</p>
            <p className="text-[11px] text-emerald-600 mt-1">Need item consultation?</p>
            <a
              href={`tel:${CONTACT_CONFIG.phone}`}
              className="mt-3.5 block text-xs font-bold text-white bg-[#10b981] hover:bg-[#059669] py-2.5 px-4 rounded-full transition-all text-center shadow-md shadow-emerald-200 hover:-translate-y-0.5"
            >
              Call Us Now
            </a>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 flex flex-col space-y-8">

          {/* Top Hero Heading & Search Bar Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 leading-[1.15]">
                Medicine <span className="text-[#10b981]">Catalog</span> <br className="hidden sm:inline" />
                Under <span className="text-[#10b981] relative inline-block">
                  One Roof
                  <span className="absolute left-0 bottom-1 w-full h-1.5 bg-emerald-100 -skew-x-12 rounded-full -z-10" />
                </span>
              </h1>
            </div>

            {/* Interactive Search Bar */}
            <div className="relative w-full md:w-80 lg:w-96" id="search-bar-container">
              <input
                type="text"
                placeholder="Search for medicines across all categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all shadow-sm shadow-slate-100/70"
              />
              <button
                className="absolute right-2 top-2 h-11 w-11 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="space-y-16 mt-8">
            {categories.map((cat) => {
              // If a specific category is selected, only show that one
              if (selectedSidebarTab !== 'All Categories' && selectedSidebarTab !== cat.name) {
                return null;
              }

              const specificCategories = [
                'Vitamins & Supplements',
                'Personal Care',
                'Baby Care',
                'Skin & Hair Care',
                'Diabetes Care',
                'Elderly Care'
              ];

              const medsForCat = medicinesList.filter(med => {
                if (cat.name === 'All Medicines') {
                  return !specificCategories.includes(med.category);
                }
                return med.category === cat.name;
              }).filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()));

              if (medsForCat.length === 0) return null;

              return (
                <div
                  key={cat.id}
                  ref={(el) => { sectionRefs.current[cat.name] = el; }}
                  className="flex flex-col space-y-6 scroll-mt-24"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl ${cat.color} border shadow-sm`}>
                        {renderCategoryIcon(cat.iconName)}
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black font-display text-slate-800">{cat.name}</h2>
                        <p className="text-xs text-slate-400 font-semibold">{cat.description}</p>
                      </div>
                    </div>
                    {medsForCat.length > 8 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          Scroll for more →
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="flex overflow-x-auto pb-6 space-x-5 scroll-smooth no-scrollbar snap-x snap-mandatory">
                      {medsForCat.map((med) => {
                        const cartItem = cartItems.find((c: any) => c.id === med.id);
                        const qty = cartItem ? cartItem.quantity : 0;
                        console.log('CategoriesView imgUrl:', med.imgUrl);
                        return (
                          <div
                            key={med.id}
                            className="flex-shrink-0 w-[280px] snap-start bg-white rounded-[28px] p-5 border border-slate-100 shadow-lg shadow-slate-200/20 hover:shadow-2xl hover:shadow-emerald-200/10 hover:-translate-y-1.5 transform transition-all duration-300 flex flex-col justify-between"
                          >
                            <div>
                              <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${med.imgGradient || 'from-teal-50 to-emerald-50 text-emerald-600'} flex items-center justify-center overflow-hidden mb-4`}>
                                {med.imgUrl ? (
                                  <img src={med.imgUrl} alt={med.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="text-center flex flex-col items-center justify-center p-3">
                                    <Pill className="w-10 h-10" />
                                    <span className="text-[9px] font-bold mt-1 block opacity-85">{med.name}</span>
                                  </div>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-slate-800 tracking-tight line-clamp-1">{med.name}</h3>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">PKR {med.price} each</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-sm font-black text-[#10b981]">PKR {med.price}</span>
                              <button
                                onClick={() => onAddToCart({ id: med.id, name: med.name, price: med.price })}
                                className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-[10px] font-bold shadow-lg shadow-emerald-200 hover:scale-[1.03] transition-all cursor-pointer flex items-center space-x-1.5"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add</span>
                                {qty > 0 && <span className="bg-white text-emerald-600 rounded-full px-1 py-0.5 text-[8px] font-extrabold ml-1">{qty}</span>}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
