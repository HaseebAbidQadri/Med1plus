import { useState } from 'react';
import { Logo } from './Logo';
import { 
  MapPin, Phone, MessageSquare, Menu, X, 
  Lock, LogOut, ShieldCheck, ArrowLeft, Pill, Activity, User
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onWhatsAppClick: () => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onWhatsAppClick, 
  isAdminLoggedIn = false, 
  onLogout 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic nav items helper: 
  // - Clients get clean storefront tabs (hiding administrative links to protect checkout focus)
  // - Active administrators get clean shortcut tabs to Toggle views
  const getNavItems = () => {
    const items = [
      { id: 'home', label: 'Home' },
      { id: 'categories', label: 'Medicines Catalog' },
      { id: 'services', label: 'Our Services' },
      { id: 'about-us', label: 'About Us' },
      { id: 'contact-us', label: 'Contact Us' },
    ];
    
    if (isAdminLoggedIn) {
      items.push({ id: 'admin', label: 'Dashboard Panel' });
    }
    
    return items;
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      
      {/* 1. Dynamic Top Ribbon Announcement Bar based on Context */}
      <div>
        {isAdminLoggedIn ? (
          /* ACTIVE SECURE ADMIN SESSION BANNER */
          <div className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2 text-xs transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-300 flex items-center space-x-1">
                  <span>Logged in as:</span>
                  <span className="text-white font-extrabold flex items-center space-x-1">
                    <User className="w-3 h-3 text-emerald-400 inline" />
                    <span>Dr. Haseeb Ahmed, RPh. (Administrator)</span>
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNavClick('admin')}
                  className={`hover:text-emerald-400 font-bold flex items-center space-x-1 transition-all ${activeTab === 'admin' ? 'text-emerald-400' : 'text-slate-300'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Administrative Control Center</span>
                </button>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <button 
                  onClick={onLogout}
                  className="hover:text-rose-450 text-rose-400 font-bold flex items-center space-x-1 transition-all active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Exit Secure Board</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'admin' ? (
          /* STAFF GATEWAY CONSTRAINED BAR */
          <div className="bg-[#0d5cb5] text-white px-4 py-2 text-xs transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center font-sans">
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-sky-200" />
                <span className="font-extrabold text-sky-100 tracking-wide uppercase text-[10px]">Staff Lock Gate Mode</span>
              </div>
              <button 
                onClick={() => handleNavClick('home')}
                className="bg-white/15 hover:bg-white/25 text-white font-bold px-3 py-1 rounded-lg transition-all text-[11px] flex items-center space-x-1 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Guest Storefront</span>
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD GUEST / DEEP WELLNESS INFORMATION BAR */
          <div className="bg-[#f0fcf6] border-b border-emerald-100/40 text-[#0d5641] px-4 py-2 text-xs hidden sm:block transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center font-sans">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] bg-[#10b981] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">PMDC Certified</span>
                <span className="font-semibold text-emerald-800">Professional pharmaceutical counseling setup is available 24/7.</span>
              </div>
              <button 
                onClick={() => handleNavClick('admin')}
                className="text-slate-600 hover:text-[#10b981] font-bold text-[11px] flex items-center space-x-1 transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#10b981]" />
                <span>Staff Portal Login</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Sticky Menu Core */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Elegant Branding Logo Container */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
              onClick={() => handleNavClick('home')}
              id="logo-container"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-all duration-300">
                <Logo size="md" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl md:text-2xl font-black tracking-tight text-[#0d5cb5] leading-none mb-0.5 font-display flex items-center gap-1.5">
                  MedOne+
                </span>
                <span className="text-[10px] md:text-[11px] font-extrabold tracking-[0.25em] text-[#10b981] uppercase mt-0.5 block leading-none">
                  Pharmacy
                </span>
              </div>
            </div>

            {/* Desktop Navigation Link Cluster */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {activeTab === 'admin' && !isAdminLoggedIn ? (
                <div className="flex items-center space-x-2.5 px-5 py-2 bg-amber-50/75 text-amber-900 rounded-full text-xs font-black tracking-widest uppercase select-none border border-amber-100/40 font-sans">
                  <Lock className="w-4 h-4 text-amber-500 animate-pulse animate-duration-1000" />
                  <span>Authorized Personnel Access Only</span>
                </div>
              ) : (
                navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      id={`nav-item-${item.id}`}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 relative ${
                        isActive
                          ? 'text-[#10b981] bg-emerald-50/40'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#10b981] rounded-full" />
                      )}
                    </button>
                  );
                })
              )}
            </nav>

            {/* Right Activity Block – Dynamic contextual call to actions */}
            <div className="hidden md:flex items-center space-x-3.5">
              
              {activeTab === 'admin' && !isAdminLoggedIn ? (
                /* Static Note to make Portal feel elite and separate */
                <span className="text-[11px] font-black text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-4.5 py-1.5 select-none font-sans">
                  🔒 GUEST MODE RESTRICTED
                </span>
              ) : (
                <>
                  {/* Our Branch Location Tile */}
                  <div className="flex items-center space-x-2.5 bg-slate-50/80 px-4 py-1.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#10b981] flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Branch Lahore</span>
                      <span className="text-xs text-slate-700 font-extrabold leading-tight mt-0.5">Dharampura Bazar</span>
                    </div>
                  </div>

                  {/* Phone Helpline */}
                  <a 
                    href="tel:+923001234567"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-[#10b981] flex items-center justify-center border border-slate-100 transition-all hover:scale-105"
                    title="Call Pharmacist"
                    id="phone-button-header"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </>
              )}

              {/* Primary Call to Action Button */}
              {activeTab === 'admin' && !isAdminLoggedIn ? (
                <button
                  onClick={() => handleNavClick('home')}
                  id="header-back-clinic-btn"
                  className="px-5 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-full font-extrabold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-200 hover:-translate-y-0.5 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Exit Gateway</span>
                </button>
              ) : (
                <button
                  onClick={onWhatsAppClick}
                  id="whatsapp-header-button"
                  className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-full shadow-md hover:shadow-lg hover:shadow-emerald-100 font-extrabold text-xs transition-all duration-300 flex items-center space-x-2 active:scale-95 hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg 
                    className="w-4.5 h-4.5 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp counseling</span>
                </button>
              )}
            </div>

            {/* Mobile Actions Drawer Toggles */}
            <div className="flex md:hidden items-center space-x-2">
              <a 
                href="tel:+923001234567"
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="mobile-menu-toggle"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Responsive Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-5 absolute top-full left-0 right-0 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="space-y-1.5 pb-4">
              
              {/* Dynamic Badge for Mobile Staff previewing */}
              {isAdminLoggedIn && (
                <div className="px-4 py-2 mb-3 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] font-extrabold flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Logged in: Dr. Haseeb Ahmed, RPh.</span>
                </div>
              )}

              {activeTab === 'admin' && !isAdminLoggedIn ? (
                <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl flex flex-col space-y-2 text-center text-xs font-bold text-amber-900 block my-2 font-sans">
                  <Lock className="w-5 h-5 text-amber-500 mx-auto animate-pulse" />
                  <span className="tracking-wider uppercase text-[10px] font-black">Internal Gateway Restricted</span>
                  <p className="text-[11px] text-slate-500 font-normal">This console is reserved exclusively for clinical RPh pharmacists and registered stock operators.</p>
                  <button
                    onClick={() => handleNavClick('home')}
                    className="mt-3.5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-extrabold text-[11px] w-full"
                  >
                    Return to Guest Storefront
                  </button>
                </div>
              ) : (
                <>
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold transition-all ${
                          isActive
                            ? 'bg-[#10b981]/10 text-[#10b981] pl-6'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}

                  {!isAdminLoggedIn && activeTab !== 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold text-slate-400 hover:bg-slate-50 flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Secure Staff Portal</span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 text-left">
              <div className="flex items-center space-x-3 px-4">
                <MapPin className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Branch Location</p>
                  <p className="text-sm text-slate-700 font-extrabold mt-0.5">Dharampura Bazar, Lahore, Pakistan</p>
                </div>
              </div>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-3 bg-rose-50 text-rose-6050 text-rose-600 hover:bg-rose-100 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Administrative Session</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onWhatsAppClick();
                  }}
                  className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-full font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-100"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Get WhatsApp Counseling</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
