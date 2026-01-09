import React, { useState, useMemo, useEffect } from 'react';
import { 
  Truck, Disc, Activity, AlertTriangle, Plus, Search, LayoutDashboard, 
  Wrench, History, QrCode, Bell, ChevronDown, Filter, AlertCircle, 
  CheckCircle2, MoreHorizontal, ArrowUpRight, RefreshCw, Coins, 
  Hammer, FileSpreadsheet, Download, Calendar, TrendingUp, TrendingDown, 
  DollarSign, FileText, ScanLine, Gauge, Save, X, MapPin, Briefcase, 
  Layers, ChevronRight, Settings, LogOut, ClipboardCheck, FileCheck, ShieldAlert,
  Power
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, 
  Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid 
} from 'recharts';

/**
 * --- MOCK DATA INITIALIZATION ---
 */
const INITIAL_VEHICLES = [
  { id: 'v1', regNumber: 'GJ-06-AX-8765', make: 'Tata', model: 'Prima', odometer: 347766, type: '10-wheeler', status: 'ACTIVE', location: 'Hazira Hub' },
  { id: 'v2', regNumber: 'GJ-16-AW-9480', make: 'Ashok Leyland', model: 'Captain', odometer: 253032, type: '10-wheeler', status: 'ACTIVE', location: 'Dahej Plant' },
  { id: 'v3', regNumber: 'GJ-06-AZ-7581', make: 'BharatBenz', model: 'HighHaul', odometer: 189000, type: '6-wheeler', status: 'MAINTENANCE', location: 'Garage' },
];

const INITIAL_TYRES = [
  { id: 't1', serial: 'K0117043424', brand: 'Vikrant', model: 'Trak Lug', size: '295/80 R22.5', price: 33700, status: 'RUNNING', lifeCycle: 1, vehicleId: 'v1', position: 'HR/R', totalKm: 25000, vendor: 'Raj Tyres', invoice: 'GST/24-25/112', installDate: '2024-10-18', costHistory: [{type: 'NEW', amount: 33700, date: '2024-10-18'}] },
  { id: 't2', serial: '57159280822', brand: 'MRF', model: 'Muscle', size: '10.00 R20', price: 4500, status: 'RUNNING', lifeCycle: 2, vehicleId: 'v2', position: 'FH/L', totalKm: 85000, vendor: 'Suraj Tyre Care', invoice: 'GST/25-26/1850', installDate: '2025-11-26', isRemold: true, costHistory: [{type: 'RETREAD', amount: 4500, date: '2025-11-26'}] },
  { id: 't3', serial: 'V0126912324', brand: 'JK Tyre', model: 'Jet R Miles', size: '295/80 R22.5', price: 34000, status: 'RETREAD_CENTER', lifeCycle: 1, vehicleId: null, position: null, totalKm: 72000, vendor: 'Maa Krupa Service', invoice: 'Pending', sentDate: '2025-12-01', costHistory: [{type: 'NEW', amount: 34000, date: '2024-01-01'}] },
  { id: 't4', serial: 'K0000811924', brand: 'Vikrant', model: 'Trak Lug', size: '10.00 R20', price: 0, status: 'SCRAP', lifeCycle: 3, vehicleId: null, position: null, totalKm: 145000, vendor: 'Scrap Sale', invoice: 'SALE/23-11', scrapReason: 'Burst/Side Cut', costHistory: [] },
  { id: 't5', serial: 'K0070694925', brand: 'JK Tyre', model: 'Jet Xtra XLM', size: '295/80 R22.5', price: 35000, status: 'STOCK', lifeCycle: 1, vehicleId: null, position: null, totalKm: 0, vendor: 'Raj Tyres', invoice: 'GST/25-26/900', installDate: null, costHistory: [{type: 'NEW', amount: 35000, date: '2025-12-01'}] },
  { id: 't6', serial: 'K0069954925', brand: 'JK Tyre', model: 'Jet Xtra XLM', size: '295/80 R22.5', price: 35000, status: 'STOCK', lifeCycle: 1, vehicleId: null, position: null, totalKm: 12000, vendor: 'Raj Tyres', invoice: 'GST/25-26/900', installDate: null, costHistory: [{type: 'NEW', amount: 35000, date: '2025-11-01'}] },
];

const INITIAL_TOOLS = [
  { id: 1, vehicleId: 'v1', items: { jack: true, tommy: true, spanner: true, helmet: true, fireExt: false }, lastAudit: '2025-12-20' },
  { id: 2, vehicleId: 'v2', items: { jack: true, tommy: false, spanner: true, helmet: true, fireExt: true }, lastAudit: '2025-12-22' },
];

