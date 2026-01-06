import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Disc, 
  Activity, 
  AlertTriangle, 
  Plus, 
  Search, 
  LayoutDashboard, 
  Wrench,
  History,
  QrCode,
  Bell,
  ChevronDown,
  Filter,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  ArrowUpRight,
  RefreshCw,
  Coins,
  Hammer,
  FileSpreadsheet,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  ScanLine,
  Gauge,
  Save,
  X
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

/**
 * ENTERPRISE MOCK DATA
 */

const INITIAL_VEHICLES = [
  { id: 'v1', regNumber: 'GJ-06-AX-8765', make: 'Tata', model: 'Prima', odometer: 347766, type: '10-wheeler', status: 'ACTIVE' },
  { id: 'v2', regNumber: 'GJ-16-AW-9480', make: 'Ashok Leyland', model: 'Captain', odometer: 253032, type: '10-wheeler', status: 'ACTIVE' },
  { id: 'v3', regNumber: 'GJ-06-AZ-7581', make: 'BharatBenz', model: 'HighHaul', odometer: 189000, type: '6-wheeler', status: 'MAINTENANCE' },
];

const INITIAL_TYRES = [
  { id: 't1', serial: 'K0117043424', brand: 'Vikrant', model: 'Trak Lug', size: '295/80 R22.5', price: 33700, status: 'RUNNING', lifeCycle: 1, vehicleId: 'v1', position: 'HR/R', totalKm: 25000, fitmentOdo: 322766, vendor: 'Raj Tyres', invoice: 'GST/24-25/112', installDate: '2024-10-18' },
  { id: 't2', serial: '57159280822', brand: 'MRF', model: 'Muscle', size: '10.00 R20', price: 4500, status: 'RUNNING', lifeCycle: 2, vehicleId: 'v2', position: 'FH/L', totalKm: 85000, fitmentOdo: 168032, vendor: 'Suraj Tyre Care', invoice: 'GST/25-26/1850', installDate: '2025-11-26', isRemold: true },
  { id: 't3', serial: 'V0126912324', brand: 'JK Tyre', model: 'Jet R Miles', size: '295/80 R22.5', price: 34000, status: 'RETREAD_CENTER', lifeCycle: 1, vehicleId: null, position: null, totalKm: 72000, fitmentOdo: 0, vendor: 'Maa Krupa Service', invoice: 'Pending', sentDate: '2025-12-01' },
  { id: 't4', serial: 'K0000811924', brand: 'Vikrant', model: 'Trak Lug', size: '10.00 R20', price: 0, status: 'SCRAP', lifeCycle: 3, vehicleId: null, position: null, totalKm: 145000, fitmentOdo: 0, vendor: 'Scrap Sale', invoice: 'SALE/23-11', scrapReason: 'Burst/Side Cut' },
  { id: 't5', serial: 'K0070694925', brand: 'JK Tyre', model: 'Jet Xtra XLM', size: '295/80 R22.5', price: 35000, status: 'STOCK', lifeCycle: 1, vehicleId: null, position: null, totalKm: 0, fitmentOdo: 0, vendor: 'Raj Tyres', invoice: 'GST/25-26/900', installDate: null },
  { id: 't6', serial: 'K0079534925', brand: 'JK Tyre', model: 'Jet Xtra XLM', size: '295/80 R22.5', price: 35000, status: 'RUNNING', lifeCycle: 1, vehicleId: 'v1', position: 'HR/L', totalKm: 2000, fitmentOdo: 345766, vendor: 'Raj Tyres', invoice: 'GST/25-26/900', installDate: '2025-12-12' },
];

const PRICE_TRENDS = [
  { date: 'Apr 23', JK: 33400, MRF: 34500, Vikrant: 31000 },
  { date: 'Jul 23', JK: 33200, MRF: 34700, Vikrant: 31200 },
  { date: 'Nov 23', JK: 33200, MRF: 34200, Vikrant: 31500 },
  { date: 'Apr 24', JK: 35000, MRF: 36000, Vikrant: 32000 },
  { date: 'Aug 24', JK: 33700, MRF: 38000, Vikrant: 32500 },
  { date: 'Oct 24', JK: 34000, MRF: 38500, Vikrant: 33000 },
];

const SCRAP_DATA = [
  { name: 'Normal Wear', value: 65, color: '#10b981' },
  { name: 'Burst / Cut', value: 20, color: '#ef4444' },
  { name: 'Alignment Issue', value: 10, color: '#f59e0b' },
  { name: 'Manufacturing Defect', value: 5, color: '#6366f1' },
];

