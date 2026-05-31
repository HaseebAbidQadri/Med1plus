import { useState } from 'react';
import { 
  Search, Pill, Award, Heart, BriefcaseMedical, 
  Sparkles, Activity, UserCheck, Dumbbell, ShieldAlert,
  Eye, Droplets, Baby
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryItem } from '../types';

interface CategoriesViewProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoriesView({ onSelectCategory }: CategoriesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSidebarTab, setSelectedSidebarTab] = useState('All Categories');

  const categories: CategoryItem[] = [
    { id: 'prescription', name: 'Prescription Medicines', productCount: '1200+ Products', iconName: 'pill', color: 'bg-rose-50 text-rose-500 border-rose-100', description: 'Licensed Rx medications authorized by doctors.' },
    { id: 'vitamins', name: 'Vitamins & Supplements', productCount: '850+ Products', iconName: 'award', color: 'bg-amber-50 text-amber-500 border-amber-100', description: 'Daily nutrients, mineral blends, and immunity boosters.' },
    { id: 'healthcare', name: 'Health Care', productCount: '950+ Products', iconName: 'heart', color: 'bg-red-50 text-red-500 border-red-100', description: 'Daily monitoring devices and cardiovascular health support.' },
    { id: 'personal', name: 'Personal Care', productCount: '700+ Products', iconName: 'shield', color: 'bg-teal-50 text-teal-500 border-teal-100', description: 'Vibrant skincare, bath essentials, and personal hygiene products.' },
    { id: 'baby', name: 'Baby Care', productCount: '600+ Products', iconName: 'baby', color: 'bg-sky-50 text-sky-500 border-sky-100', description: 'Gentle infant formula, sensitive wipes, and toddler care.' },
    { id: 'skin', name: 'Skin & Hair Care', productCount: '650+ Products', iconName: 'sparkles', color: 'bg-pink-50 text-pink-500 border-pink-100', description: 'Advanced dermatological serums and organic hair solutions.' },
    { id: 'diabetes', name: 'Diabetes Care', productCount: '350+ Products', iconName: 'activity', color: 'bg-blue-50 text-blue-500 border-blue-100', description: 'Glucometers, testing strips, and insulin utilities.' },
    { id: 'elderly', name: 'Elderly Care', productCount: '400+ Products', iconName: 'usercheck', color: 'bg-indigo-50 text-indigo-500 border-indigo-100', description: 'Mobility assistance devices, physical supports, and vital gears.' },
    { id: 'firstaid', name: 'First Aid', productCount: '300+ Products', iconName: 'briefcase', color: 'bg-emerald-50 text-emerald-500 border-emerald-100', description: 'Wound care dressing, antiseptic liquids, and bandage kits.' },
    { id: 'fitness', name: 'Fitness & Wellness', productCount: '500+ Products', iconName: 'dumbbell', color: 'bg-slate-50 text-slate-500 border-slate-100', description: 'Protein powders, shaker bottles, orthotics, and active gears.' },
    { id: 'women', name: 'Women Care', productCount: '460+ Products', iconName: 'droplets', color: 'bg-fuchsia-50 text-fuchsia-500 border-fuchsia-100', description: 'Feminine hygiene, specialized multi-vitamins, and maternity care.' },
    { id: 'eye', name: 'Eye Care', productCount: '250+ Products', iconName: 'eye', color: 'bg-cyan-50 text-cyan-500 border-cyan-100', description: 'Moisturizing eye drops, contact lens solution, and screen guards.' }
  ];

  const sidebarLinks = [
    'All Categories',
    'Prescription Medicines',
    'Vitamins & Supplements',
    'Health Care',
    'Personal Care',
    'Baby Care',
    'Skin & Hair Care',
    'Diabetes Care',
    'Elderly Care',
    'First Aid',
    'Fitness & Wellness'
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
              const isActive = selectedSidebarTab === link;
              return (
                <button
                  key={link}
                  id={`sidebar-${link.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedSidebarTab(link)}
                  className={`w-full text-left px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isActive
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
              href="tel:+923001234567" 
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
                All Healthcare Categories <br className="hidden sm:inline" />
                Under <span className="text-[#10b981] relative inline-block">
                  One Roof
                  <span className="absolute left-0 bottom-1 w-full h-1.5 bg-emerald-100 -skew-x-12 rounded-full -z-10" />
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-3 leading-relaxed">
                Explore our wide range of medicines, healthcare products, and wellness essentials. Everything you need for a healthier life, authenticated by licensed specialists.
              </p>
            </div>

            {/* Interactive Search Bar */}
            <div className="relative w-full md:w-80 lg:w-96" id="search-bar-container">
              <input
                type="text"
                placeholder="Search for categories or products..."
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

          {/* Categories Grid Area */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, idx) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  onClick={() => onSelectCategory?.(category.name)}
                  id={`category-card-${category.id}`}
                  className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-emerald-200/20 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full relative overflow-hidden"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-emerald-50/30 rounded-full group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl ${category.color} border flex items-center justify-center p-3.5 mb-5`}>
                      {renderCategoryIcon(category.iconName)}
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold font-display text-slate-800 group-hover:text-[#10b981] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed min-h-[36px]">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3.5 py-1.5 rounded-full">
                      {category.productCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[#10b981] group-hover:underline flex items-center transition-all">
                      Browse catalog &rarr;
                    </span>
                  </div>
                </motion.div>
              ))}

              {filteredCategories.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-16 text-center bg-white rounded-[32px] border border-slate-100 shadow-xl"
                >
                  <p className="text-lg font-bold text-slate-700">No matching categories found</p>
                  <p className="text-sm text-slate-400 mt-1">Try refining your search keyword above or check other sidebar filters.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedSidebarTab('All Categories'); }}
                    className="mt-4 text-xs font-bold text-white bg-[#10b981] py-2.5 px-5 rounded-full hover:bg-[#059669] shadow-lg shadow-emerald-200"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
