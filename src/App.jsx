import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, Bell, Settings, User, Building2, Calculator, 
  Globe, BarChart3, ShieldAlert, Calendar as CalendarIcon, 
  AlertTriangle, CheckCircle2, ChevronRight, FileText, 
  TrendingUp, Clock, AlertOctagon, Layers, Menu, X, Loader2,
  Lock, Mail, LogOut
} from 'lucide-react';

// ==========================================
// PHASE 3: AUTHENTICATION & SECURITY
// Adds a premium Login screen to protect the app
// ==========================================

const supabaseUrl = 'https://qbugjocnswjxcyqstiyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidWdqb2Nuc3dqeGN5cXN0aXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDUwMjYsImV4cCI6MjA4ODM4MTAyNn0.eGo9lMxCSQzR5bA5UHpqhLph5bNZf4aEJ_mHgw2cCgw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Securing connection...</p>
      </div>
    );
  }

  // If no session exists, show the Login Screen
  if (!session) {
    return <AuthScreen />;
  }

  // If session exists, show the full Dashboard
  return <Dashboard session={session} />;
}

// ==========================================
// LOGIN SCREEN COMPONENT
// ==========================================
const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMsg('Account created successfully! You can now sign in.');
        setIsSignUp(false); // Switch to login view
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute top-[60%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          GCC Advisory Pro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enterprise Tax & Structuring Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="partner@big4.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="••••••••" />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Partner Account' : 'Sign In')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Authorized Access Only</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                {isSignUp ? 'Already have an account? Sign in' : 'Need partner access? Request account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD COMPONENT (Protected)
// ==========================================
const Dashboard = ({ session }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [expats, setExpats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isTpModalOpen, setIsTpModalOpen] = useState(false);
  const [isPeModalOpen, setIsPeModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEtrModalOpen, setIsEtrModalOpen] = useState(false);
  
  // TP Calculator state
  const [revenue, setRevenue] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);

  // ETR Calculator State
  const [globalRevenue, setGlobalRevenue] = useState('');
  const [indianProfit, setIndianProfit] = useState('');
  const [indianTax, setIndianTax] = useState('');
  const [etrResult, setEtrResult] = useState(null);

  // New Client Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
      if (clientsError) console.error("Supabase Clients Error:", clientsError.message);
      if (clientsData) setClients(clientsData);

      const { data: expatsData, error: expatsError } = await supabase.from('expat_travel').select('*');
      if (expatsError) console.error("Supabase Expats Error:", expatsError.message);
      if (expatsData) setExpats(expatsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const getRiskBadge = (risk) => {
    const riskLevel = risk?.toLowerCase();
    switch(riskLevel) {
      case 'green': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Compliant</span>;
      case 'amber': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" /> PE Risk</span>;
      case 'red': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"><AlertOctagon className="w-3 h-3 mr-1" /> High Alert</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Unknown</span>;
    }
  };

  const handleCalculateTP = () => {
    const revNumber = parseFloat(revenue);
    if (!isNaN(revNumber)) setCalculatedProfit(revNumber * 0.155); 
  };

  const handleCalculateETR = () => {
    const rev = parseFloat(globalRevenue);
    const profit = parseFloat(indianProfit);
    const tax = parseFloat(indianTax);

    if (isNaN(rev) || isNaN(profit) || isNaN(tax) || profit <= 0) return;

    const isSubjectToPillarTwo = rev >= 750000000;
    const etr = (tax / profit) * 100;
    let topUpTax = 0;

    if (isSubjectToPillarTwo && etr < 15) {
      topUpTax = (0.15 - (tax / profit)) * profit;
    }

    setEtrResult({ isSubject: isSubjectToPillarTwo, etr: etr.toFixed(2), topUpTax: topUpTax > 0 ? topUpTax : 0 });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('clients').insert([newClient]);
      if (error) throw error;
      setIsAddClientModalOpen(false);
      setNewClient({ name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review' });
      fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the user's email prefix to show in the header
  const userEmailName = session.user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
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
        </div>
        
        {/* NEW: Sign out button at the bottom of sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleSignOut} className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
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
            <div className="flex items-center text-sm font-medium text-slate-700 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
              <span className="mr-2 capitalize hidden sm:block">{userEmailName}</span>
              <User className="h-5 w-5 text-indigo-600 bg-white rounded-full p-0.5 shadow-sm" />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of GCC setups, compliance risks, and structuring advisory.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2 flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Core Advisory Modules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
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

                <div onClick={() => setIsTpModalOpen(true)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-indigo-50 rounded-lg transition-colors">
                      <Calculator className="w-6 h-6 text-indigo-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Budget 2026 TP Engine</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Click to calculate the new 15.5% unified Safe Harbour margin.</p>
                </div>

                <div onClick={() => setIsPeModalOpen(true)} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group relative">
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl animate-pulse">LIVE RISK</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-lg transition-colors">
                      <Globe className="w-6 h-6 text-rose-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">PE Risk & Expat Tracker</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Real-time monitoring of Fixed-place Establishment triggers.</p>
                </div>

                <div onClick={() => setIsEtrModalOpen(true)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
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

            <div className="xl:col-span-1 flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Master Compliance Calendar</h2>
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-medium text-slate-700 text-sm">FY 2026-27 Routine</span>
                </div>
                <div className="p-5 space-y-6">
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
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Active Client Portfolio</h2>
              <button onClick={() => setIsAddClientModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
                <span className="mr-1 text-lg leading-none">+</span> Add New Client
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                  <p className="text-sm text-slate-500 font-medium">Loading live data from Supabase...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                  <p className="text-sm text-slate-700 font-bold mb-1">No clients found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Client Name</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Entity Type</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">TP Margin</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Risk Status</th>
                        <th className="px-6 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {clients.map((client) => (
                        <tr key={client.id || client.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">{client.entity_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">{client.tp_margin}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getRiskBadge(client.risk_status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">Review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ALL MODALS (Add Client, TP, PE Risk, ETR) are perfectly preserved below */}
      
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Add New Client</h3>
              <button onClick={() => setIsAddClientModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Entity Type</label>
                  <select value={newClient.entity_type} onChange={(e) => setNewClient({...newClient, entity_type: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option>WOS</option><option>Branch</option><option>LLP</option><option>JV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Risk Status</label>
                  <select value={newClient.risk_status} onChange={(e) => setNewClient({...newClient, risk_status: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option>Green</option><option>Amber</option><option>Red</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">TP Margin Option</label>
                <select value={newClient.tp_margin} onChange={(e) => setNewClient({...newClient, tp_margin: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option>15.5% Safe Harbour</option><option>Cost Plus 10%</option><option>CUP Method</option><option>Pending TP Study</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Saving...' : 'Save Client to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> Budget 2026 TP Engine
              </h3>
              <button onClick={() => setIsTpModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total IT Service Revenue (₹)</label>
              <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. 50000000" />
              <button onClick={handleCalculateTP} disabled={!revenue} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">Calculate Safe Harbour</button>
              {calculatedProfit !== null && (
                <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-medium text-emerald-800 mb-1">Required Operating Profit (15.5%)</p>
                  <p className="text-3xl font-bold text-emerald-600 tracking-tight">₹{calculatedProfit.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isEtrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" /> Pillar Two ETR Model
              </h3>
              <button onClick={() => { setIsEtrModalOpen(false); setEtrResult(null); }} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Global Revenue (€)</label>
                <input type="number" value={globalRevenue} onChange={(e) => setGlobalRevenue(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" placeholder="e.g. 800000000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Indian Profit (€)</label>
                <input type="number" value={indianProfit} onChange={(e) => setIndianProfit(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" placeholder="e.g. 5000000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Indian Tax Paid (€)</label>
                <input type="number" value={indianTax} onChange={(e) => setIndianTax(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" placeholder="e.g. 500000" />
              </div>
              <div className="pt-2">
                <button onClick={handleCalculateETR} disabled={!globalRevenue || !indianProfit || !indianTax} className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">Calculate Pillar Two Impact</button>
              </div>

              {etrResult && (
                <div className={`mt-4 p-4 border rounded-xl transition-all ${!etrResult.isSubject ? 'bg-slate-50 border-slate-200' : etrResult.topUpTax > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  {!etrResult.isSubject ? (
                     <div className="text-center">
                       <p className="text-sm font-bold text-slate-700">Out of Scope</p>
                       <p className="text-xs text-slate-500 mt-1">Global revenue is under the €750M threshold.</p>
                     </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Calculated ETR:</span>
                        <span className={`text-lg font-bold ${parseFloat(etrResult.etr) < 15 ? 'text-rose-600' : 'text-emerald-600'}`}>{etrResult.etr}%</span>
                      </div>
                      {etrResult.topUpTax > 0 ? (
                        <div className="pt-3 mt-1 border-t border-rose-200">
                          <p className="text-sm font-medium text-rose-800 mb-1">Required Top-up Tax</p>
                          <p className="text-2xl font-bold text-rose-600">€{etrResult.topUpTax.toLocaleString('en-EU')}</p>
                        </div>
                      ) : (
                        <div className="pt-3 mt-1 border-t border-emerald-200">
                           <p className="text-sm font-bold text-emerald-800">Compliant (ETR ≥ 15%)</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isPeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-rose-600" /> Expat Permanent Establishment (PE) Risk
              </h3>
              <button onClick={() => setIsPeModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-slate-500 mb-6">Monitoring days spent in India to prevent triggering Service PE under DTAA guidelines (Threshold: 90 days).</p>
              
              {expats.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-700 font-semibold">No Expat Data Found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {expats.map((expat) => {
                    const days = expat.days_in_india;
                    let statusColor = "bg-emerald-500"; let bgLight = "bg-emerald-50"; let textColor = "text-emerald-700"; let warningText = "Low Risk";
                    if (days >= 90) { statusColor = "bg-rose-500"; bgLight = "bg-rose-50"; textColor = "text-rose-700"; warningText = "CRITICAL: PE TRIGGERED"; } 
                    else if (days >= 60) { statusColor = "bg-amber-500"; bgLight = "bg-amber-50"; textColor = "text-amber-700"; warningText = "Approaching Threshold"; }
                    const progressPercent = Math.min((days / 90) * 100, 100);

                    return (
                      <div key={expat.id} className={`p-4 rounded-xl border ${days >= 90 ? 'border-rose-200' : 'border-slate-200'} ${bgLight}`}>
                        <div className="flex justify-between items-end mb-2">
                          <div><p className="font-bold text-slate-900">{expat.director_name}</p><p className="text-xs text-slate-500 font-medium">Client ID: {expat.client_id}</p></div>
                          <div className="text-right"><span className={`text-xs font-bold px-2 py-1 rounded-md bg-white border border-slate-200 ${textColor}`}>{warningText}</span></div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1"><span>{days} days in India</span><span>90 Day Limit</span></div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5"><div className={`${statusColor} h-2.5 rounded-full`} style={{ width: `${progressPercent}%` }}></div></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};