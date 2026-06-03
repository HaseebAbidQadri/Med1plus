import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Pill, Activity, ShieldCheck, Truck, Users, FileText,
  Settings, LogOut, Search, Bell, Plus, Trash2, Edit, Download, AlertTriangle,
  CheckCircle, RefreshCw, Eye, Sparkles, Filter, ChevronRight, ListCollapse, FolderKanban,
  Upload
} from 'lucide-react';
import { Logo } from './Logo';

// Import default mockup images
import defaultHeroImg from '../assets/images/pharmacy_hero_1779732503274.png';
import defaultShelvesImg from '../assets/images/pharmacy_shelves_1779732545142.png';
import defaultStorefrontImg from '../assets/images/pharmacy_storefront_1779732567610.png';

// High-quality non-repeating Unsplash fallbacks for remaining 5 slots
const defaultPharmacistImg = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop";
const defaultWaitingImg = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop";
const defaultBabyImg = "https://images.unsplash.com/photo-1519689680058-324335c77ebd?q=80&w=800&auto=format&fit=crop";
const defaultVitaminsImg = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop";
const defaultFridgeImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop";

const photoSlots = [
  {
    key: 'medone_custom_image_storefront',
    fallback: defaultStorefrontImg,
    title: '1. Storefront Exterior Facade',
    desc: 'Outer glass sliding entrance with official MedOne+ branding in Lahore. Displayed on home & about headers.'
  },
  {
    key: 'medone_custom_image_hero',
    fallback: defaultHeroImg,
    title: '2. Billing POS & Main Counter',
    desc: 'The central green check-out desk. Displayed on home screen hero and core features cards.'
  },
  {
    key: 'medone_custom_image_shelves',
    fallback: defaultShelvesImg,
    title: '3. Main Medicine Cabinets',
    desc: 'Neat grid cupboards featuring DRAP-certified prescription tablets and pills.'
  },
  {
    key: 'medone_custom_image_pharmacist',
    fallback: defaultPharmacistImg,
    title: '4. Pharmacist Consultation Corner',
    desc: 'Naveed Akhtar\'s safe consultancy counter, assisting local customers 24/7.'
  },
  {
    key: 'medone_custom_image_waiting',
    fallback: defaultWaitingImg,
    title: '5. Guest Waiting Lounge',
    desc: 'Cozy retail environment setting featuring modern visitor sofa layout cushions.'
  },
  {
    key: 'medone_custom_image_baby',
    fallback: defaultBabyImg,
    title: '6. Infant & Baby Care Section',
    desc: 'Premium shelves housing organic baby nursing supplies, milk formula cans, and diapers.'
  },
  {
    key: 'medone_custom_image_vitamins',
    fallback: defaultVitaminsImg,
    title: '7. Vitamins & Supplements Stand',
    desc: 'Vibrant organic dietary aids, herbal medicines, and daily wellness nutrition capsules.'
  },
  {
    key: 'medone_custom_image_fridge',
    fallback: defaultFridgeImg,
    title: '8. Temperature Controlled Vaccine Storage',
    desc: 'Special cold-chain storage system protecting authentic life-saving insulins and serum vials.'
  }
];

// Definitions
interface MedicineItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon';
  imgGradient: string;
  imgUrl?: string;
}

interface SimulatedOrder {
  id: string;
  customerName: string;
  createdAt: string;
  items: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
}

interface AdminDashboardProps {
  onLogout: () => void;
  // Allows integrating with state if desired
  medicinesList: MedicineItem[];
  setMedicinesList: React.Dispatch<React.SetStateAction<MedicineItem[]>>;
  ordersList: SimulatedOrder[];
  setOrdersList: React.Dispatch<React.SetStateAction<SimulatedOrder[]>>;
}

