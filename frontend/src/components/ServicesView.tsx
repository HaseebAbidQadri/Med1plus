import { 
  Heart, ShoppingBag, Truck, MessageCircle, 
  Activity, Award, ShieldAlert, HeartPulse, UserRound
} from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceItem } from '../types';

interface ServicesViewProps {
  onWhatsAppClick: () => void;
}

export default function ServicesView({ onWhatsAppClick }: ServicesViewProps) {
  
  const services: ServiceItem[] = [
    {
      id: 'prescription',
      title: 'Prescription Medicines',
      description: 'We provide all types of prescription medicines with genuine quality.',
      iconName: 'heart',
      color: 'text-rose-500 bg-rose-50 border-rose-100',
    },
    {
      id: 'delivery',
      title: 'Medicine Home Delivery',
      description: 'Fast and safe delivery of medicines at your doorstep in Lahore.',
      iconName: 'truck',
      color: 'text-amber-500 bg-amber-50 border-amber-100',
    },
    {
      id: 'consultation',
      title: 'Health Consultation',
      description: 'Get expert advice from our pharmacist for your health.',
      iconName: 'consultation',
      color: 'text-blue-500 bg-blue-50 border-blue-100',
    },
    {
      id: 'bp_check',
      title: 'Blood Pressure Checkup',
      description: 'Free BP checkup at our pharmacy. Because your health matters.',
      iconName: 'bp',
      color: 'text-slate-700 bg-slate-100 border-slate-200',
    },
    {
      id: 'diabetes',
      title: 'Diabetes Care',
      description: 'Special care for diabetes patients. We help you manage better.',
      iconName: 'diabetes',
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'wellness',
      title: 'Wellness Products',
      description: 'Vitamins, supplements and wellness essentials for your good health.',
      iconName: 'wellness',
      color: 'text-[#10b981] bg-emerald-50 border-emerald-100',
    },
    {
      id: 'first_aid',
      title: 'First Aid Support',
      description: 'All essential first aid products available at our store.',
      iconName: 'first_aid',
      color: 'text-teal-500 bg-teal-50 border-teal-100',
    },
    {
      id: 'senior_care',
      title: 'Senior Citizen Care',
      description: 'Special attention and support for our senior citizens.',
      iconName: 'senior_care',
      color: 'text-fuchsia-500 bg-fuchsia-50 border-fuchsia-100',
    },
  ];

  const renderServiceIcon = (iconName: string) => {
    const props = { className: "w-8 h-8" };
    switch (iconName) {
      case 'heart': return <HeartPulse {...props} />;
      case 'truck': return <Truck {...props} />;
      case 'consultation': return <MessageCircle {...props} />;
      case 'bp': return <Activity {...props} />;
      case 'diabetes': return <Award {...props} />;
      case 'wellness': return <ShoppingBag {...props} />;
      case 'first_aid': return <ShieldAlert {...props} />;
      case 'senior_care': return <UserRound {...props} />;
      default: return <Heart {...props} />;
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Section Info & Doctor Graphics Layer */}
      <span className="text-xs font-bold tracking-widest text-[#10b981] uppercase block mb-3 animate-pulse">
        Our Services
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        
        {/* Left Side Content Description */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 leading-[1.15]">
            Healthcare <span className="text-[#10b981] relative inline-block">
              Services
              <span className="absolute left-0 bottom-1 w-full h-1.5 bg-emerald-100 rounded-full -z-10" />
            </span> <br />
            We Provide
          </h1>
          <p className="text-base text-slate-500 max-w-xl leading-relaxed">
            We are more than just a pharmacy. We are your dedicated partner in health, providing authentic medicines, on-call health counselors, and specialized testing equipment.
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <span className="h-10 w-1 bg-[#10b981] rounded-full"></span>
            <p className="text-sm font-semibold text-[#0d5cb5] italic">
              "Providing genuine healthcare at your convenient step — Lahore's most trusted choice."
            </p>
          </div>
        </div>

        {/* Right Side Image Graphic Section with Floating Leafs */}
        <div className="lg:col-span-5 relative flex justify-center">
          
          {/* Animated decorative bubble background shapes */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#10b981]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0d5cb5]/5 rounded-full blur-3xl" />

          {/* Pharmacist photo container */}
          <div className="relative w-full max-w-md h-64 md:h-72 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 border border-white/80 group">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=700" 
              alt="Licensed Pharmacist Dispensing Medicine" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Glassmorphism gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">On-Duty Expert</span>
                <span className="text-sm font-bold text-slate-800">Dr. Haseeb Ahmed, RPh</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Active Now
              </span>
            </div>
          </div>

          {/* Floating Leaves Animated */}
          <div className="absolute top-12 -left-4 w-8 h-8 bg-emerald-100/60 rounded-full flex items-center justify-center animate-bounce duration-1000 shadow-sm">
            <span className="text-lg">🍃</span>
          </div>
          <div className="absolute -bottom-4 right-10 w-10 h-10 bg-emerald-100/60 rounded-full flex items-center justify-center animate-pulse shadow-sm">
            <span className="text-xl">🌿</span>
          </div>
        </div>

      </div>

      {/* Services Grid (8 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((service, index) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-emerald-200/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-auto text-left relative overflow-hidden group"
          >
            {/* Soft background hover highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl ${service.color} border flex items-center justify-center p-3 mb-5 group-hover:scale-105 transition-transform`}>
                {renderServiceIcon(service.iconName)}
              </div>

              <h3 className="text-base sm:text-lg font-bold font-display text-slate-800 group-hover:text-[#10b981] transition-colors leading-snug">
                {service.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 relative z-10">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-[#10b981] transition-colors flex items-center">
                Learn more <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Help Banner */}
      <div className="bg-emerald-50 rounded-[32px] p-7 border border-emerald-100/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-100/30" id="services-bottom-banner">
        <div className="flex items-center space-x-4 text-left">
          <div className="w-12 h-12 bg-[#10b981] text-white rounded-full flex items-center justify-center animate-pulse shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-800">Need Special Assistance?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Talk to our registered pharmacist for specialized dosage or substitutions.</p>
          </div>
        </div>

        <button
          onClick={onWhatsAppClick}
          id="whatsapp-services-banner-button"
          className="w-full md:w-auto px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all duration-300 flex items-center justify-center space-x-2 shrink-0 hover:-translate-y-0.5"
        >
          <span>Chat on WhatsApp</span>
        </button>
      </div>

    </div>
  );
}
