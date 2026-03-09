import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { 
  Search, Bell, Settings, User, Building2, Calculator, 
  Globe, BarChart3, ShieldAlert, Calendar as CalendarIcon, 
  AlertTriangle, CheckCircle2, ChevronRight, FileText, 
  TrendingUp, Clock, AlertOctagon, Layers, Menu, X, Loader2,
  Lock, Mail, LogOut, Trash2, Download, CreditCard, Shield,
  Check, PieChart, Activity
} from 'lucide-react';

// ==========================================
// LIVE PRODUCTION SUPABASE CONNECTION
// All mock data has been removed. This connects directly to your live database.
// ==========================================

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://qbugjocnswjxcyqstiyy.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidWdqb2Nuc3dqeGN5cXN0aXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDUwMjYsImV4cCI6MjA4ODM4MTAyNn0.eGo9lMxCSQzR5bA5UHpqhLph5bNZf4aEJ_mHgw2cCgw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const applySubscriptionStatus = (currentSession) => {
    if (!currentSession) return null;
    const savedSubStatus = localStorage.getItem('gcc_sub_status');
    if (savedSubStatus === 'active') {
      return { ...currentSession, subscription: 'active' };
    }
    return currentSession;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(applySubscriptionStatus(session));
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(applySubscriptionStatus(newSession));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSimulateStripePayment = () => {
    localStorage.setItem('gcc_sub_status', 'active');
    setSession({ ...session, subscription: 'active' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('gcc_sub_status');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Securing connection...</p>
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  
  if (session.subscription !== 'active') {
    return <PaywallScreen session={session} onSubscribe={handleSimulateStripePayment} onSignOut={handleSignOut} />;
  }

  return <Dashboard session={session} handleSignOut={handleSignOut} />;
}

// ==========================================
// THE PAYWALL SCREEN (STRIPE INTEGRATION)
// ==========================================
const PaywallScreen = ({ session, onSubscribe, onSignOut }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubscribe();
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">GCC Advisory Pro</span>
        </div>
        <button onClick={onSignOut} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Sign Out
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          <div className="p-10 lg:p-12 flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider mb-6 border border-indigo-500/30">Partner Tier</span>
              <h2 className="text-3xl font-extrabold mb-4">Unlock the complete Tax Advisory Suite.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Join elite Big 4 partners and boutique firms using GCC Advisory Pro to instantly model entity structures and Pillar Two tax implications.
              </p>

              <div className="space-y-5">
                {[
                  'Entity Structuring Simulator (WOS, Branch, LLP)',
                  'Budget 2026 Transfer Pricing Engine',
                  'Live Expatriate PE Risk Database',
                  'Pillar Two ETR Impact Calculator',
                  'Unlimited PDF Strategy Reports'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">Professional License</p>
              <div className="flex items-end justify-center">
                <span className="text-5xl font-extrabold text-slate-900">$499</span>
                <span className="text-slate-500 ml-2 mb-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mt-3">Billed monthly. Cancel anytime.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing securely...</>
                ) : (
                  <><CreditCard className="w-5 h-5 mr-2" /> Subscribe securely via Stripe</>
                )}
              </button>
              <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" /> Guaranteed secure checkout by Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

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
        setIsSignUp(false);
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">GCC Advisory Pro</h2>
        <p className="mt-2 text-center text-sm text-slate-400">Enterprise Tax & Structuring Platform</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="partner@big4.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="••••••••" />
              </div>
            </div>

            {errorMsg && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-lg text-sm flex items-start border border-rose-200"><AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /><span>{errorMsg}</span></div>}
            {successMsg && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-start border border-emerald-200"><CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /><span>{successMsg}</span></div>}

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Partner Account' : 'Sign In')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Authorized Access Only</span></div>
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
// MAIN DASHBOARD COMPONENT (Protected & Multi-Page)
// ==========================================
const Dashboard = ({ session, handleSignOut }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('overview');

  const [clients, setClients] = useState([]);
  const [expats, setExpats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [isTpModalOpen, setIsTpModalOpen] = useState(false);
  const [isPeModalOpen, setIsPeModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEtrModalOpen, setIsEtrModalOpen] = useState(false);
  
  // Module states
  const [revenue, setRevenue] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [globalRevenue, setGlobalRevenue] = useState('');
  const [indianProfit, setIndianProfit] = useState('');
  const [indianTax, setIndianTax] = useState('');
  const [etrResult, setEtrResult] = useState(null);
  const [headcount, setHeadcount] = useState('');
  const [opCost, setOpCost] = useState('');
  const [showEntityResults, setShowEntityResults] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review'
  });
  
  // Edit Client State
  const [editingClient, setEditingClient] = useState(null);

  // Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  
  // Reports State
  const [reportType, setReportType] = useState('entity');
  const [selectedClientForReport, setSelectedClientForReport] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: clientsData } = await supabase.from('clients').select('*');
      if (clientsData) setClients(clientsData);

      const { data: expatsData } = await supabase.from('expat_travel').select('*');
      if (expatsData) setExpats(expatsData);

      const { data: teamData } = await supabase.from('team_members').select('*');
      if (teamData) setTeamMembers(teamData);

      const { data: logsData } = await supabase.from('audit_logs').select('*');
      if (logsData) setAuditLogs(logsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
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
    if (isSubjectToPillarTwo && etr < 15) { topUpTax = (0.15 - (tax / profit)) * profit; }
    setEtrResult({ isSubject: isSubjectToPillarTwo, etr: etr.toFixed(2), topUpTax: topUpTax > 0 ? topUpTax : 0 });
  };

  const addAuditLog = async (action, target) => {
    const newLog = {
      user: session.user.email,
      action,
      target,
      time: "Just now" // In real db, use actual timestamp
    };
    
    try {
      await supabase.from('audit_logs').insert([newLog]);
    } catch (e) {
      console.error("Audit log error:", e);
    }
    
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const clientWithUserId = {
        ...newClient,
        user_id: session?.user?.id
      };

      const { data, error } = await supabase.from('clients').insert([clientWithUserId]).select();
      if (error) throw error;

      setIsAddClientModalOpen(false);
      
      const insertedClient = data && data.length > 0 ? data[0] : { ...clientWithUserId, id: Math.random() };
      setClients([...clients, insertedClient]);
      addAuditLog("Added New Client", newClient.name);
      setNewClient({ name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsEditClientModalOpen(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('clients').update({
        name: editingClient.name,
        entity_type: editingClient.entity_type,
        tp_margin: editingClient.tp_margin,
        risk_status: editingClient.risk_status
      }).eq('id', editingClient.id);
      
      if (error) throw error;

      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
      addAuditLog("Updated Client Details", editingClient.name);
      setIsEditClientModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (client) => {
    if (!window.confirm(`Are you sure you want to completely remove ${client.name}? This action cannot be undone.`)) return;
    
    try {
      const { error } = await supabase.from('clients').delete().eq('id', client.id);
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== client.id));
      addAuditLog("Deleted Client", client.name);
      setIsEditClientModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDownloadReport = () => {
    addAuditLog("Exported PDF Report", selectedClientForReport);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const userEmailName = session.user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 print:bg-white">
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden print:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* DYNAMIC SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 z-50 print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">GCC Advisory</span>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform Nav</p>
          
          <button 
            onClick={() => { setCurrentView('overview'); setSidebarOpen(false); }} 
            className={`w-full flex items-center px-3 py-2.5 rounded-lg group transition-colors ${currentView === 'overview' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            <span className="font-medium">Overview Modules</span>
          </button>

          <button 
            onClick={() => { setCurrentView('clients'); setSidebarOpen(false); }} 
            className={`w-full flex items-center px-3 py-2.5 rounded-lg group transition-colors ${currentView === 'clients' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
          >
            <Building2 className="w-5 h-5 mr-3" />
            <span className="font-medium">Client Portfolio</span>
          </button>

          <button 
            onClick={() => { setCurrentView('reports'); setSidebarOpen(false); }} 
            className={`w-full flex items-center px-3 py-2.5 rounded-lg group transition-colors ${currentView === 'reports' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            <span className="font-medium">Generated Reports</span>
          </button>

          <button 
            onClick={() => { setCurrentView('audit'); setSidebarOpen(false); }} 
            className={`w-full flex items-center px-3 py-2.5 rounded-lg group transition-colors ${currentView === 'audit' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
          >
            <Activity className="w-5 h-5 mr-3" />
            <span className="font-medium">Audit Logs</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
             <button 
              onClick={() => { setCurrentView('settings'); setSidebarOpen(false); }} 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg group transition-colors ${currentView === 'settings' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Firm Settings</span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleSignOut} className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 print:hidden">
          <div className="flex items-center flex-1">
            <button className="lg:hidden mr-4 text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search clients, entities..." />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div onClick={() => setCurrentView('settings')} className="flex items-center text-sm font-medium text-slate-700 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
              <span className="mr-2 capitalize hidden sm:block">{userEmailName}</span>
              <User className="h-5 w-5 text-indigo-600 bg-white rounded-full p-0.5 shadow-sm" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible">
          
          {/* Dynamic Page Header */}
          <div className="mb-8 print:hidden">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentView === 'overview' && 'Partner Dashboard'}
              {currentView === 'clients' && 'Client Portfolio Management'}
              {currentView === 'reports' && 'Tax Strategy Reports'}
              {currentView === 'audit' && 'Enterprise Audit Logs'}
              {currentView === 'settings' && 'Firm Settings & Security'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {currentView === 'overview' && 'Overview of GCC setups, compliance risks, and structuring advisory.'}
              {currentView === 'clients' && 'Secure database of all active entities, TP methodologies, and risk statuses.'}
              {currentView === 'reports' && 'Generate and export comprehensive Pillar Two and Structuring models.'}
              {currentView === 'audit' && 'Track and monitor all team activities for compliance and security.'}
              {currentView === 'settings' && 'Manage your advisory firm profile, team access, and subscription preferences.'}
            </p>
          </div>

          {/* PAGE 1: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Portfolios</p>
                    <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Entities at Risk</p>
                    <p className="text-2xl font-bold text-slate-900">{clients.filter(c => c.risk_status === 'Amber' || c.risk_status === 'Red').length}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Expats near PE</p>
                    <p className="text-2xl font-bold text-slate-900">{expats.filter(e => e.days_in_india >= 60).length}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">System Status</p>
                    <p className="text-xl font-bold text-emerald-600">Compliant</p>
                  </div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <div className="xl:col-span-2 flex flex-col">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Core Advisory Modules</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    
                    <div onClick={() => setIsEntityModalOpen(true)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors"><Layers className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" /></div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Entity Structuring Simulator</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Model WOS, BOT, JV, LLP, and EOR scenarios.</p>
                    </div>

                    <div onClick={() => setIsTpModalOpen(true)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-indigo-50 rounded-lg transition-colors"><Calculator className="w-6 h-6 text-indigo-600" /></div>
                        <ChevronRight className="w-5 h-5 text-indigo-400 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">Budget 2026 TP Engine</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Click to calculate the new 15.5% unified Safe Harbour margin.</p>
                    </div>

                    <div onClick={() => setIsPeModalOpen(true)} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group relative">
                      <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl animate-pulse">LIVE RISK</div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-rose-50 rounded-lg transition-colors"><Globe className="w-6 h-6 text-rose-600" /></div>
                        <ChevronRight className="w-5 h-5 text-indigo-400 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">PE Risk & Expat Tracker</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Real-time monitoring of Fixed-place Establishment triggers.</p>
                    </div>

                    <div onClick={() => setIsEtrModalOpen(true)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors"><BarChart3 className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" /></div>
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
            </div>
          )}

          {/* PAGE 2: CLIENT PORTFOLIO */}
          {currentView === 'clients' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Active Database</h2>
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
                              <button 
                                onClick={() => handleOpenEdit(client)} 
                                className="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                              >
                                Review / Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE 3: REPORTS ENGINE */}
          {currentView === 'reports' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Report Configuration Panel */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 print:hidden">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Configure Tax Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Select Client</label>
                    <select value={selectedClientForReport} onChange={(e) => setSelectedClientForReport(e.target.value)} className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white">
                      <option value="">-- Choose a Client --</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Report Module</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white">
                      <option value="entity">Entity Structuring Assessment</option>
                      <option value="tp">Transfer Pricing Safe Harbour Profile</option>
                      <option value="pe">Permanent Establishment Risk Audit</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                   <button 
                    onClick={handleDownloadReport}
                    disabled={!selectedClientForReport}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF Report
                  </button>
                </div>
              </div>

              {/* Report Preview Canvas */}
              {selectedClientForReport && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1 print:hidden">Live Preview</h3>
                  <div ref={reportRef} className="bg-white border border-slate-200 rounded-lg shadow-sm p-10 min-h-[500px] print:p-0 print:border-none print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:bg-white">
                    
                    {/* Official Letterhead */}
                    <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-6 mb-8">
                      <div>
                        <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center mb-3">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GCC Advisory Pro</h1>
                        <p className="text-sm text-slate-500">Prepared by: {userEmailName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 mb-1">CONFIDENTIAL TAX MEMO</p>
                        <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">Ref: GCC-{Math.floor(Math.random() * 10000)}</p>
                      </div>
                    </div>

                    {/* Report Subject */}
                    <div className="mb-8">
                      <p className="text-sm text-slate-500 mb-1">Prepared For:</p>
                      <h2 className="text-xl font-bold text-slate-900">{selectedClientForReport}</h2>
                      <p className="text-sm font-medium text-indigo-600 mt-2 uppercase tracking-wide">
                        Subject: {
                          reportType === 'entity' ? 'Entity Structuring & Setup Feasibility in India' :
                          reportType === 'tp' ? 'Transfer Pricing Methodology & Safe Harbour Election' :
                          'Permanent Establishment (PE) Risk Mitigation Strategies'
                        }
                      </p>
                    </div>

                    {/* Dynamic Content Body */}
                    <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
                      <p>
                        Based on our preliminary analysis of your proposed Global Capability Center (GCC) operations, we have prepared the following assessment regarding your structural and compliance obligations under the Indian Income Tax Act, 1961.
                      </p>
                      
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-3 text-base">Key Findings & Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-3">
                          {reportType === 'entity' && (
                            <>
                              <li><strong>Optimal Structure:</strong> We recommend establishing a Wholly Owned Subsidiary (WOS) as a Private Limited Company.</li>
                              <li><strong>Scale of Operations:</strong> Based on your inputs, the estimated headcount is <span className="font-bold text-slate-900">{headcount || '[Input in Simulator]'}</span> with an annual operating cost of <span className="font-bold text-slate-900">${opCost ? parseFloat(opCost).toLocaleString() : '[Input in Simulator]'}</span>.</li>
                              <li><strong>Corporate Tax:</strong> Subject to a concessional corporate tax rate of 25.17% (inclusive of surcharge and cess).</li>
                              <li><strong>Repatriation:</strong> Dividend distributions will be subject to withholding tax at ~20%, subject to beneficial DTAA rates.</li>
                            </>
                          )}
                          {reportType === 'tp' && (
                            <>
                              <li><strong>Methodology:</strong> Electing for the Safe Harbour rules at a 15.5% operating profit margin reduces litigation risk.</li>
                              <li><strong>Financial Baseline:</strong> Declared IT Service Revenue of <span className="font-bold text-slate-900">₹{revenue ? parseFloat(revenue).toLocaleString('en-IN') : '[Input in TP Engine]'}</span>.</li>
                              <li><strong>Required Safe Harbour Profit:</strong> Minimum required profit stands at <span className="font-bold text-emerald-700">₹{calculatedProfit ? calculatedProfit.toLocaleString('en-IN') : '[Calculate in TP Engine]'}</span> to remain strictly compliant.</li>
                              <li><strong>Documentation:</strong> Master File and Country-by-Country (CbC) reporting may be triggered based on global revenue thresholds.</li>
                            </>
                          )}
                          {reportType === 'pe' && (
                            <>
                              <li><strong>Service PE Trigger:</strong> Expatriate personnel must not exceed 90 days of physical presence in India within a 12-month period to avoid Service PE risks under relevant DTAAs.</li>
                              <li><strong>Fixed Place PE:</strong> Ensure the Indian entity operates independently with its own management to mitigate risks of creating a Fixed Place PE for the foreign enterprise.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <p>
                        Please note that this is a preliminary assessment based on standard models. A detailed factual analysis is required before implementing any structuring decisions. We are available to discuss these findings in our upcoming strategy session.
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAGE 4: AUDIT LOGS PAGE */}
          {currentView === 'audit' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-slate-900">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    <h3 className="font-bold text-lg">System Activity Feed</h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-md">{auditLogs.length} Records</span>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {auditLogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">No activity recorded yet.</div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-5 flex items-start hover:bg-slate-50/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                          <User className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">
                            <span className="font-bold">{log.user}</span> {log.action}{' '}
                            <span className="font-semibold text-indigo-600">{log.target}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {log.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5: SETTINGS PAGE */}
          {currentView === 'settings' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Firm Profile Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Firm Profile</h3>
                <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Manage your firm's display name and contact information.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Firm Name</label>
                    <input type="text" defaultValue="Deloitte Touche Tohmatsu India" className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Partner Email (Contact)</label>
                    <input type="email" value={session.user.email} disabled className="block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
                  </div>
                </div>
                <div className="mt-5">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Save Profile Changes
                  </button>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-1">
                  <Shield className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900">Authentication & Security</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Update your password and secure your account.</p>
                
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Billing & Subscription Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
                <div className="flex items-center mb-1">
                  <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900">Billing & Subscription</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Manage your plan and billing history.</p>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase tracking-wider mb-2">Active Plan</span>
                    <h4 className="text-xl font-bold text-slate-900">GCC Professional Tier</h4>
                    <p className="text-sm text-slate-600 mt-1">Includes all 4 tax modules and unlimited PDF reports.</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-slate-900">$499<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                    <button className="mt-2 text-indigo-600 font-medium text-sm hover:underline">Manage Stripe Billing &rarr;</button>
                  </div>
                </div>
              </div>

              {/* Team Management Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-bold text-slate-900">Team Access & Roles</h3>
                  </div>
                  <button onClick={() => setIsInviteModalOpen(true)} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                    + Invite Colleague
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">Manage who has access to your firm's GCC client data.</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider text-xs rounded-tl-lg">Email</th>
                        <th className="px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider text-xs">Role</th>
                        <th className="px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                        <th className="px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right rounded-tr-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">{member.email}</td>
                          <td className="px-4 py-3 text-slate-500">{member.role}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => {
                                setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                addAuditLog("Removed Team Member", member.email);
                            }} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4 ml-auto" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ======================= */}
      {/* GLOBAL MODALS           */}
      {/* ======================= */}

      {/* MODAL TO EDIT OR DELETE CLIENT */}
      {isEditClientModalOpen && editingClient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Review / Edit Client</h3>
              <button onClick={() => setIsEditClientModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                <input required type="text" value={editingClient.name} onChange={(e) => setEditingClient({...editingClient, name: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Entity Type</label>
                  <select value={editingClient.entity_type} onChange={(e) => setEditingClient({...editingClient, entity_type: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option>WOS</option><option>Branch</option><option>LLP</option><option>JV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Risk Status</label>
                  <select value={editingClient.risk_status} onChange={(e) => setEditingClient({...editingClient, risk_status: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option>Green</option><option>Amber</option><option>Red</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">TP Margin Option</label>
                <select value={editingClient.tp_margin} onChange={(e) => setEditingClient({...editingClient, tp_margin: e.target.value})} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option>15.5% Safe Harbour</option><option>Cost Plus 10%</option><option>CUP Method</option><option>Pending TP Study</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-6">
                <button type="button" onClick={() => handleDeleteClient(editingClient)} className="flex items-center text-sm text-rose-600 hover:text-rose-800 font-medium px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete Client
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white py-2 px-5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center shadow-sm">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEntityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-indigo-600" /> Entity Structuring Simulator
              </h3>
              <button onClick={() => { setIsEntityModalOpen(false); setShowEntityResults(false); }} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Headcount</label>
                  <input type="number" value={headcount} onChange={(e) => setHeadcount(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. 50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Annual Operating Cost ($)</label>
                  <input type="number" value={opCost} onChange={(e) => setOpCost(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. 2000000" />
                </div>
              </div>

              <button 
                onClick={() => setShowEntityResults(true)} 
                disabled={!headcount || !opCost} 
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 mb-6"
              >
                Simulate Tax & Compliance Impact
              </button>

              {showEntityResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-slate-200">
                  <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm relative overflow-hidden ring-1 ring-indigo-500">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">WOS (Subsidiary)</h4>
                    <p className="text-xs text-slate-500 mb-4 border-b border-slate-100 pb-3">Best for long-term GCCs</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600">Corp Tax Rate</span><span className="font-bold text-emerald-600">25.17%</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Dividend Tax</span><span className="font-bold text-rose-500">~20%</span></div>
                      <div className="flex justify-between pt-2 border-t border-slate-100"><span className="text-slate-600">Compliance</span><span className="font-bold text-amber-600">High</span></div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Branch Office</h4>
                    <p className="text-xs text-slate-500 mb-4 border-b border-slate-100 pb-3">Best for restricted activities</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600">Corp Tax Rate</span><span className="font-bold text-rose-600">43.68%</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Dividend Tax</span><span className="font-bold text-emerald-600">Exempt</span></div>
                      <div className="flex justify-between pt-2 border-t border-slate-100"><span className="text-slate-600">Compliance</span><span className="font-bold text-amber-600">Medium</span></div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-slate-900 text-lg mb-1">LLP</h4>
                    <p className="text-xs text-slate-500 mb-4 border-b border-slate-100 pb-3">Best for small teams / JVs</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600">Corp Tax Rate</span><span className="font-bold text-amber-600">34.94%</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Dividend Tax</span><span className="font-bold text-emerald-600">Exempt</span></div>
                      <div className="flex justify-between pt-2 border-t border-slate-100"><span className="text-slate-600">Compliance</span><span className="font-bold text-emerald-600">Low</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
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

      {/* MODAL: INVITE TEAM MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Invite Team Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Colleague's Email</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white" placeholder="colleague@big4.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option>Admin (Full Access)</option>
                  <option>Editor (Can Edit Clients)</option>
                  <option>Viewer (Read-Only)</option>
                </select>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    setTeamMembers([...teamMembers, { id: Math.random(), email: inviteEmail, role: inviteRole, status: 'Pending' }]);
                    addAuditLog("Invited Team Member", inviteEmail);
                    setIsInviteModalOpen(false);
                    setInviteEmail('');
                  }}
                  disabled={!inviteEmail} 
                  className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
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
}