const PRICE_TRENDS = [
  { date: 'Apr 23', JK: 33400, MRF: 34500 },
  { date: 'Jul 23', JK: 33200, MRF: 34700 },
  { date: 'Nov 23', JK: 33200, MRF: 34200 },
  { date: 'Apr 24', JK: 35000, MRF: 36000 },
  { date: 'Aug 24', JK: 33700, MRF: 38000 },
  { date: 'Oct 24', JK: 34000, MRF: 38500 },
];

const SCRAP_DATA = [
  { name: 'Normal Wear', value: 65, color: '#10b981' },
  { name: 'Burst / Cut', value: 20, color: '#ef4444' },
  { name: 'Alignment', value: 15, color: '#f59e0b' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- PERSISTENT STATE ---
  // Initialize state from localStorage if available, else use Mock Data
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('tms_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [tyres, setTyres] = useState(() => {
    const saved = localStorage.getItem('tms_tyres');
    return saved ? JSON.parse(saved) : INITIAL_TYRES;
  });

  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('tms_tools');
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  const [notification, setNotification] = useState(null);
  
  // Modals
  const [showAddTyreModal, setShowAddTyreModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showFitTyreModal, setShowFitTyreModal] = useState(false);
  const [showRetreadModal, setShowRetreadModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showReceiveRetreadModal, setShowReceiveRetreadModal] = useState(false);
  const [selectedTyreForAction, setSelectedTyreForAction] = useState(null);
  
  // View State
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // --- EFFECT HOOKS FOR PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('tms_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('tms_tyres', JSON.stringify(tyres));
  }, [tyres]);

  useEffect(() => {
    localStorage.setItem('tms_tools', JSON.stringify(tools));
  }, [tools]);

  // --- HELPERS ---
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStats = () => ({
    total: tyres.length,
    running: tyres.filter(t => t.status === 'RUNNING').length,
    stock: tyres.filter(t => t.status === 'STOCK').length,
    remold: tyres.filter(t => t.status === 'RETREAD_CENTER').length,
    scrap: tyres.filter(t => t.status === 'SCRAP').length,
    claims: tyres.filter(t => t.status === 'CLAIM_PENDING').length,
    value: tyres.filter(t => t.status !== 'SCRAP').reduce((acc, t) => acc + t.price, 0)
  });

  const downloadReport = (title) => {
    const headers = "Serial,Brand,Status,Total KM,Vehicle,Position\n";
    const rows = tyres.map(t => `${t.serial},${t.brand},${t.status},${t.totalKm},${t.vehicleId || 'N/A'},${t.position || 'N/A'}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/ /g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${title} CSV downloaded`);
  };

  // --- ACTIONS ---
  
  // Fleet Status Toggle Action
  const handleToggleVehicleStatus = (vehId) => {
      setVehicles(prev => prev.map(v => {
          if (v.id === vehId) {
              const newStatus = v.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
              showToast(`Vehicle ${v.regNumber} marked as ${newStatus}`);
              return { ...v, status: newStatus };
          }
          return v;
      }));
  };

  const handleAddTyre = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTyre = {
      id: `t${Date.now()}`,
      serial: formData.get('serial'),
      brand: formData.get('brand'),
      model: formData.get('model'),
      size: formData.get('size'),
      price: parseInt(formData.get('price')),
      vendor: formData.get('vendor'),
      status: 'STOCK',
      lifeCycle: 1,
      totalKm: 0,
      invoice: formData.get('invoice'),
      vehicleId: null, position: null,
      costHistory: [{type: 'NEW', amount: parseInt(formData.get('price')), date: new Date().toISOString().split('T')[0]}]
    };
    setTyres([...tyres, newTyre]);
    setShowAddTyreModal(false);
    showToast('New tyre added to Inventory');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newVehicle = {
      id: `v${Date.now()}`,
      regNumber: formData.get('regNumber'),
      make: formData.get('make'),
      model: formData.get('model'),
      type: formData.get('type'),
      odometer: parseInt(formData.get('odometer')),
      status: 'ACTIVE',
      location: 'Hazira Hub'
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddVehicleModal(false);
    showToast('Vehicle onboarded successfully');
  };

  const handleTripUpdate = (vehId, newOdo) => {
    const vehicle = vehicles.find(v => v.id === vehId);
    if (!vehicle) return;
    const tripKm = parseInt(newOdo) - vehicle.odometer;

    if (tripKm <= 0) {
      showToast('New odometer must be greater than current', 'error');
      return;
    }

    setVehicles(prev => prev.map(v => v.id === vehId ? { ...v, odometer: parseInt(newOdo) } : v));
    setTyres(prev => prev.map(t => {
      if (t.vehicleId === vehId && t.status === 'RUNNING') {
        return { ...t, totalKm: t.totalKm + tripKm };
      }
      return t;
    }));

    showToast(`Trip logged: +${tripKm} KM added to fitted tyres`);
    setShowMileageModal(false);
  };

  const handleFitTyre = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tyreId = formData.get('tyreId');
    const position = formData.get('position');
    
    // Check if position is occupied
    const existing = tyres.find(t => t.vehicleId === selectedVehicleId && t.position === position && t.status === 'RUNNING');
    if (existing) {
        showToast(`Position ${position} is already occupied by ${existing.serial}`, 'error');
        return;
    }

    setTyres(prev => prev.map(t => {
        if (t.id === tyreId) {
            return { ...t, status: 'RUNNING', vehicleId: selectedVehicleId, position: position, fitmentDate: new Date().toISOString().split('T')[0] };
        }
        return t;
    }));
    setShowFitTyreModal(false);
    showToast('Tyre fitted successfully');
  };

  const handleSendToRetread = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const tyreId = formData.get('tyreId');
      const vendor = formData.get('vendor');

      setTyres(prev => prev.map(t => {
          if (t.id === tyreId) {
              return { ...t, status: 'RETREAD_CENTER', vendor: vendor, sentDate: new Date().toISOString().split('T')[0] };
          }
          return t;
      }));
      setShowRetreadModal(false);
      showToast(`Tyre sent to ${vendor} for retreading`);
  };

  const handleReceiveRetreadSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const cost = parseInt(formData.get('cost'));
      const invoice = formData.get('invoice');

      setTyres(prev => prev.map(t => {
          if (t.id === selectedTyreForAction) {
              return { 
                  ...t, 
                  status: 'STOCK', 
                  lifeCycle: t.lifeCycle + 1, 
                  isRemold: true,
                  invoice: invoice, // Update latest invoice
                  costHistory: [...(t.costHistory || []), {type: 'RETREAD', amount: cost, date: new Date().toISOString().split('T')[0]}]
              };
          }
          return t;
      }));
      setShowReceiveRetreadModal(false);
      showToast('Retreaded tyre received back in Stock with cost updated');
  };

  const handleSendToClaim = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const tyreId = formData.get('tyreId');
      const vendor = formData.get('vendor');
      const reason = formData.get('reason');

      setTyres(prev => prev.map(t => {
          if (t.id === tyreId) {
              return { 
                  ...t, 
                  status: 'CLAIM_PENDING', 
                  vendor: vendor, 
                  claimReason: reason,
                  sentDate: new Date().toISOString().split('T')[0],
                  vehicleId: null, // Auto unmount from vehicle
                  position: null
              };
          }
          return t;
      }));
      setShowClaimModal(false);
      showToast('Tyre removed from vehicle and sent for Warranty Claim');
  };

  const handleSaveAudit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const vehicleId = formData.get('vehicleId');
      const items = {
          jack: formData.get('jack') === 'on',
          tommy: formData.get('tommy') === 'on',
          spanner: formData.get('spanner') === 'on',
          helmet: formData.get('helmet') === 'on',
          fireExt: formData.get('fireExt') === 'on',
      };
      
      const newAudit = {
          id: Date.now(),
          vehicleId,
          items,
          lastAudit: new Date().toISOString().split('T')[0]
      };
      
      setTools(prev => {
          const existing = prev.filter(t => t.vehicleId !== vehicleId);
          return [...existing, newAudit];
      });
      setShowAuditModal(false);
      showToast('Tools audit saved successfully');
  };

  // --- COMPONENTS ---

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const map = {
      RUNNING: 'bg-blue-100 text-blue-700 border-blue-200',
      STOCK: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      SCRAP: 'bg-red-50 text-red-600 border-red-100',
      RETREAD_CENTER: 'bg-purple-100 text-purple-700 border-purple-200',
      CLAIM_PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      MAINTENANCE: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${map[status] || 'bg-slate-100 text-slate-600'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  // --- VIEWS ---

  const DashboardView = () => {
    const stats = getStats();
    return (
      <div className="space-y-6 pb-24">
        {/* Quick Actions */}
        <div className="flex flex-col md:flex-row gap-4">
           <button onClick={() => setShowMileageModal(true)} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] transition-all group text-left relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                       <Gauge size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Log Trip</h3>
                    <p className="text-blue-100 text-sm mt-1">Update Odometer</p>
                 </div>
                 <div className="bg-white/20 px-3 py-1 rounded text-xs font-bold">Action</div>
              </div>
              <Gauge className="absolute -bottom-4 -right-4 text-white/10" size={100} />
           </button>

           <button onClick={() => setShowAddTyreModal(true)} className="flex-1 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left group">
              <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Plus size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Add Inventory</h3>
              <p className="text-slate-500 text-sm mt-1">Register new tyre purchase</p>
           </button>

           <button onClick={() => setShowAddVehicleModal(true)} className="flex-1 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left group">
              <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Truck size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Add Vehicle</h3>
              <p className="text-slate-500 text-sm mt-1">Onboard new fleet asset</p>
           </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {[
             { label: 'Total Assets', val: stats.total, icon: Disc, color: 'text-slate-600', bg: 'bg-slate-100' },
             { label: 'On Road', val: stats.running, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'In Stock', val: stats.stock, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'At Retread', val: stats.remold, icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50' },
             { label: 'Claims', val: stats.claims, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' }
           ].map((k, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{k.label}</p>
                      <h3 className={`text-3xl font-black mt-1 ${k.color.split(' ')[0]}`}>{k.val}</h3>
                   </div>
                   <div className={`p-2.5 rounded-lg ${k.bg} ${k.color}`}><k.icon size={20}/></div>
                </div>
             </div>
           ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <TrendingUp size={18} className="text-blue-500"/> Vendor Price Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PRICE_TRENDS}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:12, fill:'#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:12, fill:'#64748b'}} />
                    <Tooltip contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="JK" stroke="#3b82f6" strokeWidth={3} fill="url(#grad1)" />
                    <Area type="monotone" dataKey="MRF" stroke="#ef4444" strokeWidth={3} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Scrap Analysis</h3>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={SCRAP_DATA} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          {SCRAP_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                       <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                 <p className="text-xs text-red-700 leading-relaxed">
                    <span className="font-bold">Insight:</span> 20% scrap due to "Burst". Check pressure maintenance on long-haul routes.
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const InventoryView = () => (
    <div className="space-y-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input type="text" placeholder="Search by Serial Number, Brand..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowClaimModal(true)} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 shadow-sm shadow-amber-200 flex items-center gap-2"><ShieldAlert size={18}/> Warranty Claim</button>
           <button onClick={() => setShowAddTyreModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 flex items-center gap-2"><Plus size={18}/> Add Tyre</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
               <tr>
                  <th className="p-4">Serial / Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">KM Run</th>
                  <th className="p-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {tyres.map(tyre => (
                  <tr key={tyre.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="p-4">
                        <div className="font-bold text-slate-800 font-mono">{tyre.serial}</div>
                        <div className="text-xs text-slate-500">{tyre.brand} {tyre.model}</div>
                     </td>
                     <td className="p-4"><StatusBadge status={tyre.status} /></td>
                     <td className="p-4 text-slate-600">
                        {tyre.vehicleId ? (
                           <div className="flex items-center gap-2">
                              <Truck size={14} className="text-blue-500" />
                              <span className="font-medium text-xs">
                                 {vehicles.find(v => v.id === tyre.vehicleId)?.regNumber} ({tyre.position})
                              </span>
                           </div>
                        ) : <span className="text-slate-400 italic text-xs">Warehouse</span>}
                     </td>
                     <td className="p-4 font-mono font-medium">{tyre.totalKm.toLocaleString()}</td>
                     <td className="p-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                           <MoreHorizontal size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const FleetView = () => {
    if (selectedVehicleId) {
       const vehicle = vehicles.find(v => v.id === selectedVehicleId);
       const fittedTyres = tyres.filter(t => t.vehicleId === selectedVehicleId && t.status === 'RUNNING');
       return (
          <div className="space-y-6 pb-24 animate-in slide-in-from-right-10">
             <button onClick={() => setSelectedVehicleId(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-2">
                <ChevronDown className="rotate-90" size={16} /> Back to Fleet
             </button>
             
             {/* Vehicle Header Card */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${vehicle.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Truck size={32} />
                   </div>
                   <div>
                      <h1 className="text-2xl font-bold text-slate-900">{vehicle.regNumber}</h1>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                         <span>{vehicle.make} {vehicle.model}</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                         <StatusBadge status={vehicle.status} />
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   {/* Maintenance Toggle Button */}
                   <button 
                     onClick={() => handleToggleVehicleStatus(vehicle.id)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        vehicle.status === 'ACTIVE' 
                        ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                     }`}
                   >
                      <Power size={16} />
                      {vehicle.status === 'ACTIVE' ? 'Send to Maintenance' : 'Back to Active'}
                   </button>

                   <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="px-2">
                         <p className="text-xs text-slate-500 font-bold uppercase">Current Odometer</p>
                         <p className="text-xl font-mono font-bold text-slate-800">{vehicle.odometer.toLocaleString()} km</p>
                      </div>
                      <button 
                        onClick={() => setShowMileageModal(true)}
                        className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors" title="Update Odometer"
                      >
                         <RefreshCw size={18} />
                      </button>
                   </div>
                </div>
             </div>

             {/* Fitted Tyres Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Disc size={20} className="text-blue-500"/> Fitted Tyres ({fittedTyres.length})</h3>
                   <div className="space-y-3">
                      {fittedTyres.length > 0 ? fittedTyres.map(tyre => (
                         <div key={tyre.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                                  {tyre.position}
                               </div>
                               <div>
                                  <p className="font-bold text-sm text-slate-800">{tyre.serial}</p>
                                  <p className="text-xs text-slate-500">{tyre.brand} • {tyre.totalKm.toLocaleString()} km</p>
                               </div>
                            </div>
                            <button className="text-xs text-blue-600 font-medium hover:underline">Inspect</button>
                         </div>
                      )) : (
                         <div className="text-center py-8 text-slate-400">
                            <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                            <p>No tyres fitted currently.</p>
                         </div>
                      )}
                   </div>
                   <button 
                      onClick={() => setShowFitTyreModal(true)}
                      className="w-full mt-4 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Fit New Tyre
                   </button>
                </div>
                
                {/* Stats */}
                <div className="space-y-4">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-lg mb-2">Efficiency Score</h3>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black text-emerald-500">94</span>
                         <span className="text-sm text-slate-400 mb-1">/ 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                         <div className="bg-emerald-500 h-full w-[94%]"></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Based on tyre CPKM & fuel avg.</p>
                   </div>
                </div>
             </div>
          </div>
       );
    }

    return (
      <div className="space-y-6 pb-24">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Fleet Management</h2>
            <button onClick={() => setShowAddVehicleModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200">
               <Plus size={18} /> Add Vehicle
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(v => (
               <div key={v.id} onClick={() => setSelectedVehicleId(v.id)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck size={24} />
                     </div>
                     <StatusBadge status={v.status} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{v.regNumber}</h3>
                  <p className="text-sm text-slate-500 mb-4">{v.make} {v.model}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                     <Activity size={14} />
                     <span className="font-mono">{v.odometer.toLocaleString()} km</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  };

  const RemoldView = () => {
      const stockTyres = tyres.filter(t => t.status === 'STOCK' && t.totalKm > 20000); 
      const atVendor = tyres.filter(t => t.status === 'RETREAD_CENTER');

      return (
          <div className="space-y-6 pb-24">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">Retread Management</h2>
                  <button onClick={() => setShowRetreadModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-purple-700">
                      Send to Vendor
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* At Vendor Column */}
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                      <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                          <RefreshCw size={20}/> At Vendor ({atVendor.length})
                      </h3>
                      <div className="space-y-3">
                          {atVendor.map(t => (
                              <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-slate-800">{t.serial}</span>
                                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">Processing</span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-3">Vendor: {t.vendor || 'Unknown'}</p>
                                  <button 
                                      onClick={() => { setSelectedTyreForAction(t.id); setShowReceiveRetreadModal(true); }}
                                      className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                                  >
                                      Mark Received
                                  </button>
                              </div>
                          ))}
                          {atVendor.length === 0 && <p className="text-center text-purple-400 text-sm py-8">No tyres currently at vendor.</p>}
                      </div>
                  </div>

                  {/* Eligible Column */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Eligible for Retread</h3>
                      <div className="space-y-3">
                          {stockTyres.map(t => (
                              <div key={t.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                                  <div>
                                      <p className="font-bold text-slate-800 text-sm">{t.serial}</p>
                                      <p className="text-xs text-slate-500">{t.brand} • {t.totalKm} km</p>
                                  </div>
                                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">Stock</span>
                              </div>
                          ))}
                          {stockTyres.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No eligible tyres in stock.</p>}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const ToolsView = () => {
      return (
          <div className="space-y-6 pb-24">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">Tools Audit</h2>
                  <button onClick={() => setShowAuditModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2">
                      <ClipboardCheck size={18}/> New Audit
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map(tool => {
                      const vehicle = vehicles.find(v => v.id === tool.vehicleId);
                      if (!vehicle) return null;
                      const missingCount = Object.values(tool.items).filter(v => !v).length;
                      return (
                          <div key={tool.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                          <Truck size={20} className="text-slate-600"/>
                                      </div>
                                      <div>
                                          <h3 className="font-bold text-slate-800">{vehicle.regNumber}</h3>
                                          <p className="text-xs text-slate-500">Audit: {tool.lastAudit}</p>
                                      </div>
                                  </div>
                                  {missingCount === 0 ? (
                                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">All Good</span>
                                  ) : (
                                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">{missingCount} Missing</span>
                                  )}
                              </div>
                              <div className="space-y-2">
                                  {Object.entries(tool.items).map(([key, present]) => (
                                      <div key={key} className="flex justify-between items-center text-sm">
                                          <span className="text-slate-600 capitalize">{key}</span>
                                          {present ? <CheckCircle2 size={16} className="text-emerald-500"/> : <AlertCircle size={16} className="text-red-500"/>}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  const ReportsView = () => {
      const reportsList = [
          "Tyre Record Sheet", "All Tyre Mileage Report", "Tyre Fitment Report", 
          "New Tyre Report", "Running Tyre Stock", "Scrap Tyre Report", "Battery & Tools Sheet"
      ];
      
      return (
          <div className="space-y-6 pb-24">
               <h2 className="text-xl font-bold text-slate-800">Reports Center</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {reportsList.map((rep, i) => (
                       <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                               <FileSpreadsheet size={24} />
                           </div>
                           <h3 className="font-bold text-lg text-slate-800 mb-2">{rep}</h3>
                           <p className="text-sm text-slate-500 mb-6">Generate and download report.</p>
                           <div className="flex gap-2">
                               <button 
                                  onClick={() => downloadReport(rep, 'csv')}
                                  className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                               >
                                   <Download size={16}/> CSV
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      );
  };

  // --- MODALS (Forms) ---

  const AddTyreForm = () => (
    <Modal title="Add New Inventory" onClose={() => setShowAddTyreModal(false)}>
       <form onSubmit={handleAddTyre} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Serial Number</label>
                <input name="serial" required className="w-full p-2 border rounded-lg text-sm bg-slate-50" placeholder="e.g. K001..." />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Brand</label>
                <select name="brand" className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                   <option>JK Tyre</option>
                   <option>MRF</option>
                   <option>Apollo</option>
                   <option>Michelin</option>
                   <option>Ceat</option>
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Model</label>
                <input name="model" required className="w-full p-2 border rounded-lg text-sm bg-slate-50" placeholder="e.g. Jet Xtra" />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Size</label>
                <input name="size" defaultValue="295/80 R22.5" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Vendor</label>
                <input name="vendor" className="w-full p-2 border rounded-lg text-sm bg-slate-50" placeholder="Supplier Name" />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Price (₹)</label>
                <input name="price" type="number" required className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
             </div>
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 mb-1">Invoice No.</label>
             <input name="invoice" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Save to Inventory</button>
       </form>
    </Modal>
  );

  const AddVehicleForm = () => (
    <Modal title="Onboard New Vehicle" onClose={() => setShowAddVehicleModal(false)}>
       <form onSubmit={handleAddVehicle} className="space-y-4">
          <div>
             <label className="block text-xs font-bold text-slate-500 mb-1">Registration Number</label>
             <input name="regNumber" required className="w-full p-2 border rounded-lg text-sm bg-slate-50 font-mono" placeholder="GJ-XX-XX-XXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Make</label>
                <select name="make" className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                   <option>Tata</option>
                   <option>Ashok Leyland</option>
                   <option>BharatBenz</option>
                   <option>Eicher</option>
                   <option>Mahindra</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Model</label>
                <input name="model" required className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                <select name="type" className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                   <option>6-Wheeler</option>
                   <option>10-Wheeler</option>
                   <option>12-Wheeler</option>
                   <option>Trailer (18W)</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Current Odometer</label>
                <input name="odometer" type="number" required className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
             </div>
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Register Vehicle</button>
       </form>
    </Modal>
  );

  const FitTyreForm = () => {
      const stockTyres = tyres.filter(t => t.status === 'STOCK');
      return (
        <Modal title="Fit Tyre to Vehicle" onClose={() => setShowFitTyreModal(false)}>
            <form onSubmit={handleFitTyre} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Select Tyre (Stock)</label>
                    <select name="tyreId" required className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                        {stockTyres.map(t => (
                            <option key={t.id} value={t.id}>{t.serial} - {t.brand} ({t.size})</option>
                        ))}
                    </select>
                    {stockTyres.length === 0 && <p className="text-xs text-red-500 mt-1">No tyres in stock!</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Position</label>
                    <select name="position" required className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                        <option value="1L">1L (Front Left)</option>
                        <option value="1R">1R (Front Right)</option>
                        <option value="2L">2L (Rear Left Outer)</option>
                        <option value="2LI">2LI (Rear Left Inner)</option>
                        <option value="2R">2R (Rear Right Outer)</option>
                        <option value="2RI">2RI (Rear Right Inner)</option>
                    </select>
                </div>
                <button disabled={stockTyres.length === 0} className="w-full bg-blue-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Confirm Fitment</button>
            </form>
        </Modal>
      );
  };

  const RetreadForm = () => {
      const stockTyres = tyres.filter(t => t.status === 'STOCK');
      return (
          <Modal title="Send to Retread" onClose={() => setShowRetreadModal(false)}>
              <form onSubmit={handleSendToRetread} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Select Tyre</label>
                    <select name="tyreId" required className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                        {stockTyres.map(t => (
                            <option key={t.id} value={t.id}>{t.serial} - {t.brand}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Vendor</label>
                      <input name="vendor" required placeholder="e.g. Suraj Tyre Care" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                  </div>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">Send Out</button>
              </form>
          </Modal>
      );
  };

  const ClaimForm = () => {
      const allTyres = tyres.filter(t => t.status !== 'SCRAP' && t.status !== 'CLAIM_PENDING');
      return (
          <Modal title="Send for Warranty Claim" onClose={() => setShowClaimModal(false)}>
              <form onSubmit={handleSendToClaim} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Select Tyre</label>
                    <select name="tyreId" required className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                        {allTyres.map(t => (
                            <option key={t.id} value={t.id}>{t.serial} - {t.status}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Reason for Claim</label>
                      <select name="reason" className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                          <option>Side Air Problem</option>
                          <option>Manufacturing Defect</option>
                          <option>Bulge / Separation</option>
                          <option>Bead Crack</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Vendor</label>
                      <input name="vendor" required placeholder="e.g. Original Manufacturer" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                  </div>
                  <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">Register Claim</button>
              </form>
          </Modal>
      );
  };

  const ReceiveRetreadForm = () => {
      return (
          <Modal title="Receive Retread Tyre" onClose={() => setShowReceiveRetreadModal(false)}>
              <form onSubmit={handleReceiveRetreadSubmit} className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 mb-4">
                      Updating Inventory for Tyre ID: <strong>{tyres.find(t => t.id === selectedTyreForAction)?.serial}</strong>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Retread Cost (Invoice Amt)</label>
                      <input name="cost" type="number" required placeholder="₹ 4500" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Invoice Number</label>
                      <input name="invoice" required placeholder="INV-1234" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                  </div>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Confirm Receipt</button>
              </form>
          </Modal>
      );
  };

  const AuditForm = () => {
      const [selectedVeh, setSelectedVeh] = useState(vehicles[0].id);
      return (
          <Modal title="New Tools Audit" onClose={() => setShowAuditModal(false)}>
              <form onSubmit={handleSaveAudit} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Vehicle</label>
                      <select name="vehicleId" value={selectedVeh} onChange={e => setSelectedVeh(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50">
                          {vehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-700">Check Items Present:</p>
                      {['jack', 'tommy', 'spanner', 'helmet', 'fireExt'].map(item => (
                          <div key={item} className="flex items-center gap-2">
                              <input type="checkbox" name={item} id={item} className="w-4 h-4 text-blue-600 rounded" />
                              <label htmlFor={item} className="text-sm capitalize text-slate-600">{item}</label>
                          </div>
                      ))}
                  </div>
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">Save Audit Log</button>
              </form>
          </Modal>
      );
  };

  const MileageCalculator = () => {
     const [vehId, setVehId] = useState('');
     const [newOdo, setNewOdo] = useState('');
     const vehicle = vehicles.find(v => v.id === vehId);
     const diff = vehicle && newOdo ? parseInt(newOdo) - vehicle.odometer : 0;
     const isValid = diff > 0;

     return (
        <Modal title="Trip Log / Odo Update" onClose={() => setShowMileageModal(false)}>
           <div className="space-y-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Select Vehicle</label>
                 <select className="w-full p-3 border rounded-xl bg-slate-50" value={vehId} onChange={e => setVehId(e.target.value)}>
                    <option value="">-- Select Truck --</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber}</option>)}
                 </select>
              </div>
              {vehicle && (
                 <div className="animate-in fade-in">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center mb-4">
                       <div>
                          <p className="text-xs text-blue-600 font-bold uppercase">Current ODO</p>
                          <p className="text-2xl font-mono font-bold text-blue-900">{vehicle.odometer.toLocaleString()}</p>
                       </div>
                       <ArrowUpRight className="text-blue-400" />
                    </div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Odometer Reading</label>
                    <input 
                       type="number" 
                       className="w-full p-3 border-2 border-slate-300 rounded-xl text-lg font-mono font-bold focus:border-blue-500 outline-none"
                       placeholder="Enter new reading..."
                       value={newOdo}
                       onChange={e => setNewOdo(e.target.value)}
                    />
                    {newOdo && (
                       <div className={`mt-4 p-3 rounded-lg flex justify-between items-center ${isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          <span className="font-bold text-sm">Trip Distance:</span>
                          <span className="font-mono font-black text-lg">{isValid ? `+${diff.toLocaleString()} KM` : 'Invalid'}</span>
                       </div>
                    )}
                 </div>
              )}
              <button 
                 disabled={!isValid} 
                 onClick={() => handleTripUpdate(vehId, newOdo)}
                 className="w-full bg-blue-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                 <Save size={18}/> Update & Log
              </button>
           </div>
        </Modal>
     );
  };

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex selection:bg-blue-100 selection:text-blue-900">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-slate-200 fixed h-full z-20 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 font-bold text-xl text-white shadow-lg shadow-blue-500/30">T</div>
          <span className="font-bold tracking-tight text-xl text-slate-900">TyreMaster<span className="text-blue-600">.</span></span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'fleet', label: 'Fleet & Vehicles', icon: Truck },
            { id: 'inventory', label: 'Tyre Inventory', icon: Disc },
            { id: 'remold', label: 'Retread Mgmt', icon: RefreshCw },
            { id: 'tools', label: 'Tools Audit', icon: Hammer },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
              {item.label}
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto text-blue-400" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:border-blue-200 transition-colors">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                HM
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Hazira Manager</p>
                <p className="text-xs text-slate-500 truncate">Admin Access</p>
             </div>
             <Settings size={16} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
           <div>
              <h2 className="font-bold text-xl capitalize text-slate-800">{activeTab.replace('-', ' ')}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date().toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long'})}</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-slate-600">System Online</span>
              </div>
              <button className="relative p-2.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
           </div>
        </header>

        {/* Workspace */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-[1600px] mx-auto w-full">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'inventory' && <InventoryView />}
           {activeTab === 'fleet' && <FleetView />}
           {activeTab === 'remold' && <RemoldView />}
           {activeTab === 'tools' && <ToolsView />}
           {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 z-[200] ${
           notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
        }`}>
           {notification.type === 'error' ? <AlertCircle size={24}/> : <CheckCircle2 size={24} className="text-emerald-400"/>}
           <div>
              <h4 className="font-bold text-sm">{notification.type === 'error' ? 'Error' : 'Success'}</h4>
              <p className="text-xs opacity-90">{notification.msg}</p>
           </div>
        </div>
      )}

      {/* MODALS RENDER */}
      {showAddTyreModal && <AddTyreForm />}
      {showAddVehicleModal && <AddVehicleForm />}
      {showMileageModal && <MileageCalculator />}
      {showFitTyreModal && <FitTyreForm />}
      {showRetreadModal && <RetreadForm />}
      {showAuditModal && <AuditForm />}
      {showClaimModal && <ClaimForm />}
      {showReceiveRetreadModal && <ReceiveRetreadForm />}

      {/* MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
         {[
            {id:'dashboard', icon:LayoutDashboard}, {id:'fleet', icon:Truck}, {id:'inventory', icon:Disc}, {id:'more', icon:MoreHorizontal}
         ].map(item => (
            <button 
               key={item.id} 
               onClick={() => setActiveTab(item.id === 'more' ? 'reports' : item.id)}
               className={`p-3 rounded-xl ${activeTab === item.id ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
            >
               <item.icon size={24} />
            </button>
         ))}
      </div>
    </div>
  );
}