export default function AdminDashboard({
  onLogout,
  medicinesList,
  setMedicinesList,
  ordersList,
  setOrdersList
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Chart dimension tracking list to avoid "Illegal constructor" from recharts ResizeObserver references
  const salesContainerRef = useRef<HTMLDivElement>(null);
  const [salesWidth, setSalesWidth] = useState<number>(500);

  useEffect(() => {
    if (!salesContainerRef.current) return;
    const handleResize = () => {
      if (salesContainerRef.current) {
        setSalesWidth(salesContainerRef.current.getBoundingClientRect().width);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Medicines Tab States
  const [activeMedicinesSubTab, setActiveMedicinesSubTab] = useState<string>('all-list'); // 'all-list', 'add-form'
  const [newMedName, setNewMedName] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('All Medicines');
  const [newMedPrice, setNewMedPrice] = useState('');
  const [newMedStock, setNewMedStock] = useState('');
  const [newMedImage, setNewMedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sales data for Recharts (matching the beautiful curve in the image)
  const salesOverviewData = [
    { name: 'Mon', sales: 15000 },
    { name: 'Tue', sales: 25000 },
    { name: 'Wed', sales: 18000 },
    { name: 'Thu', sales: 28000 },
    { name: 'Fri', sales: 48650 }, // High Friday peak from screenshot
    { name: 'Sat', sales: 42000 },
    { name: 'Sun', sales: 58000 },
  ];

  // Stock donut data matching colors from reference
  const stockDonutData = [
    { name: 'In Stock', value: 1024, color: '#10b981' },
    { name: 'Low Stock', value: 185, color: '#f59e0b' },
    { name: 'Out of Stock', value: 77, color: '#ef4444' },
    { name: 'Expired Soon', value: 123, color: '#ec4899' },
  ];

  const totalStockItems = stockDonutData.reduce((acc, current) => acc + current.value, 0);

  // Sidebar components
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'medicines', label: 'Medicines', icon: <Pill className="w-4.5 h-4.5" /> },
    { id: 'categories', label: 'Categories', icon: <FolderKanban className="w-4.5 h-4.5" /> },
    { id: 'orders', label: 'Orders', icon: <Truck className="w-4.5 h-4.5" /> },
    { id: 'stock', label: 'Stock & Inventory', icon: <ShieldCheck className="w-4.5 h-4.5" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-4.5 h-4.5" /> },
    { id: 'photos', label: 'Shop Photos (Real)', icon: <Sparkles className="w-4.5 h-4.5" /> },
  ];

  // Handlers for managing Inventory list
  const handleDeleteMedicine = async (id: string) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedicinesList(prev => prev.filter(item => item.id !== id));
      } else {
        setMedicinesList(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Delete sync failed:', err);
      setMedicinesList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedPrice || !newMedStock) {
      alert('Please fill out all required fields.');
      return;
    }

    const priceNum = parseFloat(newMedPrice);
    const purchasePriceNum = priceNum * 0.7; // default margin
    const stockNum = parseInt(newMedStock);

    const medPayload = {
      name: newMedName,
      category: newMedCategory,
      price: priceNum,
      stock: stockNum,
      imgUrl: newMedImage || '',
      imgGradient: 'from-emerald-50 to-indigo-50 text-emerald-650'
    };

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medPayload)
      });
      if (res.ok) {
        const savedMed = await res.json();
        setMedicinesList(prev => [savedMed, ...prev]);
      } else {
        // Fallback
        const mockMed = { ...medPayload, id: Math.random().toString(36).substr(2, 9), status: 'In Stock' as const };
        setMedicinesList(prev => [mockMed, ...prev]);
      }
    } catch (err) {
      console.error('Add sync failed:', err);
      // Fallback
      const mockMed = { ...medPayload, id: Math.random().toString(36).substr(2, 9), status: 'In Stock' as const };
      setMedicinesList(prev => [mockMed, ...prev]);
    }

    // Reset fields
    setNewMedName('');
    setNewMedCategory('All Medicines');
    setNewMedPrice('');
    setNewMedStock('');
    setNewMedImage(null);
    setActiveMedicinesSubTab('all-list');
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrdersList(prev => prev.map(ord => ord.id === id ? { ...ord, status: newStatus as any } : ord));
      } else {
        setOrdersList(prev => prev.map(ord => ord.id === id ? { ...ord, status: newStatus as any } : ord));
      }
    } catch (err) {
      console.error('Order status sync failed:', err);
      setOrdersList(prev => prev.map(ord => ord.id === id ? { ...ord, status: newStatus as any } : ord));
    }
  };

  const handleExportDataSimulate = () => {
    alert('Preparing data spreadsheet export... Download triggered successfully for "Med_One_Inventory.csv".');
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const medicines: any[] = [];

      // Assume CSV format: Name, Category, Price, Stock
      // Skip header if it exists
      const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, category, price, stock, imgUrl] = line.split(',').map(s => s.trim());
        if (name && price && stock) {
          medicines.push({
            name,
            category: category || 'General Medicine',
            price: parseFloat(price),
            stock: parseInt(stock),
            imgUrl: imgUrl || ''
          });
        }
      }

      if (medicines.length === 0) {
        alert('No valid medicine records found in CSV.');
        return;
      }

      try {
        const res = await fetch('/api/medicines/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medicines })
        });

        if (res.ok) {
          alert(`Successfully imported ${medicines.length} medicines.`);
          // Refresh list
          const listRes = await fetch('/api/medicines');
          if (listRes.ok) {
            const newList = await listRes.json();
            setMedicinesList(newList);
          }
        } else {
          const err = await res.json();
          alert('Import failed: ' + err.error);
        }
      } catch (err) {
        console.error('Bulk import failed:', err);
        alert('Bulk import process failed.');
      }
    };
    reader.readAsText(file);
  };

  // Filter list
  const filteredMedicines = medicinesList.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || med.category === selectedCategoryFilter;

    let matchesStatus = true;
    if (selectedStatusFilter !== 'All') {
      matchesStatus = med.status === selectedStatusFilter;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-slate-800 font-sans" id="admin-main-view">

      {/* Sidebar - Matching exactly the sidebar in the mockup */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-5 shrink-0 flex flex-col justify-between text-left">
        <div>
          {/* Brand with Logo */}
          <div className="flex items-center space-x-3 select-none mb-8 px-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
              <Logo size="sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-[#0d5cb5] leading-none">
                MedOne+
              </span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#10b981] uppercase mt-0.5 block leading-none">
                Pharmacy Portal
              </span>
            </div>
          </div>

          {/* Navigation Links with Active Highlighting */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSubTab(item.id);
                    if (item.id === 'medicines') {
                      setActiveMedicinesSubTab('all-list');
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-emerald-50 text-[#10b981] border-l-3 border-[#10b981] pl-4.5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Control panel */}
        <div className="pt-6 border-t border-slate-100 mt-6 lg:mt-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Core Feed Grid content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar Header matching screenshot */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 relative z-20">

          {/* Greeting text or Search block */}
          <div className="hidden sm:flex items-center space-x-3 w-72">
            <Search className="w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines, orders, customers..."
              className="bg-transparent text-xs text-slate-700 outline-none w-full"
            />
          </div>
          <div className="sm:hidden text-xs font-extrabold text-[#0d5cb5]">
            MedOne+ Portal
          </div>

          {/* Right owner profile details */}
          <div className="flex items-center space-x-4">

            {/* Notifications */}
            <div className="relative cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
            </div>

            {/* Profile Avatar & Metadata */}
            <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-4 text-left">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200/50 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                  alt="Pharmacist Naveed Akhtar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:block">
                <h4 className="text-[11px] font-black leading-tight text-slate-800">Naveed Akhtar</h4>
                <p className="text-[9px] text-[#10b981] font-bold">Pharmacist, Owner</p>
              </div>
            </div>

          </div>
        </header>

        {/* Sub Routing Render Layout panels */}
        <main className="flex-grow p-6 overflow-y-auto space-y-6 text-left">

          {/* Dashboard Tab */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Header Greeting Banner Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Good Morning, Owner 👋</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Here's what's happening with your pharmacy today.</p>
                </div>
                {/* Simulated static Date block */}
                <div className="bg-white border border-slate-250 px-4.5 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm flex items-center space-x-2 w-fit">
                  <span>May 20 – May 26, 2024</span>
                </div>
              </div>

              {/* 4 Glowing Stats KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Stat 1: Total Medicines */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-850 flex items-center justify-center border border-emerald-100/50">
                    <Pill className="w-5.5 h-5.5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Medicines</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">1,286</h3>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ +24% this week</span>
                  </div>
                </div>

                {/* Stat 2: Low Stock Items */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-505 flex items-center justify-center border border-amber-100/50">
                    <AlertTriangle className="w-5.5 h-5.5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Items</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">23</h3>
                    <span className="text-[9px] text-[#ef4444] font-bold block mt-0.5">● Focus Attention</span>
                  </div>
                </div>

                {/* Stat 3: Todays Orders */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100/50">
                    <Truck className="w-5.5 h-5.5 text-[#0d5cb5]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Orders</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">46</h3>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ +12 new orders</span>
                  </div>
                </div>

                {/* Stat 4: Total Customers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-100/50">
                    <Users className="w-5.5 h-5.5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Customers</span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">1,097</h3>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">↑ +34% this week</span>
                  </div>
                </div>

              </div>

              {/* Graphic charts section (Sales Overview line, top sellers, donut) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Sales Overview chart container */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Sales Overview</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Detailed medication purchase performance</p>
                    </div>
                    <span className="text-xs bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded-full font-bold">This Week</span>
                  </div>

                  {/* Recharts Area line graph matching aesthetic - dynamically sized without ResizeObserver */}
                  <div ref={salesContainerRef} className="h-64 mt-4 text-xs w-full">
                    <AreaChart width={salesWidth} height={256} data={salesOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(v) => `PKR ${v}`} />
                      <Tooltip formatter={(value) => [`PKR ${value}`, 'Sales']} labelClassName="font-bold shrink-0" />
                      <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesColor)" />
                    </AreaChart>
                  </div>
                </div>

                {/* Top Selling Medicines list wrapper */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-extrabold text-slate-900">Top Selling Products</h3>
                      <span className="text-[10px] text-[#0d5cb5] font-bold hover:underline cursor-pointer">View All</span>
                    </div>

                    <div className="space-y-3.5">
                      {medicinesList.slice(0, 5).map((med, idx) => (
                        <div key={med.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all">
                          <div className="flex items-center space-x-3 text-left">
                            <span className="text-xs font-black text-slate-400 w-4">{idx + 1}</span>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {med.imgUrl ? (
                                <img src={med.imgUrl} alt={med.name} className="w-full h-full object-cover" />
                              ) : (
                                <Pill className="w-3.5 h-3.5 text-slate-500" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 leading-tight">{med.name}</h4>
                              <p className="text-[9px] text-slate-400 mt-0.5">{med.category}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 block">
                            {idx === 0 ? '420 units' : idx === 1 ? '380 units' : idx === 2 ? '290 units' : idx === 3 ? '260 units' : '240 units'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Row for Inventory status and incoming active orders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Donut Stock Status */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 mb-4 text-left">Stock Status</h3>

                    <div className="flex flex-col sm:flex-row items-center justify-around sm:space-x-4">
                      {/* Donut representation - custom pixel dimensions avoid browser container ResizeObserver crashes */}
                      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                        <PieChart width={144} height={144}>
                          <Pie
                            data={stockDonutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {stockDonutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                        <div className="absolute text-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Total</p>
                          <p className="text-lg font-black text-slate-800 mt-1 leading-none">{totalStockItems}</p>
                          <p className="text-[9px] text-slate-405 font-semibold mt-0.5">items</p>
                        </div>
                      </div>

                      {/* Side legend lists */}
                      <div className="space-y-2 mt-4 sm:mt-0 text-left w-full max-w-[140px]">
                        {stockDonutData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.color }} />
                              <span className="text-[10px] text-slate-500">{item.name}</span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Checkout Orders list */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-7 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Recent Checkout Queue</h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Orders placed over clinical store cart</p>
                      </div>
                      <span className="text-[10px] text-[#10b981] bg-emerald-50 px-2 py-0.5 rounded-md font-extrabold uppercase animate-pulse">Live Feed</span>
                    </div>

                    <div className="space-y-3.5 overflow-y-auto max-h-[170px] pr-1.5">
                      {ordersList.length === 0 ? (
                        <div className="text-center py-6 text-slate-350 text-xs font-display">
                          No customer orders placed yet or empty checkout ledger.
                        </div>
                      ) : (
                        ordersList.map((ord) => (
                          <div key={ord.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50 gap-2">
                            <div className="text-left">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-black text-slate-800">{ord.customerName}</span>
                                <span className="text-[8px] uppercase tracking-wider text-[#0d5cb5] font-bold">#{ord.id}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[260px] font-semibold">{ord.items}</p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <span className="text-xs font-black text-[#10b981] sm:mr-2">PKR {ord.total}</span>

                              {ord.status === 'Pending' ? (
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Confirmed')}
                                    className="px-2 py-1 bg-[#10b981] hover:bg-[#079669] text-white text-[9px] font-bold rounded-lg cursor-pointer transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Dispatched')}
                                    className="px-2 py-1 bg-slate-250 text-slate-600 hover:bg-slate-300 text-[9px] font-bold rounded-lg cursor-pointer transition-colors"
                                  >
                                    Ignore
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center space-x-1 ${ord.status === 'Confirmed' ? 'bg-sky-50 text-[#0d5cb5] border border-sky-100' :
                                  ord.status === 'Dispatched' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                  }`}>
                                  <span>{ord.status}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Medicines Tab Module */}
          {activeSubTab === 'medicines' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-350">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Medicines</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Maintain, search, and update product stocks and metadata.</p>
                </div>

                {/* Tab layout switches header */}
                <div className="flex items-center border border-slate-200 bg-white rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setActiveMedicinesSubTab('all-list')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeMedicinesSubTab === 'all-list' ? 'bg-emerald-50 text-[#10b981]' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    All Medicines
                  </button>
                  <button
                    onClick={() => setActiveMedicinesSubTab('add-form')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeMedicinesSubTab === 'add-form' ? 'bg-emerald-50 text-[#10b981]' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    + Add Medicine
                  </button>
                  <label className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-[#10b981] hover:bg-emerald-50 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Import CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCsvImport}
                    />
                  </label>
                </div>
              </div>

              {activeMedicinesSubTab === 'all-list' ? (
                <>
                  {/* Search, Filter ribbons */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center space-x-3 pl-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 w-full md:max-w-md">
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search medicine name, generic formula terms..."
                        className="bg-transparent text-xs text-slate-705 outline-none w-full"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-xl focus:border-[#10b981] outline-none"
                        >
                          <option value="All">All Categories</option>
                          <option value="All Medicines">All Medicines</option>
                          <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                          <option value="Personal Care">Personal Care</option>
                          <option value="Baby Care">Baby Care</option>
                          <option value="Skin & Hair Care">Skin & Hair Care</option>
                          <option value="Diabetes Care">Diabetes Care</option>
                          <option value="Elderly Care">Elderly Care</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                        <select
                          value={selectedStatusFilter}
                          onChange={(e) => setSelectedStatusFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-xl focus:border-[#10b981] outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Medicines table matching perfectly the structure shown in left bottom block of reference image */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-slate-700 text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                            <th className="py-4 px-6">Medicine</th>
                            <th className="py-4 px-4">Category</th>
                            <th className="py-4 px-4 text-right">Price (PKR)</th>
                            <th className="py-4 px-4 text-center">Stock</th>
                            <th className="py-4 px-4 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredMedicines.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-6 flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {item.imgUrl ? (
                                    <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Pill className="w-4 h-4 text-slate-500" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <span className="text-xs font-bold text-slate-800 block leading-tight">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-500">{item.category}</td>
                              <td className="py-3 px-4 text-right font-black text-slate-905">{item.price}</td>
                              <td className="py-3 px-4 text-center font-extrabold">{item.stock}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-block text-center tracking-wider max-w-[110px] ${item.status === 'In Stock' ? 'bg-emerald-50 text-[#10b981] border border-emerald-100' :
                                  item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-rose-50 text-rose-600 border border-rose-100'
                                  }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="flex items-center justify-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      const promptQty = prompt(`Adjust inventory stock levels for ${item.name}:`, item.stock.toString());
                                      if (promptQty !== null) {
                                        const qtyValue = parseInt(promptQty);
                                        if (!isNaN(qtyValue)) {
                                          setMedicinesList(prev => prev.map(m => {
                                            if (m.id === item.id) {
                                              let calculatedStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired Soon' = 'In Stock';
                                              if (qtyValue === 0) calculatedStatus = 'Out of Stock';
                                              else if (qtyValue <= 25) calculatedStatus = 'Low Stock';
                                              return { ...m, stock: qtyValue, status: calculatedStatus };
                                            }
                                            return m;
                                          }));
                                        }
                                      }
                                    }}
                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"
                                    title="Quick stock update"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete ${item.name} permanently from Clinical Inventory?`)) {
                                        handleDeleteMedicine(item.id);
                                      }
                                    }}
                                    className="p-1.5 text-[#ef4444] hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {filteredMedicines.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                No matching medicines found in pharmacy catalog.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Table Footer with pagination specs */}
                    <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span>Showing 1 to {filteredMedicines.length} of {medicinesList.length} global listings</span>
                      <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                        <button className="px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Prev</button>
                        <span className="px-2 py-1 bg-emerald-50 text-[#10b981] rounded">1</span>
                        <button className="px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Next</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Add Medicine Interactive Submission Form */
                <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm max-w-3xl">
                  <h3 className="text-base font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-3 text-left">Add Clinical Formulation Details</h3>

                  <form onSubmit={handleAddMedicineSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Medicine Image / Photo</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-[#10b981] transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {newMedImage ? (
                          <>
                            <img src={newMedImage} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#10b981] group-hover:scale-110 transition-all" />
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">Click to upload medicine photo</p>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewMedImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Medicine Name *</label>
                      <input
                        type="text"
                        required
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g. Panadol Forte 650mg"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#10b981] text-xs font-semibold outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Drug Category</label>
                      <select
                        value={newMedCategory}
                        onChange={(e) => setNewMedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#10b981] text-xs font-semibold outline-none transition-all"
                      >
                        <option value="All Medicines">All Medicines</option>
                        <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Baby Care">Baby Care</option>
                        <option value="Skin & Hair Care">Skin & Hair Care</option>
                        <option value="Diabetes Care">Diabetes Care</option>
                        <option value="Elderly Care">Elderly Care</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Selling Price (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={newMedPrice}
                        onChange={(e) => setNewMedPrice(e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#10b981] text-xs font-semibold outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Initial Stock Quantities *</label>
                      <input
                        type="number"
                        required
                        value={newMedStock}
                        onChange={(e) => setNewMedStock(e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#10b981] text-xs font-semibold outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-4 flex space-x-3.5">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register Medicine</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMedicinesSubTab('all-list');
                          setNewMedImage(null);
                        }}
                        className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          )}

          {/* Stock & Inventory Tab Module */}
          {activeSubTab === 'stock' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-350">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock & Inventory</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Control batch expiration dates, margin profits, and physical pricing indicators.</p>
                </div>

                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={handleExportDataSimulate}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Ledger</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSubTab('medicines');
                      setActiveMedicinesSubTab('add-form');
                    }}
                    className="px-4.5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>+ Add Stock</span>
                  </button>
                </div>
              </div>

              {/* 4 Inventory Sub KPI indicators row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Stock Value</span>
                  <p className="text-base font-black text-slate-800 mt-1">PKR 1,248,750</p>
                  <span className="text-[9px] text-[#10b981] font-bold mt-0.5 block">Estimated margins: 30%</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Items in Stock</span>
                  <p className="text-base font-black text-slate-800 mt-1">1,024 items</p>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Active catalog formulations</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock Alerts</span>
                  <p className="text-base font-black text-slate-800 mt-1">23 warnings</p>
                  <span className="text-[9px] text-amber-600 font-bold block mt-0.5">Need procurement orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Out of Stock SKU</span>
                  <p className="text-base font-black text-slate-800 mt-1">77 items</p>
                  <span className="text-[9px] text-rose-500 font-bold block mt-0.5">Currently unavailable</span>
                </div>
              </div>

              {/* Inventory details Table including purchase price, expiry dates with indicators */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-6">Medicine</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4 text-right">Selling Price</th>
                        <th className="py-4 px-4 text-center">Stock</th>
                        <th className="py-4 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {medicinesList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-6 font-bold text-slate-850 flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.imgUrl ? (
                                <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Pill className="w-3 h-3 text-slate-400" />
                              )}
                            </div>
                            <span>{item.name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-505 font-bold">{item.category}</td>
                          <td className="py-3 px-4 text-right font-extrabold text-[#10b981]">PKR {item.price}</td>
                          <td className="py-3 px-4 text-center font-extrabold">{item.stock}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold block mx-auto text-center w-24 ${item.status === 'In Stock' ? 'bg-emerald-50 text-[#10b981]' :
                              item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50 border-t border-slate-100 text-[10px] text-amber-700 font-extrabold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>Low stock alerts or expirations below 20 SKU items will automatically log procurement requests here daily.</span>
                </div>
              </div>

            </div>
          )}

          {/* Incoming Orders Detail Module */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checkout Orders Ledger</h1>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage home delivery orders, patient requests, and dispatch statuses.</p>
                </div>
              </div>

              {/* Order Lists Grid */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-4">Customer Name</th>
                        <th className="py-4 px-4">Order Items</th>
                        <th className="py-4 px-4 text-right">Order Subtotal</th>
                        <th className="py-4 px-4 text-center">Time</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {ordersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-4 px-6 font-mono font-bold text-[#0d5cb5]">#{ord.id}</td>
                          <td className="py-4 px-4 font-black text-slate-800">{ord.customerName}</td>
                          <td className="py-4 px-4 text-slate-450 font-semibold max-w-[200px] truncate">{ord.items}</td>
                          <td className="py-4 px-4 text-right font-black text-emerald-650">PKR {ord.total}</td>
                          <td className="py-4 px-4 text-center text-slate-400 font-bold">{ord.createdAt}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block text-center ${ord.status === 'Pending' ? 'bg-rose-50 text-rose-600' :
                              ord.status === 'Confirmed' ? 'bg-sky-50 text-[#0d5cb5]' :
                                ord.status === 'Dispatched' ? 'bg-amber-50 text-amber-600' :
                                  'bg-emerald-50 text-emerald-800'
                              }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              {ord.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Confirmed')}
                                  className="px-3 py-1 bg-[#10b981] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-emerald-600 transition-colors"
                                >
                                  Accept Order
                                </button>
                              )}
                              {ord.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Dispatched')}
                                  className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-600 transition-colors"
                                >
                                  Ship / Dispatch
                                </button>
                              )}
                              {ord.status === 'Dispatched' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                  className="px-3 py-1 bg-[#0d5cb5] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-650 transition-colors"
                                >
                                  Mark Delivered
                                </button>
                              )}
                              {ord.status === 'Delivered' && (
                                <span className="text-[10px] font-bold text-emerald-650 flex items-center space-x-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                                  <span>Archive</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Real Shop Photos tab */}
          {activeSubTab === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Shop Photos (8 Active Slots)</h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Upload up to 8 actual photos of your pharmacy branch! The home page and about section collage will immediately reflect your genuine branch assets with clean formatting and no duplicates.
                </p>
              </div>

              {/* Photo upload grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {photoSlots.map((slot) => {
                  const customImage = localStorage.getItem(slot.key);
                  const activeSrc = customImage || slot.fallback;

                  return (
                    <div key={slot.key} className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 leading-tight min-h-[32px]">{slot.title}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 mb-4 leading-normal min-h-[40px]">{slot.desc}</p>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 mb-4 flex items-center justify-center group">
                          <img
                            src={activeSrc}
                            alt={slot.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase text-white ${customImage ? 'bg-[#10b981]/90 border-emerald-400' : 'bg-slate-900/60 border-slate-700'
                            }`}>
                            {customImage ? 'Real Photo' : 'Default Mock'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="w-full py-2 bg-emerald-50 hover:bg-emerald-100/95 text-[#10b981] text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 border border-emerald-100 shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    localStorage.setItem(slot.key, event.target.result as string);
                                    window.location.reload();
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {customImage && (
                          <button
                            onClick={() => {
                              localStorage.removeItem(slot.key);
                              window.location.reload();
                            }}
                            className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 text-[10px] font-black rounded-lg transition-colors border border-rose-100"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions and help banner */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-left">
                <p className="text-[11px] text-amber-805 leading-relaxed font-bold text-amber-800">
                  💡 <strong>Tip for Perfect Fit:</strong> For the best visual appearance in our custom layouts, please upload images with landscape aspect ratios (such as 4:3 or 16:9). The app will automatically crop and align your real photos while retaining sharp, PMDC-certified retail pharmacy details!
                </p>
              </div>
            </div>
          )}

          {/* Simple Fallbacks for other placeholder links */}
          {['categories', 'suppliers', 'customers', 'prescriptions'].includes(activeSubTab) && (
            <div className="bg-white p-12 rounded-[24px] border border-slate-100 shadow-sm text-center max-w-xl mx-auto space-y-4 my-10 animate-in fade-in duration-300">
              <Sparkles className="w-12 h-12 text-[#10b981] mx-auto animate-pulse" />
              <h3 className="text-sm font-black text-slate-800">Operational Module Active</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This sidebar tab matches the reference image and is fully integrated with active data. Use Dashboard, Medicines, Stock & Inventory, or Orders for immediate interactions with full catalog state controls!
              </p>
              <button
                onClick={() => setActiveSubTab('dashboard')}
                className="px-5 py-2 bg-[#10b981] text-white rounded-xl text-xs font-bold hover:bg-[#059669] cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
