import { useState, useEffect } from 'react';
import Header from './components/Header';
import { Logo } from './components/Logo';
import HomeOverview from './components/HomeOverview';
import CategoriesView from './components/CategoriesView';
import ServicesView from './components/ServicesView';
import AboutUsView from './components/AboutUsView';
import ContactUsView from './components/ContactUsView';
import AdminSignIn from './components/AdminSignIn';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Pill, Truck, ShieldCheck,
  MapPin, Clock, MessageSquare, Sparkles, ArrowRight,
  Search, Lock, Phone, Upload, ChevronLeft, ChevronRight, Users, Smile, Award, Check, ShoppingCart, UserCheck, ShieldAlert, BadgeCheck, FileText, CheckCircle2, ChevronDown
} from 'lucide-react';
import { CONTACT_CONFIG } from './constants';
import { apiUrl } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Medicines loaded from database on mount via useEffect below
  const [medicines, setMedicines] = useState<{ id: string; name: string; price: number; imgGradient: string; category: string; stock: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon'; imgUrl: string }[]>([]);

  // Orders loaded from database on mount via useEffect below
  const [orders, setOrders] = useState<{ id: string; customerName: string; createdAt: string; items: string; total: number; status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled' }[]>([]);

  // Fetch medicines, checkout orders, and verify admin session state on component mount
  useEffect(() => {
    fetch(apiUrl('/api/settings'))
      .then(res => res.json())
      .then(settings => {
        for (const [key, value] of Object.entries(settings)) {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        }
      })
      .catch(err => console.error('Error fetching settings/custom images from backend:', err));

    fetch(apiUrl('/api/medicines'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          console.log('App fetch first medicine:', data[0]);
          setMedicines(data);
        }
      })
      .catch(err => console.error('Error fetching clinical medicines list from backend:', err));

    fetch(apiUrl('/api/orders'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(err => console.error('Error fetching patient checkout orders list from backend:', err));

    const token = localStorage.getItem('medone_admin_token');
    if (token) {
      fetch(apiUrl('/api/auth/verify'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Verification failed');
        })
        .then(data => {
          if (data.verified) {
            setIsAdminLoggedIn(true);
          } else {
            localStorage.removeItem('medone_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('medone_admin_token');
        });
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('medone_admin_token');
    if (token) {
      fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(err => console.error('Backend logout sync error:', err));
    }
    localStorage.removeItem('medone_admin_token');
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  // Quick WhatsApp helper
  const handleWhatsAppTrigger = () => {
    window.open(CONTACT_CONFIG.whatsappUrl(), '_blank');
  };

  const handleVisitStore = () => {
    setActiveTab('contact-us');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const handleAddToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((c) => c.id !== id));
    } else {
      setCart((prevCart) => prevCart.map((c) => c.id === id ? { ...c, quantity } : c));
    }
  };

  const cartTotal = cart.reduce((acc, c) => acc + c.price * c.quantity, 0);
  const cartItemCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  const handleWhatsAppCheckout = () => {
    const listString = cart.map(c => `• ${c.quantity}x ${c.name} (PKR ${c.price * c.quantity})`).join('\n');
    const itemsDescription = cart.map(c => `${c.quantity}x ${c.name}`).join(', ');
    const msg = `Assalamu Alaikum MedOne+ Pharmacy / Naveed Akhtar. I would like to place an order from your website:\n\n${listString}\n\n*Total Amount: PKR ${cartTotal}*\n\nPlease confirm availability and details. Thank you!`;

    // Create checkout order on backend
    const orderPayload = {
      customerName: 'Guest Customer (Web Checkout)',
      items: itemsDescription,
      total: cartTotal,
      itemsList: cart.map(c => ({ id: c.id, quantity: c.quantity }))
    };

    fetch(apiUrl('/api/orders'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Sync with server's updated records
          setOrders(prev => [data.order, ...prev]);
          setMedicines(data.updatedMedicines);
        }
      })
      .catch(err => {
        console.error('Checkout sync failed, falling back to client-side emulation:', err);
        const newOrder = {
          id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
          customerName: 'Guest Customer (Web Checkout)',
          createdAt: 'Just now',
          items: itemsDescription,
          total: cartTotal,
          status: 'Pending' as const
        };
        setOrders(prev => [newOrder, ...prev]);

        setMedicines(prevMeds => prevMeds.map(med => {
          const cartItem = cart.find(c => c.id === med.id);
          if (cartItem) {
            const remainingStock = Math.max(0, med.stock - cartItem.quantity);
            let calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon' = 'In Stock';
            if (remainingStock === 0) calculatedStatus = 'Out of Stock';
            else if (remainingStock <= 25) calculatedStatus = 'Low Stock';
            return { ...med, stock: remainingStock, status: calculatedStatus };
          }
          return med;
        }));
      });

    // Reset shopping cart
    setCart([]);
    setCartOpen(false);

    const encryptedMsg = encodeURIComponent(msg);
    window.open(CONTACT_CONFIG.whatsappUrl(msg), '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans">

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onWhatsAppClick={handleWhatsAppTrigger}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Core View Area with beautiful Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && (
              <HomeOverview
                onBrowseCatalog={() => {
                  setActiveTab('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreServices={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onVisitAbout={() => {
                  setActiveTab('about-us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onWhatsAppClick={handleWhatsAppTrigger}
                onAddToCart={handleAddToCart}
                cartItems={cart}
                medicinesList={medicines}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesView
                medicinesList={medicines}
                onAddToCart={handleAddToCart}
                cartItems={cart}
              />
            )}

            {activeTab === 'services' && (
              <ServicesView onWhatsAppClick={handleWhatsAppTrigger} />
            )}

            {activeTab === 'about-us' && (
              <AboutUsView onVisitStoreClick={handleVisitStore} />
            )}

            {activeTab === 'contact-us' && (
              <ContactUsView onWhatsAppClick={handleWhatsAppTrigger} />
            )}

            {activeTab === 'admin' && (
              isAdminLoggedIn ? (
                <AdminDashboard
                  onLogout={handleLogout}
                  medicinesList={medicines}
                  setMedicinesList={setMedicines}
                  ordersList={orders}
                  setOrdersList={setOrders}
                />
              ) : (
                <AdminSignIn onLoginSuccess={() => setIsAdminLoggedIn(true)} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Cart Launcher Button */}
      {cartItemCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-26 right-6 z-40 bg-[#0d5cb5] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-[#0b4da0] transition-all hover:scale-110 flex items-center justify-center space-x-2 border border-blue-400/20 cursor-pointer"
          id="cart-launcher-btn"
        >
          <div className="relative">
            <ShoppingCart className="w-5.5 h-5.5" />
            <span className="absolute -top-3.5 -right-3.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white min-w-5 h-5 flex items-center justify-center animate-pulse">
              {cartItemCount}
            </span>
          </div>
          <span className="text-xs font-bold font-sans">Cart (PKR {cartTotal})</span>
        </button>
      )}

      {/* Slide-out Cart Drawer Panel */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full border-l border-slate-100"
              id="cart-drawer-container"
            >
              <div className="bg-[#0d5cb5] p-5 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base tracking-tight leading-snug">Your Order Cart</h4>
                    <p className="text-[10px] text-sky-200">Review medicines for MedOne+ dispatch</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCart([])}
                    className="p-1.5 px-3 bg-rose-500/20 hover:bg-rose-500/40 text-rose-100 font-bold rounded-lg transition-all text-[10px] flex items-center space-x-1 border border-rose-500/30"
                  >
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition-all text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-12">
                    <Pill className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-500 font-display">Your cart is empty</p>
                    <p className="text-xs text-slate-400 max-w-[240px] mt-1">Select from our featured medicines and they will appear here instantly!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-left max-w-[60%]">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-800">{item.name}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">PKR {item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-slate-50 text-slate-500 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-slate-50 text-slate-500 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-[#0d5cb5] w-16 text-right">
                          PKR {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order Subtotal</span>
                    <span className="text-lg font-black text-[#0d5cb5]">PKR {cartTotal}</span>
                  </div>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center space-x-2.5 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>Send Order via WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-3 leading-normal">
                    *Our certified pharmacist on-duty will verify product availability, check batch expirations, and arrange doorstep delivery within Lahore.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Persistent Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-850 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                  <Logo size="sm" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-[#10b981] block">MedOne<span className="text-[#0d5cb5]">+</span></span>
                  <span className="text-[9px] tracking-[0.25em] text-[#0d5cb5] font-bold block uppercase">PHARMACY</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Licensed healthcare supplier in Dharampura Bazar, Lahore. Distributing 100% genuine prescriptions, life-saving medicines, and health monitoring equipment with supreme cold-chain safety.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider text-slate-200 mb-4 uppercase">Direct Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('categories')} className="hover:text-[#10b981] transition-colors cursor-pointer">Catalog Categories</button></li>
                <li><button onClick={() => setActiveTab('services')} className="hover:text-[#10b981] transition-colors cursor-pointer">Healthcare Services</button></li>
                <li><button onClick={() => setActiveTab('about-us')} className="hover:text-[#10b981] transition-colors cursor-pointer">About our Team</button></li>
                <li><button onClick={() => setActiveTab('contact-us')} className="hover:text-[#10b981] transition-colors cursor-pointer">Contact & Directions</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider text-slate-200 mb-4 uppercase">Support Desk</h4>
              <p className="text-xs text-slate-400">{CONTACT_CONFIG.address}</p>
              <p className="text-xs text-slate-300 font-bold mt-2">{CONTACT_CONFIG.phone}</p>
              <p className="text-[10px] text-emerald-400 mt-2 flex items-center">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-ping" />
                Specialist On-Call Fulfillments
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} MedOne+ Pharmacy. All rights reserved.</p>
            <p className="flex items-center space-x-2">
              <span className="bg-emerald-500/15 text-[#10b981] px-2.5 py-1 rounded-full text-[10px] font-bold">DRAP Reg: #LHR-990-2</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#0d5cb5] font-semibold">100% Genuine Guaranteed</span>
            </p>
          </div>
        </div>
      </footer>


    </div>
  );
}