const INITIAL_TOOLS = [
  { id: 1, vehicleId: 'v1', items: { jack: true, tommy: true, spanner: true, helmet: true, fireExt: false }, lastAudit: '2025-12-20' },
  { id: 2, vehicleId: 'v2', items: { jack: true, tommy: false, spanner: true, helmet: true, fireExt: true }, lastAudit: '2025-12-22' },
];

export default function TMSEnterprise() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [tyres, setTyres] = useState(INITIAL_TYRES);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [notification, setNotification] = useState(null);
  const [isMileageModalOpen, setIsMileageModalOpen] = useState(false);

  // --- LOGIC ENGINE ---

  const getStats = () => {
    return {
      total: tyres.length,
      running: tyres.filter(t => t.status === 'RUNNING').length,
      stock: tyres.filter(t => t.status === 'STOCK').length,
      remold: tyres.filter(t => t.status === 'RETREAD_CENTER').length,
      scrap: tyres.filter(t => t.status === 'SCRAP').length,
      value: tyres.filter(t => t.status !== 'SCRAP').reduce((acc, t) => acc + t.price, 0)
    };
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- MILEAGE UPDATER COMPONENT ---
  const MileageUpdater = () => {
    const [selectedVehId, setSelectedVehId] = useState('');
    const [newOdo, setNewOdo] = useState('');

    const selectedVehicle = vehicles.find(v => v.id === selectedVehId);
    const affectedTyres = selectedVehId ? tyres.filter(t => t.vehicleId === selectedVehId && t.status === 'RUNNING') : [];
    
    const tripKm = selectedVehicle && newOdo ? parseInt(newOdo) - selectedVehicle.odometer : 0;
    const isValid = tripKm > 0;

    const handleUpdate = () => {
        if (!isValid) return;
        
        // Update Vehicle
        setVehicles(prev => prev.map(v => v.id === selectedVehId ? { ...v, odometer: parseInt(newOdo) } : v));
        
        // Update Tyres
        setTyres(prev => prev.map(t => {
            if (t.vehicleId === selectedVehId && t.status === 'RUNNING') {
                return { ...t, totalKm: t.totalKm + tripKm };
            }
            return t;
        }));

        showNotification(`Updated ${selectedVehicle.regNumber} (+${tripKm} km)`, 'success');
        setIsMileageModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><Gauge size={20} /> Update Trip Odometer</h3>
                    <button onClick={() => setIsMileageModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Vehicle</label>
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedVehId}
                            onChange={e => { setSelectedVehId(e.target.value); setNewOdo(''); }}
                        >
                            <option value="">-- Choose Truck --</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.regNumber} - Current: {v.odometer} km</option>
                            ))}
                        </select>
                    </div>

                    {selectedVehicle && (
                        <div className="animate-in slide-in-from-bottom-2 fade-in">
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Current Odometer</p>
                                    <p className="text-2xl font-mono font-bold text-blue-900">{selectedVehicle.odometer.toLocaleString()}</p>
                                </div>
                                <ArrowUpRight className="text-blue-300" size={32} />
                            </div>

                            <label className="block text-sm font-bold text-slate-700 mb-2">New Odometer Reading</label>
                            <input 
                                type="number" 
                                className="w-full p-3 border-2 border-slate-300 rounded-xl text-lg font-mono font-bold focus:border-blue-500 outline-none"
                                placeholder="e.g. 350000"
                                value={newOdo}
                                onChange={e => setNewOdo(e.target.value)}
                            />
                            
                            {newOdo && (
                                <div className={`mt-4 p-3 rounded-lg flex justify-between items-center ${isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    <span className="text-sm font-bold">Trip Distance:</span>
                                    <span className="font-mono font-black text-lg">
                                        {isValid ? `+${tripKm.toLocaleString()} KM` : 'Invalid Reading'}
                                    </span>
                                </div>
                            )}

                            {isValid && affectedTyres.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Tyres to be updated ({affectedTyres.length})</p>
                                    <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
                                        {affectedTyres.map(t => (
                                            <div key={t.id} className="p-2 flex justify-between text-xs">
                                                <span className="font-mono text-slate-600">{t.serial} ({t.position})</span>
                                                <span className="text-emerald-600 font-bold">{t.totalKm} ➝ {(t.totalKm + tripKm).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={() => setIsMileageModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                    <button 
                        onClick={handleUpdate} 
                        disabled={!isValid}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Update Log
                    </button>
                </div>
            </div>
        </div>
    );
  };

  // --- SUB-COMPONENTS ---
  const StatusBadge = ({ status }) => {
    const styles = {
      RUNNING: 'bg-blue-100 text-blue-700 border-blue-200',
      STOCK: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      SCRAP: 'bg-slate-100 text-slate-600 border-slate-200',
      RETREAD_CENTER: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status] || styles.STOCK}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const MobileNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button 
        onClick={() => setActiveTab('inventory')} 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 ${activeTab === 'inventory' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <Disc size={20} />
        <span className="text-[10px] font-medium">Tyres</span>
      </button>
      
      {/* Central Action Button */}
      <div className="-mt-8 mx-2">
        <button 
          onClick={() => setIsMileageModalOpen(true)} // Open Calculator
          className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-400/50 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <Gauge size={24} />
        </button>
      </div>

      <button 
        onClick={() => setActiveTab('remold')} 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 ${activeTab === 'remold' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <RefreshCw size={20} />
        <span className="text-[10px] font-medium">Retread</span>
      </button>
      <button 
        onClick={() => setActiveTab('reports')} 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg flex-1 ${activeTab === 'reports' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <FileSpreadsheet size={20} />
        <span className="text-[10px] font-medium">Reports</span>
      </button>
    </div>
  );

  // --- VIEWS ---

  const DashboardView = () => {
    const stats = getStats();
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        {/* Quick Action Bar */}
        <div className="hidden md:flex gap-4">
            <button 
                onClick={() => setIsMileageModalOpen(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><Gauge size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold">Log Trip / Update ODO</h3>
                        <p className="text-xs text-blue-100">Calculate tire mileage automatically</p>
                    </div>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded text-xs font-bold group-hover:bg-white group-hover:text-blue-600 transition-colors">Start</div>
            </button>
        </div>

        {/* INVENTORY KPI CARDS (Requested) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Tyres</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.total}</h3>
               </div>
               <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Disc size={20} /></div>
             </div>
             <p className="text-xs text-slate-400 mt-2 font-medium">Asset Ledger</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Running</p>
                  <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.running}</h3>
               </div>
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Truck size={20} /></div>
             </div>
             <div className="w-full bg-slate-100 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${(stats.running/stats.total)*100}%` }}></div>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">In Stock</p>
                  <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.stock}</h3>
               </div>
               <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
             </div>
             <p className="text-xs text-emerald-600 mt-2 font-bold">Available Now</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Scrap</p>
                  <h3 className="text-3xl font-black text-red-600 mt-1">{stats.scrap}</h3>
               </div>
               <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
             </div>
             <p className="text-xs text-red-600 mt-2 font-bold">Disposal Due</p>
          </div>

           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">At Retread</p>
                  <h3 className="text-3xl font-black text-purple-600 mt-1">{stats.remold}</h3>
               </div>
               <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><RefreshCw size={20} /></div>
             </div>
             <p className="text-xs text-slate-400 mt-2">With Vendors</p>
          </div>
        </div>
        
        {/* Financials (Secondary) */}
        <div className="bg-slate-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/10 rounded-full"><Coins size={24} /></div>
               <div>
                  <p className="text-slate-400 text-xs uppercase font-bold">Inventory Value</p>
                  <h3 className="text-2xl font-bold">₹{(stats.value / 100000).toFixed(2)} Lakhs</h3>
               </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/10 rounded-full"><TrendingDown size={24} /></div>
               <div>
                  <p className="text-slate-400 text-xs uppercase font-bold">Avg CPKM</p>
                  <h3 className="text-2xl font-bold">0.18 p/km</h3>
               </div>
            </div>
             <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/10 rounded-full"><TrendingUp size={24} /></div>
               <div>
                  <p className="text-slate-400 text-xs uppercase font-bold">Retread Savings</p>
                  <h3 className="text-2xl font-bold text-emerald-400">₹4.2 Lakhs</h3>
               </div>
            </div>
          </div>
        </div>

        {/* Vendor Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="font-bold text-slate-800 mb-4">Vendor Price Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PRICE_TRENDS}>
              <defs>
                <linearGradient id="colorJK" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Area type="monotone" dataKey="JK" stroke="#3b82f6" fill="url(#colorJK)" />
              <Area type="monotone" dataKey="MRF" stroke="#ef4444" fill="none" />
              <Area type="monotone" dataKey="Vikrant" stroke="#10b981" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const CostView = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Financial Performance</h2>
           <p className="text-sm text-slate-500">Based on 'Tyre Cost' & 'Scrap Tyre Report'</p>
        </div>
        <select className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2">
            <option>FY 2024-2025</option>
            <option>FY 2023-2024</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Coins size={64} /></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Purchase Value</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">₹ 24,50,000</h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-red-500 bg-red-50 w-fit px-2 py-1 rounded">
                 <TrendingUp size={14} /> +12% vs last year
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingDown size={64} /></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cost Per KM (Fleet Avg)</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">0.14 p/km</h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
                 <TrendingDown size={14} /> -0.02 vs last year
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw size={64} /></div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Retread ROI</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">320%</h3>
              <p className="text-xs text-slate-400 mt-2">Avg cost ₹4500 vs New ₹35000</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Purchase Price Trend</h3>
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={PRICE_TRENDS}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} domain={['auto', 'auto']} />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="JK" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                   <Line type="monotone" dataKey="MRF" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                   <Line type="monotone" dataKey="Vikrant" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Scrap Reason Analysis</h3>
             <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-64 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SCRAP_DATA}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {SCRAP_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                   {SCRAP_DATA.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                            <span className="text-sm text-slate-600">{item.name}</span>
                         </div>
                         <span className="font-bold text-sm text-slate-800">{item.value}%</span>
                      </div>
                   ))}
                   <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <span className="font-bold text-red-500">Alert:</span> 20% of tyres are failing due to "Burst/Cut". Check driver behavior on GJ-16 route.
                      </p>
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );

  const ReportsView = () => (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
          <div className="bg-blue-600 text-white p-8 rounded-2xl relative overflow-hidden mb-8">
              <div className="relative z-10">
                  <h2 className="text-2xl font-bold">Reports Center</h2>
                  <p className="text-blue-100 mt-2 max-w-xl">Download standardized Excel/CSV reports matching your offline "Tyre Book 2025" formats.</p>
              </div>
              <FileSpreadsheet className="absolute right-0 bottom-0 text-blue-500 opacity-20 -mr-6 -mb-6" size={180} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { title: "Tyre Record Sheet", desc: "Master ledger of all tyres (Cycle 1, 2 & 3)", icon: FileText, color: "blue" },
                  { title: "All Tyre Mileage", desc: "CPKM calculations for every asset", icon: Activity, color: "emerald" },
                  { title: "Fitment & Removal", desc: "Daily logs of tyre movements on fleet", icon: Wrench, color: "purple" },
                  { title: "Running Tyre Stock", desc: "Current inventory status & value", icon: Disc, color: "amber" },
                  { title: "Scrap Tyre Report", desc: "Disposal logs and scrap sale value", icon: AlertTriangle, color: "red" },
                  { title: "Battery & Tools", desc: "Audit logs for Jack, Tommy, & Batteries", icon: Hammer, color: "slate" },
              ].map((report, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                      <div className={`w-12 h-12 rounded-lg bg-${report.color}-50 text-${report.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <report.icon size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{report.title}</h3>
                      <p className="text-sm text-slate-500 mb-6 h-10">{report.desc}</p>
                      
                      <div className="flex gap-2">
                          <button className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                              Preview
                          </button>
                          <button 
                            onClick={() => showNotification(`Downloading ${report.title}.csv...`)}
                            className="flex-1 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 flex items-center justify-center gap-2"
                          >
                              <Download size={16} /> CSV
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const InventoryView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
               <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
               <Download size={16} /> Export CSV
            </button>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200">
                <FileSpreadsheet size={16} /> Bulk Upload
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
                <Plus size={16} /> Add Single
             </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Serial No</th>
                  <th className="p-4">Brand / Spec</th>
                  <th className="p-4">Lifecycle</th>
                  <th className="p-4">Vehicle / Pos</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">KM Run</th>
                  <th className="p-4">Vendor / Invoice</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tyres.map(tyre => (
                  <tr key={tyre.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-mono font-bold text-slate-700">{tyre.serial}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{tyre.brand}</div>
                      <div className="text-xs text-slate-500">{tyre.model} • {tyre.size}</div>
                    </td>
                    <td className="p-4">
                       {tyre.lifeCycle === 1 && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold border border-blue-100">New</span>}
                       {tyre.lifeCycle === 2 && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold border border-purple-100">Retread 1</span>}
                       {tyre.lifeCycle === 3 && <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold border border-orange-100">Retread 2</span>}
                    </td>
                    <td className="p-4">
                       {tyre.vehicleId ? (
                           <div className="text-xs">
                               <span className="font-bold block">{vehicles.find(v => v.id === tyre.vehicleId)?.regNumber}</span>
                               <span className="text-slate-500">Pos: {tyre.position}</span>
                           </div>
                       ) : (
                           <span className="text-slate-400 italic text-xs">Unmounted</span>
                       )}
                    </td>
                    <td className="p-4"><StatusBadge status={tyre.status} /></td>
                    <td className="p-4 font-mono text-xs">{tyre.totalKm.toLocaleString()}</td>
                    <td className="p-4 text-xs text-slate-500">
                        <div className="truncate w-24" title={tyre.vendor}>{tyre.vendor}</div>
                        <div className="font-mono text-[10px]">{tyre.invoice}</div>
                    </td>
                    <td className="p-4">
                      <button className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                         <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );

  const RemoldView = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Eligible for Retread</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">2</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                        <div className="flex justify-between mb-2">
                            <span className="font-mono text-xs font-bold">MRF-9988</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">72,000 km</span>
                        </div>
                        <p className="text-xs text-slate-500">Removed from GJ-06-AX-8765 due to wear.</p>
                        <button className="mt-3 w-full py-1.5 bg-slate-800 text-white text-xs rounded font-medium">Send to Vendor</button>
                    </div>
                </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-purple-900">At Vendor (In Process)</h3>
                    <span className="bg-purple-200 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">1</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {tyres.filter(t => t.status === 'RETREAD_CENTER').map(t => (
                        <div key={t.id} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                             <div className="flex justify-between mb-1">
                                <span className="font-mono text-xs font-bold">{t.serial}</span>
                                <span className="text-[10px] text-purple-600 font-medium">{t.vendor}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-3">
                                <Calendar size={10} /> Sent: {t.sentDate}
                            </div>
                            <button 
                                onClick={() => showNotification('Moved to Stock (Cycle 2)')}
                                className="w-full py-1.5 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 text-xs rounded font-bold"
                            >
                                Mark Received
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100 h-[calc(100vh-140px)] flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-red-900">Rejected / Scrap</h3>
                    <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded text-xs font-bold">1</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm opacity-75">
                    <div className="flex justify-between mb-2">
                        <span className="font-mono text-xs font-bold strike-through">K0000811924</span>
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded">Scrap</span>
                    </div>
                    <p className="text-xs text-red-500">Reason: Burst / Side Cut</p>
                </div>
            </div>
        </div>
    </div>
  );

  const AccessoriesView = () => (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
          <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Vehicle Accessories Audit</h2>
              <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Plus size={14} /> New Audit
              </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map(tool => {
                  const vehicle = vehicles.find(v => v.id === tool.vehicleId);
                  const missingCount = Object.values(tool.items).filter(v => !v).length;
                  return (
                      <div key={tool.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                      <Truck size={20} />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-800">{vehicle?.regNumber}</h4>
                                      <p className="text-xs text-slate-400">Last Audit: {tool.lastAudit}</p>
                                  </div>
                              </div>
                              {missingCount > 0 ? (
                                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">{missingCount} Missing</span>
                              ) : (
                                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">All OK</span>
                              )}
                          </div>
                          <div className="space-y-2">
                              {Object.entries(tool.items).map(([key, present]) => (
                                  <div key={key} className="flex justify-between items-center text-sm border-b border-slate-50 pb-1 last:border-0">
                                      <span className="capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                      {present ? (
                                          <CheckCircle2 size={16} className="text-emerald-500" />
                                      ) : (
                                          <AlertCircle size={16} className="text-red-500" />
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  )

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-slate-900 flex">
      {/* SIDEBAR (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-[240px] bg-[#1a1c23] text-white fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3 font-bold text-lg shadow-lg shadow-blue-500/30">T</div>
          <span className="font-bold tracking-tight text-lg">TyreMaster</span>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'inventory', label: 'Tyre Inventory', icon: Disc },
            { id: 'remold', label: 'Retread Mgmt', icon: RefreshCw },
            { id: 'tools', label: 'Tools & Battery', icon: Hammer },
            { id: 'cost', label: 'Cost Analysis', icon: Coins },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={16} strokeWidth={2} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">HM</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">Hazira Hub</p>
              <p className="text-[10px] text-slate-400 truncate">Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between shadow-sm">
          <h2 className="font-bold text-lg capitalize text-slate-800">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <Calendar size={14} /> Today: {new Date().toLocaleDateString()}
             </div>
             <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50 relative transition-colors">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          {notification && (
            <div className="fixed bottom-20 md:bottom-6 right-6 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[60]">
               <CheckCircle2 size={18} className="text-emerald-400" />
               <span className="text-sm font-medium">{notification.msg}</span>
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'remold' && <RemoldView />}
          {activeTab === 'tools' && <AccessoriesView />}
          {activeTab === 'cost' && <CostView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>
      
      {/* MILEAGE MODAL */}
      {isMileageModalOpen && <MileageUpdater />}

      {/* MOBILE NAVIGATION BAR (PWA Style) */}
      <MobileNav />
    </div>
  );
}