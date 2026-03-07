import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, Bell, Settings, User, Building2, Calculator, 
  Globe, BarChart3, ShieldAlert, Calendar as CalendarIcon, 
  AlertTriangle, CheckCircle2, ChevronRight, FileText, 
  TrendingUp, Clock, AlertOctagon, Layers, Menu, X, Loader2
} from 'lucide-react';

// ==========================================
// FINAL PHASE: LIVE SUPABASE DATA & CALCULATOR
// ==========================================

const supabaseUrl = 'https://qbugjocnswjxcyqstiyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidWdqb2Nuc3dqeGN5cXN0aXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDUwMjYsImV4cCI6MjA4ODM4MTAyNn0.eGo9lMxCSQzR5bA5UHpqhLph5bNZf4aEJ_mHgw2cCgw';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State variables for Supabase data
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State variables for Phase 4: Calculator Modal
  const [isTpModalOpen, setIsTpModalOpen] = useState(false);
  const [revenue, setRevenue] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);

  // Fetch data when the dashboard loads
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // Fetching REAL data from your Supabase database
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) {
        console.error("Supabase Error:", error.message);
        return;
      }
      
      if (data) {
        setClients(data); 
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    const riskLevel = risk?.toLowerCase();
    
    switch(riskLevel) {
      case 'green': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Compliant</span>;
      case 'amber': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" /> PE Risk</span>;
      case 'red': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"><AlertOctagon className="w-3 h-3 mr-1" /> High Alert</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Unknown</span>;
    }
  };

  const handleCalculateTP = () => {
    const revNumber = parseFloat(revenue);
    if (!isNaN(revNumber)) {
      // Budget 2026 rule: 15.5% operating margin
      setCalculatedProfit(revNumber * 0.155); 
    }
  };

  const closeModal = () => {
    setIsTpModalOpen(false);
    setRevenue('');
    setCalculatedProfit(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">GCC Advisory</span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
          <a href="#" className="flex items-center px-3 py-2.5 bg-indigo-600/10 text-indigo-400 rounded-lg group border border-indigo-500/20">
            <BarChart3 className="w-5 h-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 hover:bg-slate-800 rounded-lg group transition-colors">
            <Building2 className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">Client Entities</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 hover:bg-slate-800 rounded-lg group transition-colors">
            <Calculator className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">TP & Safe Harbour</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 hover:bg-slate-800 rounded-lg group transition-colors">
            <Globe className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">PE Risk Tracker</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Nav */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <button className="lg:hidden mr-4 text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Search clients, entities..." 
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-500 focus:outline-none">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden sm:block border-l border-slate-200 h-6 mx-2"></div>
            <button className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900">
              <span className="mr-2 hidden sm:block">Deloitte Touche</span>
              <User className="h-5 w-5 text-slate-400 bg-slate-100 rounded-full p-0.5" />
            </button>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Overview of GCC setups, compliance risks, and structuring advisory.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            
            {/* Core Advisory Modules */}
            <div className="xl:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Core Advisory Modules</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {/* Module 1 */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <Layers className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Entity Structuring Simulator</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Model WOS, BOT, JV, LLP, and EOR scenarios.</p>
                </div>

                {/* Module 2 - CLICKABLE FOR CALCULATOR */}
                <div 
                  onClick={() => setIsTpModalOpen(true)}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">NEW</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-indigo-50 rounded-lg transition-colors">
                      <Calculator className="w-6 h-6 text-indigo-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Budget 2026 TP Engine</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Click to calculate the new 15.5% unified Safe Harbour margin.</p>
                </div>

                {/* Module 3 */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <Globe className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">PE Risk & Expat Tracker</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Real-time monitoring of Fixed-place Establishment triggers.</p>
                </div>

                {/* Module 4 */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <BarChart3 className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Advanced ETR Modeling</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Pillar Two Effective Tax Rate analysis for MNCs.</p>
                </div>
              </div>
            </div>

            {/* Compliance Calendar Widget */}
            <div className="xl:col-span-1 flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Master Compliance Calendar</h2>
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-medium text-slate-700 text-sm">FY 2026-27 Routine</span>
                </div>
                
                <div className="p-5 space-y-6">
                  {/* Q1 */}
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div>
                    <div className="absolute left-0.5 top-3.5 bottom-[-24px] w-px bg-slate-200"></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Q1 (Apr - Jun)</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-900">Safe Harbour Election</span>
                          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">May 30</span>
                        </div>
                        <p className="text-xs text-slate-500">File Form 3CEFA for IT/ITeS margin</p>
                      </div>
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Q2 (Jul - Sep)</h4>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">FLA Return</span>
                        <span className="text-xs font-medium text-slate-600">Jul 15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Client Portfolio Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Active Client Portfolio</h2>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                  <p className="text-sm text-slate-500 font-medium">Loading live data from Supabase...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <p className="text-sm text-slate-500 font-medium">No clients found in your Supabase database.</p>
                </div>
              ) : (
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Client Name</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Entity Type</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">TP Margin Option</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Risk Status</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Next Action</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {clients.map((client) => (
                        <tr key={client.id || client.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-slate-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {client.entity_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                            {client.tp_margin}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRiskBadge(client.risk_status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                            {client.next_action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">Review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!isLoading && clients.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Showing {clients.length} active clients</span>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed text-sm">Prev</button>
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium">Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* THE TP ENGINE MODAL POPUP */}
      {isTpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
                Budget 2026 TP Engine
              </h3>
              <button 
                onClick={closeModal} 
                className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-500">
                Calculate the required safe harbour operating profit margin for IT/ITeS services under the unified 15.5% rule.
              </p>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Total IT Service Revenue (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-medium">
                    ₹
                  </span>
                  <input 
                    type="number" 
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="block w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors"
                    placeholder="e.g. 50000000"
                  />
                </div>
              </div>

              <button 
                onClick={handleCalculateTP}
                disabled={!revenue}
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/30"
              >
                Calculate Safe Harbour
              </button>

              {/* Result Area */}
              {calculatedProfit !== null && (
                <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-medium text-emerald-800 mb-1">Required Operating Profit (15.5%)</p>
                  <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                    ₹{calculatedProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    Compliant with Budget 2026 rules
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;