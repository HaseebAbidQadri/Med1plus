import { useState, useEffect } from 'react';
import { CheckCircle2, Users, Pill, MapPin, Smile, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutUsViewProps {
  onVisitStoreClick: () => void;
}

export default function AboutUsView({ onVisitStoreClick }: AboutUsViewProps) {
  const [storefrontImg, setStorefrontImg] = useState<string>("https://images.unsplash.com/photo-1607619056574-7b8d304b3b86?auto=format&fit=crop&q=80&w=600");
  const [shelvesImg, setShelvesImg] = useState<string>("https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400");
  const [vitaminsImg, setVitaminsImg] = useState<string>("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400");
  const [pharmacistImg, setPharmacistImg] = useState<string>("https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400");
  const [waitingImg, setWaitingImg] = useState<string>("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400");

  useEffect(() => {
    const customStorefront = localStorage.getItem('medone_custom_image_storefront');
    const customShelves = localStorage.getItem('medone_custom_image_shelves');
    const customVitamins = localStorage.getItem('medone_custom_image_vitamins');
    const customPharmacist = localStorage.getItem('medone_custom_image_pharmacist');
    const customWaiting = localStorage.getItem('medone_custom_image_waiting');

    if (customStorefront) setStorefrontImg(customStorefront);
    if (customShelves) setShelvesImg(customShelves);
    if (customVitamins) setVitaminsImg(customVitamins);
    if (customPharmacist) setPharmacistImg(customPharmacist);
    if (customWaiting) setWaitingImg(customWaiting);
  }, []);
  
  const stats = [
    {
      id: 'customers',
      value: '5000+',
      label: 'Happy Customers',
      icon: <Users className="w-6 h-6 text-[#10b981]" />,
    },
    {
      id: 'medicines',
      value: '1000+',
      label: 'Medicines Available',
      icon: <Pill className="w-6 h-6 text-[#10b981]" />,
    },
    {
      id: 'branches',
      value: '1',
      label: 'Branch in Lahore',
      icon: <MapPin className="w-6 h-6 text-[#10b981]" />,
    },
    {
      id: 'satisfaction',
      value: '100%',
      label: 'Customer Satisfaction',
      icon: <Smile className="w-6 h-6 text-[#10b981]" />,
    },
  ];

  const checkmarks = [
    'Licensed & Registered Pharmacy',
    '100% Genuine Medicines',
    'Serving the Community with Trust',
    'Expert Pharmacist Support',
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb Info Label */}
      <span className="text-xs font-bold tracking-widest text-[#10b981] uppercase block mb-3 animate-pulse">
        About Us
      </span>

      {/* Hero Section Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        {/* Left Hand Text Info Block */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-5 text-left">
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 leading-[1.15]">
            Your Trusted Pharmacy <br />
            In <span className="text-[#10b981] relative inline-block">
              Lahore
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-emerald-100 -skew-x-12 rounded-full -z-10" />
            </span>
          </h1>
          
          <p className="text-base text-slate-500 leading-relaxed">
            MedOne+ Pharmacy is committed to providing genuine medicines, quality healthcare products, and exceptional customer care to the community. Every pharmaceutical item passes through safe batch verification and strict cold-chain maintenance guidelines.
          </p>

          {/* List layout of verified highlights */}
          <div className="space-y-3.5 pt-2">
            {checkmarks.map((check, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-700">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-50 text-[#10b981] rounded-full flex items-center justify-center border border-emerald-100/50">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{check}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={onVisitStoreClick}
              id="visit-store-about-button"
              className="px-6 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-200 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center hover:-translate-y-0.5 active:scale-95"
            >
              <span>Visit Our Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Hand Bento Picture Collage Grid */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="grid grid-cols-12 gap-4 h-[440px]">
            
            {/* 1. Storefront pharmacy display (Top Left, 7 cols) */}
            <div className="col-span-7 h-56 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group relative">
              <img 
                src={storefrontImg} 
                alt="MedOne+ Pharmacy modern entrance shelf" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">MedOne+</span>
                <span className="text-xs font-bold text-white">Advanced Medical Storefront</span>
              </div>
            </div>

            {/* 2. Organized medicine boxes packages (Top Right, 5 cols) */}
            <div className="col-span-5 h-56 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group relative">
              <img 
                src={shelvesImg} 
                alt="Neat stacked pills packaging" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 flex flex-col text-left">
                <span className="text-xs font-bold text-white">Genuine Stock Only</span>
              </div>
            </div>

            {/* 3. Product Display Shelf (Bottom Left, 3 cols) */}
            <div className="col-span-3 h-[180px] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group hidden sm:block relative">
              <img 
                src={vitaminsImg} 
                alt="Dermatological skincare bottles" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-3 text-left">
                <span className="text-[10px] font-bold text-white leading-tight block">Clinical Standards</span>
              </div>
            </div>

            {/* 4. Smiling Pharmacist professional man (Bottom Middle, 5 cols or 6 cols) */}
            <div className="col-span-6 sm:col-span-5 h-[180px] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group relative">
              <img 
                src={pharmacistImg} 
                alt="Lead Pharmacist at MedOne+" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-400">RPh Specialist</span>
                <span className="text-xs font-bold text-white block">Dr. Haseeb Ahmed</span>
              </div>
            </div>

            {/* 5. Cozy Clinic Waiting Lounge (Bottom Right, 6 cols or 4 cols) */}
            <div className="col-span-6 sm:col-span-4 h-[180px] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 group relative">
              <img 
                src={waitingImg} 
                alt="Cozy clinical interior counter" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4 text-left">
                <span className="text-xs font-bold text-white block">Comfort Waiting Room</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Counter Statistics Banner Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            id={`stat-card-${stat.id}`}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/35 flex items-center space-x-4 hover:shadow-2xl transition-all duration-300 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 group-hover:scale-105 transition-transform">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black font-display text-slate-800 leading-tight">
                {stat.value}
              </span>
              <span className="text-[11px] md:text-xs text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
