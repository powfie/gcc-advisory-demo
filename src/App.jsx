import React, { useState, useEffect, useRef } from 'react';
// import { createClient } from '@supabase/supabase-js'; // <-- Uncomment this when moving to Cursor!
import { 
  Search, Bell, Settings, User, Building2, Calculator, 
  Globe, BarChart3, ShieldAlert, Calendar as CalendarIcon, 
  AlertTriangle, CheckCircle2, ChevronRight, FileText, 
  TrendingUp, Clock, AlertOctagon, Layers, Menu, X, Loader2,
  Lock, Mail, LogOut, Trash2, Download, CreditCard, Shield,
  Check, Activity, Plus, FileSpreadsheet, MoreVertical, Landmark
} from 'lucide-react';

// ==========================================
// PHASE 14: DTAA REPATRIATION ANALYZER
// ==========================================

let mockSession = JSON.parse(localStorage.getItem('gcc_mock_session')) || null;
let authListeners = [];

const supabase = {
  auth: {
    getSession: async () => ({ data: { session: mockSession } }),
    onAuthStateChange: (listener) => {
      authListeners.push(listener);
      return { data: { subscription: { unsubscribe: () => { authListeners = authListeners.filter(l => l !== listener) } } } };
    },
    signUp: async () => ({ error: null }),
    signInWithPassword: async ({email}) => {
      mockSession = { user: { id: 'mock-user-123', email }, subscription: 'active' };
      localStorage.setItem('gcc_mock_session', JSON.stringify(mockSession));
      authListeners.forEach(listener => listener('SIGNED_IN', mockSession));
      return { error: null };
    },
    signOut: async () => {
      mockSession = null;
      localStorage.removeItem('gcc_mock_session');
      localStorage.removeItem('gcc_sub_status');
      authListeners.forEach(listener => listener('SIGNED_OUT', null));
    },
  },
  from: (table) => ({
    select: async () => {
      if (table === 'clients') return { data: [
        { id: 1, name: "TechNova India Pvt Ltd", entity_type: "WOS", tp_margin: "15.5% Safe Harbour", risk_status: "Green", tasks: [{id: 1, text: "File Form 3CEFA", done: false}] },
        { id: 2, name: "FinServe Global Services", entity_type: "Branch", tp_margin: "Cost Plus 10%", risk_status: "Amber", tasks: [{id: 2, text: "Review PE exposure", done: true}] },
        { id: 3, name: "HealthAI Innovation Labs", entity_type: "LLP", tp_margin: "N/A (Pending)", risk_status: "Red", tasks: [{id: 3, text: "Draft TP Study", done: false}] },
        { id: 4, name: "Quantum Logistics GCC", entity_type: "JV", tp_margin: "CUP Method", risk_status: "Green", tasks: [] }
      ], error: null };
      if (table === 'expat_travel') return { data: [
        { id: 1, client_id: 1, director_name: "James Wilson", days_in_india: 94 },
        { id: 2, client_id: 2, director_name: "Sarah Jenkins", days_in_india: 75 },
      ], error: null };
      if (table === 'team_members') return { data: [
        { id: 1, email: "partner@big4.com", role: "Admin", status: "Active" },
        { id: 2, email: "associate@big4.com", role: "Editor", status: "Active" }
      ], error: null };
      if (table === 'audit_logs') return { data: [
        { id: 1, user: "partner@big4.com", action: "Updated TP Margin", target: "FinServe Global Services", time: "1 hour ago" },
        { id: 2, user: "associate@big4.com", action: "Generated Tax Report", target: "TechNova India Pvt Ltd", time: "3 hours ago" },
        { id: 3, user: "partner@big4.com", action: "Added New Client", target: "Quantum Logistics GCC", time: "Yesterday" }
      ], error: null };
      return { data: [], error: null };
    },
    insert: async () => ({ error: null }),
    update: () => ({ eq: async () => ({ error: null }) }),
    delete: () => ({ eq: async () => ({ error: null }) })
  })
};

/* --- REAL SUPABASE CONFIGURATION (FOR CURSOR/VERCEL) ---
// const supabaseUrl = 'YOUR_URL';
// const supabaseKey = 'YOUR_KEY';
// const supabase = createClient(supabaseUrl, supabaseKey);
*/

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center border border-slate-700">
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" /> : <AlertTriangle className="w-5 h-5 text-amber-400 mr-3" />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <Building2 className="w-6 h-6 text-indigo-600 absolute" />
        </div>
        <p className="text-slate-500 font-medium mt-6 tracking-wide text-sm uppercase">Securing Enterprise Connection</p>
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  
  if (session.subscription !== 'active') {
    return <PaywallScreen session={session} onSubscribe={handleSimulateStripePayment} onSignOut={handleSignOut} />;
  }

  return <Dashboard session={session} handleSignOut={handleSignOut} />;
}

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
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
    <div className="min-h-screen bg-[#0B132B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-indigo-400/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">GCC Advisory Pro</h2>
        <p className="mt-2 text-center text-sm text-indigo-200/70 uppercase tracking-widest font-semibold">Enterprise Platform</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Work Email</label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" /></div>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-slate-900/50 text-white placeholder-slate-500 transition-all" placeholder="partner@firm.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" /></div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-slate-900/50 text-white placeholder-slate-500 transition-all" placeholder="••••••••" />
              </div>
            </div>

            {errorMsg && <div className="bg-rose-500/10 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-start border border-rose-500/20"><AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /><span>{errorMsg}</span></div>}

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 transition-all transform active:scale-[0.98]">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Partner Account' : 'Secure Sign In')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#0B132B] text-slate-500">Authorized Access Only</span></div>
            </div>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                {isSignUp ? 'Already have an account? Sign in' : 'Need partner access? Request account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
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
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 animate-in zoom-in-95 duration-500">
          
          <div className="p-10 lg:p-12 flex flex-col justify-center bg-[#0B132B] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider mb-6 border border-indigo-500/30">Partner Tier</span>
              <h2 className="text-3xl font-extrabold mb-4">Unlock the complete Tax Advisory Suite.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Join elite Big 4 partners and boutique firms using GCC Advisory Pro to instantly model entity structures and Pillar Two tax implications.
              </p>

              <div className="space-y-5">
                {[
                  'Entity Structuring Simulator',
                  'Budget 2026 Transfer Pricing Engine',
                  'Live Expatriate PE Risk Database',
                  'DTAA Repatriation Analyzer',
                  'Unlimited PDF Strategy Reports'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 mt-0.5 border border-indigo-500/30">
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{feature}</span>
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
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform active:scale-[0.98]"
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


const Dashboard = ({ session, handleSignOut }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('overview');

  const [clients, setClients] = useState([]);
  const [expats, setExpats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [isTpModalOpen, setIsTpModalOpen] = useState(false);
  const [isPeModalOpen, setIsPeModalOpen] = useState(false);
  const [isEtrModalOpen, setIsEtrModalOpen] = useState(false);
  const [isDtaaModalOpen, setIsDtaaModalOpen] = useState(false);
  
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierTab, setDossierTab] = useState('overview');

  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, text: "TechNova Form 3CEFA Due", time: "2 Days", type: "warning" },
    { id: 2, text: "FinServe PE Risk Alert", time: "Now", type: "critical" },
    { id: 3, text: "HealthAI TP Study Pending", time: "1 Week", type: "info" }
  ];

  const deadlines = [
    { id: 1, date: "May 10", task: "HealthAI Innovation Labs - TP Study Review", status: "Pending" },
    { id: 2, date: "May 15", task: "TechNova India - Form 3CEFA Filing", status: "Urgent" },
    { id: 3, date: "May 30", task: "Quantum Logistics - Master File Prep", status: "Scheduled" }
  ];
  
  const [revenue, setRevenue] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [globalRevenue, setGlobalRevenue] = useState('');
  const [indianProfit, setIndianProfit] = useState('');
  const [indianTax, setIndianTax] = useState('');
  const [etrResult, setEtrResult] = useState(null);
  const [headcount, setHeadcount] = useState('');
  const [opCost, setOpCost] = useState('');
  const [showEntityResults, setShowEntityResults] = useState(false);

  // NEW: DTAA State
  const [dtaaCountry, setDtaaCountry] = useState('US');
  const [dtaaAmount, setDtaaAmount] = useState('');
  const [dtaaResult, setDtaaResult] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review'
  });
  
  const [editingClient, setEditingClient] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  
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

  const showToast = (message, type = 'success') => setToast({ message, type });

  const getRiskBadge = (risk) => {
    const riskLevel = risk?.toLowerCase();
    switch(riskLevel) {
      case 'green': return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Compliant</span>;
      case 'amber': return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Elevated Risk</span>;
      case 'red': return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm"><AlertOctagon className="w-3.5 h-3.5 mr-1" /> Critical</span>;
      default: return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">Unknown</span>;
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

  const handleCalculateDTAA = () => {
    const amount = parseFloat(dtaaAmount);
    if (isNaN(amount)) return;
    
    let rate = 0.20; // Default non-treaty withholding rate
    if (dtaaCountry === 'US') rate = 0.15;
    if (dtaaCountry === 'UK' || dtaaCountry === 'UAE' || dtaaCountry === 'Singapore' || dtaaCountry === 'Netherlands') rate = 0.10;

    const tax = amount * rate;
    const net = amount - tax;
    setDtaaResult({ rate: rate * 100, tax, net });
  };

  const addAuditLog = async (action, target) => {
    const newLog = {
      user: session.user.email,
      action,
      target,
      time: "Just now" 
    };
    try { await supabase.from('audit_logs').insert([newLog]); } catch (e) {}
    setAuditLogs([newLog, ...auditLogs]);
  };

  const openDossier = (client) => {
    setSelectedClient(client);
    setDossierTab('overview');
    setIsDossierOpen(true);
  };

  const closeDossier = () => {
    setIsDossierOpen(false);
    setTimeout(() => setSelectedClient(null), 300); 
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const clientWithUserId = { ...newClient, user_id: session?.user?.id };
      const { data, error } = await supabase.from('clients').insert([clientWithUserId]).select();
      if (error) throw error;

      setIsAddClientModalOpen(false);
      const insertedClient = data && data.length > 0 ? data[0] : { ...clientWithUserId, id: Math.random(), tasks: [] };
      setClients([...clients, insertedClient]);
      addAuditLog("Added New Client", newClient.name);
      setNewClient({ name: '', entity_type: 'WOS', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', next_action: 'Pending Review' });
      showToast(`${newClient.name} successfully onboarded.`);
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
      
      if (selectedClient && selectedClient.id === editingClient.id) {
        setSelectedClient({...selectedClient, ...editingClient});
      }

      addAuditLog("Updated Client Details", editingClient.name);
      setIsEditClientModalOpen(false);
      showToast(`${editingClient.name} successfully updated.`);
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
      if (selectedClient && selectedClient.id === client.id) closeDossier();
      
      addAuditLog("Deleted Client", client.name);
      setIsEditClientModalOpen(false);
      showToast(`${client.name} removed from database.`);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDownloadReport = () => {
    addAuditLog("Exported PDF Report", selectedClientForReport);
    setTimeout(() => window.print(), 100);
  };

  const userEmailName = session.user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B132B] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out z-50 print:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#070D1F]">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-tight leading-tight">GCC Advisory</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise</p>
          </div>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Core Platform</p>
          
          {[
            { id: 'overview', icon: BarChart3, label: 'Executive Overview' },
            { id: 'clients', icon: Layers, label: 'Client Portfolios' },
            { id: 'reports', icon: FileText, label: 'Strategy Reports' },
            { id: 'audit', icon: Activity, label: 'Audit & Compliance' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }} 
              className={`w-full flex items-center px-4 py-3 rounded-xl group transition-all duration-200 ${currentView === item.id ? 'bg-indigo-600/15 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-800">
             <button 
              onClick={() => { setCurrentView('settings'); setSidebarOpen(false); }} 
              className={`w-full flex items-center px-4 py-3 rounded-xl group transition-all duration-200 ${currentView === 'settings' ? 'bg-indigo-600/15 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Settings className={`w-5 h-5 mr-3 transition-transform duration-200 ${currentView === 'settings' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold text-sm">Firm Settings</span>
            </button>
          </div>
        </nav>
        
        <div className="p-5 border-t border-white/5 bg-gradient-to-t from-[#070D1F] to-transparent">
          <div className="flex items-center px-4 py-3 mb-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm mr-3">
              {userEmailName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{userEmailName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Partner</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 supports-[backdrop-filter]:bg-white/60 print:hidden">
          <div className="flex items-center flex-1">
            <button className="lg:hidden mr-4 text-slate-500 hover:text-indigo-600 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="max-w-md w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input type="text" className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm" placeholder="Search clients, entities, or DTAA guidelines..." />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h4 className="font-bold text-slate-900">Alert Center</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{notifications.length} New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{notif.text}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${notif.type === 'critical' ? 'bg-rose-100 text-rose-700' : notif.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500">Click to view details</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setCurrentView('settings')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-10 pb-24 scroll-smooth print:p-0 print:overflow-visible">
          
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500 print:hidden">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentView === 'overview' && 'Executive Overview'}
              {currentView === 'clients' && 'Client Portfolios'}
              {currentView === 'reports' && 'Strategy Reports'}
              {currentView === 'audit' && 'Audit & Compliance'}
              {currentView === 'settings' && 'Firm Settings & Security'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              {currentView === 'overview' && 'High-level metrics and proprietary advisory modules.'}
              {currentView === 'clients' && 'Secure, master database of all active GCC entity structures.'}
              {currentView === 'reports' && 'Generate branded, partner-ready strategy memos.'}
              {currentView === 'audit' && 'Immutable ledger of all firm-wide data access and modifications.'}
              {currentView === 'settings' && 'Manage your advisory firm profile, team access, and subscription preferences.'}
            </p>
          </div>

          {currentView === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Active GCCs", val: clients.length, icon: Building2, color: "indigo" },
                  { label: "High Risk Entities", val: clients.filter(c => c.risk_status !== 'Green').length, icon: AlertTriangle, color: "rose" },
                  { label: "Expat PE Watchlist", val: expats.filter(e => e.days_in_india >= 60).length, icon: Globe, color: "amber" },
                  { label: "Firm Health", val: "100%", icon: Activity, color: "emerald" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center relative overflow-hidden group">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-50 rounded-full blur-2xl group-hover:bg-${stat.color}-100 transition-colors`}></div>
                    <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mr-5 ring-1 ring-${stat.color}-100 z-10`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="z-10">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className="text-3xl font-extrabold text-slate-900">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <div className="xl:col-span-2 flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> Proprietary Advisory Engines
                  </h2>
                  
                  {/* UPDATE: Added 4th module for DTAA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    
                    <div onClick={() => setIsEntityModalOpen(true)} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <Layers className="w-6 h-6 text-slate-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Entity Structuring Simulator</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Model WOS, BOT, JV, and LLP scenarios to find the optimal tax structure for inbound GCCs.</p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    <div onClick={() => setIsTpModalOpen(true)} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <Calculator className="w-6 h-6 text-slate-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Budget 2026 TP Engine</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Click to calculate the new 15.5% unified Safe Harbour margin.</p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    <div onClick={() => setIsPeModalOpen(true)} className="bg-white p-8 rounded-2xl border border-indigo-200/60 shadow-sm hover:shadow-xl hover:border-indigo-400 hover:ring-1 hover:ring-indigo-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider animate-pulse">Live Risk</div>
                      <div>
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                          <Globe className="w-6 h-6 text-rose-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">PE Risk & Expat Tracker</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Real-time monitoring of Fixed-place Establishment triggers.</p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    <div onClick={() => setIsEtrModalOpen(true)} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <BarChart3 className="w-6 h-6 text-slate-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Advanced ETR Modeling</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Pillar Two Effective Tax Rate analysis for MNCs.</p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                    {/* NEW: DTAA Repatriation Analyzer */}
                    <div onClick={() => setIsDtaaModalOpen(true)} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between sm:col-span-2 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <Landmark className="w-6 h-6 text-slate-600 group-hover:text-white" />
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 mb-2">DTAA Repatriation Analyzer</h3>
                          <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">Calculate exact withholding tax liabilities for cross-border dividend transfers under various Double Taxation Avoidance Agreements.</p>
                        </div>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="xl:col-span-1 flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" /> Compliance Deadlines
                  </h2>
                  <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex-1 p-0 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-sm">FY 2026-27 Routine</span>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="relative pl-5">
                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div>
                        <div className="absolute left-1 top-4 bottom-[-24px] w-[2px] bg-slate-100"></div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">May 2026</h4>
                        <div className="space-y-4">
                          {deadlines.map(d => (
                            <div key={d.id} className="bg-white rounded-xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-slate-900 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400"/> {d.date}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${d.status === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200/50' : 'bg-slate-100 text-slate-600 border border-slate-200/50'}`}>{d.status}</span>
                              </div>
                              <p className="text-sm text-slate-600 font-medium leading-snug">{d.task}</p>
                            </div>
                          ))}
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
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Master Database</h2>
                <button onClick={() => setIsAddClientModalOpen(true)} className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-indigo-500/25 flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Onboard Client
                </button>
              </div>
              
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden min-h-[300px] flex flex-col">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                    <p className="text-sm text-slate-500 font-medium">Loading live data...</p>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                    <p className="text-sm text-slate-700 font-bold mb-1">No clients found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-100 text-sm text-left">
                      <thead className="bg-slate-50/80 backdrop-blur-sm">
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Client Identity</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Structure</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Pricing Margin</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Health</th>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Dossier</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-50">
                        {clients.map((client) => (
                          <tr key={client.id || client.name} className="hover:bg-slate-50/60 transition-colors group cursor-pointer" onClick={() => openDossier(client)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mr-3 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  {client.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-900">{client.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">{client.entity_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-semibold">{client.tp_margin}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getRiskBadge(client.risk_status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button className="text-slate-400 group-hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
                                <ChevronRight className="w-5 h-5" />
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

          {currentView === 'reports' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8 print:hidden">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Configure Strategy Report
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Client Entity</label>
                    <select value={selectedClientForReport} onChange={(e) => setSelectedClientForReport(e.target.value)} className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium">
                      <option value="">-- Choose a Client --</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Report Module Output</label>
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium">
                      <option value="entity">Entity Structuring Assessment</option>
                      <option value="tp">Transfer Pricing Safe Harbour Profile</option>
                      <option value="pe">Permanent Establishment Risk Audit</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                   <button 
                    onClick={handleDownloadReport}
                    disabled={!selectedClientForReport}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-indigo-500/25"
                  >
                    <Download className="w-4 h-4 mr-2" /> Export Final PDF
                  </button>
                </div>
              </div>

              {selectedClientForReport && (
                <div className="animate-in fade-in duration-500">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 print:hidden">Live Document Preview</h3>
                  <div ref={reportRef} className="bg-white border border-slate-200/60 rounded-2xl shadow-xl p-12 min-h-[600px] print:p-0 print:border-none print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:bg-white">
                    <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-8 mb-10">
                      <div>
                        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">GCC Advisory Pro</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Prepared by: {userEmailName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900 mb-1 tracking-widest uppercase">Confidential Memo</p>
                        <p className="text-xs font-medium text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-xs font-medium text-slate-500">Ref: GCC-{Math.floor(Math.random() * 10000)}</p>
                      </div>
                    </div>
                    <div className="mb-10">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</p>
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedClientForReport}</h2>
                      <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                          Subject: {
                            reportType === 'entity' ? 'Entity Structuring & Setup Feasibility in India' :
                            reportType === 'tp' ? 'Transfer Pricing Methodology & Safe Harbour Election' :
                            'Permanent Establishment (PE) Risk Mitigation Strategies'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="space-y-8 text-slate-700 leading-relaxed text-base">
                      <p>Based on our preliminary analysis of your proposed Global Capability Center (GCC) operations, we have prepared the following assessment regarding your structural and compliance obligations under the Indian Income Tax Act, 1961.</p>
                      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                        <h4 className="font-extrabold text-slate-900 mb-4 text-lg">Key Findings & Recommendations</h4>
                        <ul className="space-y-4">
                          {reportType === 'entity' && (
                            <>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Optimal Structure:</strong> We recommend establishing a Wholly Owned Subsidiary (WOS) as a Private Limited Company.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Scale of Operations:</strong> Based on your inputs, the estimated headcount is <span className="font-bold text-slate-900">{headcount || '[Input in Simulator]'}</span> with an annual operating cost of <span className="font-bold text-slate-900">${opCost ? parseFloat(opCost).toLocaleString() : '[Input in Simulator]'}</span>.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Corporate Tax:</strong> Subject to a concessional corporate tax rate of 25.17% (inclusive of surcharge and cess).</span></li>
                            </>
                          )}
                          {reportType === 'tp' && (
                            <>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Methodology:</strong> Electing for the Safe Harbour rules at a 15.5% operating profit margin reduces litigation risk.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Financial Baseline:</strong> Declared IT Service Revenue of <span className="font-bold text-slate-900">₹{revenue ? parseFloat(revenue).toLocaleString('en-IN') : '[Input in TP Engine]'}</span>.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Required Safe Harbour Profit:</strong> Minimum required profit stands at <span className="font-bold text-emerald-700">₹{calculatedProfit ? calculatedProfit.toLocaleString('en-IN') : '[Calculate in TP Engine]'}</span> to remain strictly compliant.</span></li>
                            </>
                          )}
                          {reportType === 'pe' && (
                            <>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Service PE Trigger:</strong> Expatriate personnel must not exceed 90 days of physical presence in India within a 12-month period to avoid Service PE risks under relevant DTAAs.</span></li>
                              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0"/><span><strong>Fixed Place PE:</strong> Ensure the Indian entity operates independently with its own management to mitigate risks of creating a Fixed Place PE for the foreign enterprise.</span></li>
                            </>
                          )}
                        </ul>
                      </div>
                      <p className="text-sm text-slate-500 italic">* Please note that this is a preliminary assessment based on standard models. A detailed factual analysis is required before implementing any structuring decisions.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'audit' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center text-slate-900">
                    <Activity className="w-5 h-5 mr-3 text-indigo-600" />
                    <h3 className="font-extrabold text-lg">System Activity Ledger</h3>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200/50">{auditLogs.length} Records</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {auditLogs.length === 0 ? (
                    <div className="p-16 text-center">
                      <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No system activity recorded yet.</p>
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-6 flex items-start hover:bg-slate-50/60 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          <User className="w-5 h-5 text-indigo-500 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800 leading-relaxed">
                            <span className="font-extrabold text-slate-900">{log.user}</span> {log.action}{' '}
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{log.target}</span>
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center uppercase tracking-wider">
                            <Clock className="w-3 h-3 mr-1.5" /> {log.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -z-10 blur-3xl"></div>
                <div className="flex items-center mb-2">
                  <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
                  <h3 className="text-xl font-extrabold text-slate-900">Enterprise License</h3>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-8 border-b border-slate-100 pb-6">Manage your software tier and payment methods via Stripe.</p>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-indigo-100 bg-indigo-50/30 rounded-xl shadow-sm backdrop-blur-sm">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-md uppercase tracking-widest mb-3 border border-emerald-200/50"><CheckCircle2 className="w-3 h-3 mr-1" /> Active License</span>
                    <h4 className="text-2xl font-extrabold text-slate-900">GCC Professional Tier</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Full access to 4 proprietary engines and unlimited PDF generation.</p>
                  </div>
                  <div className="mt-6 md:mt-0 text-right">
                    <p className="text-4xl font-extrabold text-slate-900">$499<span className="text-base text-slate-500 font-bold ml-1">/mo</span></p>
                    <button className="mt-3 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors flex items-center justify-end w-full">
                      Manage via Stripe Portal <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <User className="w-6 h-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-extrabold text-slate-900">Access Management</h3>
                  </div>
                  <button onClick={() => setIsInviteModalOpen(true)} className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md">
                    + Invite Colleague
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-8 border-b border-slate-100 pb-6">Control which associates can view or edit sensitive GCC client structures.</p>
                <div className="overflow-x-auto border border-slate-200/60 rounded-xl shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Associate Identity</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Permission Level</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Account Status</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Revoke</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{member.email}</td>
                          <td className="px-6 py-4 font-medium text-slate-600">{member.role}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'}`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => {
                                setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                addAuditLog("Revoked Team Access", member.email);
                                showToast(`Access revoked for ${member.email}`);
                            }} className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4 ml-auto" /></button>
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

      {/* DRAWER: CLIENT DOSSIER */}
      {isDossierOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 print:hidden" onClick={closeDossier} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col border-l border-slate-200 print:hidden ${isDossierOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedClient && (
          <>
            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-none">{selectedClient.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">ID: GCC-{selectedClient.id.toString().substring(2, 6)}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  {getRiskBadge(selectedClient.risk_status)}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">{selectedClient.entity_type}</span>
                </div>
              </div>
              <button onClick={closeDossier} className="bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full p-2 transition-colors border border-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex border-b border-slate-100 px-6">
              {['overview', 'actions', 'vault'].map(tab => (
                <button 
                  key={tab} onClick={() => setDossierTab(tab)}
                  className={`py-4 px-4 text-sm font-bold capitalize tracking-wide transition-colors relative ${dossierTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'actions' ? 'Action Items' : tab}
                  {dossierTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {dossierTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tax Parameters</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Transfer Pricing Margin</p>
                        <p className="font-semibold text-slate-900">{selectedClient.tp_margin}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-sm text-slate-500 mb-1">Entity Structure</p>
                        <p className="font-semibold text-slate-900">{selectedClient.entity_type}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleOpenEdit(selectedClient)} className="w-full flex items-center justify-center py-3.5 bg-white border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm">
                    <Settings className="w-4 h-4 mr-2" /> Edit Client Parameters
                  </button>
                  <button onClick={() => handleDeleteClient(selectedClient)} className="w-full flex items-center justify-center py-3.5 bg-rose-50 border border-rose-100/80 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all shadow-sm">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove from Database
                  </button>
                </div>
              )}
              {dossierTab === 'actions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Compliance</h4>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center"><Plus className="w-4 h-4 mr-1"/> Task</button>
                  </div>
                  {selectedClient.tasks && selectedClient.tasks.length > 0 ? (
                    selectedClient.tasks.map(task => (
                      <div key={task.id} className={`p-4 rounded-xl border flex items-start cursor-pointer transition-colors ${task.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-indigo-100 shadow-sm hover:border-indigo-300'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 transition-colors ${task.done ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                          {task.done && <Check className="w-3 h-3" />}
                        </div>
                        <p className={`text-sm font-medium ${task.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-white border border-slate-200 border-dashed rounded-xl">
                      <p className="text-sm text-slate-500 font-medium">No active tasks for this client.</p>
                    </div>
                  )}
                </div>
              )}
              {dossierTab === 'vault' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button className="w-full border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 rounded-xl p-6 text-center transition-all group shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Upload Document</p>
                    <p className="text-xs text-slate-400 mt-1">TP Studies, Form 3CEFA, Incorporation Docs</p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-extrabold text-slate-900">Onboard Client</h3>
              <button onClick={() => setIsAddClientModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddClient} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                <input required name="name" type="text" className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm" placeholder="e.g. Acme Corp India" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Entity Type</label>
                  <select name="entity" className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm">
                    <option>WOS</option><option>Branch</option><option>LLP</option><option>JV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Risk Status</label>
                  <select name="risk" className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm">
                    <option>Green</option><option>Amber</option><option>Red</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">TP Margin Option</label>
                <select name="margin" className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white font-medium shadow-sm">
                  <option>15.5% Safe Harbour</option><option>Cost Plus 10%</option><option>CUP Method</option><option>Pending TP Study</option>
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex justify-center items-center transform active:scale-[0.98]">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Saving...' : 'Add to Portfolio Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW: DTAA REPATRIATION ANALYZER MODAL */}
      {isDtaaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center">
                <Landmark className="w-6 h-6 mr-2 text-indigo-600" /> DTAA Repatriation Analyzer
              </h3>
              <button onClick={() => { setIsDtaaModalOpen(false); setDtaaResult(null); }} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Parent Company Jurisdiction</label>
                <select value={dtaaCountry} onChange={(e) => setDtaaCountry(e.target.value)} className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium">
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Other">Other (Non-Treaty)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Dividend Amount to Repatriate ($)</label>
                <input type="number" value={dtaaAmount} onChange={(e) => setDtaaAmount(e.target.value)} className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium" placeholder="e.g. 5000000" />
              </div>
              <button onClick={handleCalculateDTAA} disabled={!dtaaAmount} className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex justify-center items-center transform active:scale-[0.98]">
                Calculate Withholding Tax
              </button>
              
              {dtaaResult && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Applicable DTAA Rate</span>
                    <span className="text-lg font-extrabold text-slate-900">{dtaaResult.rate}%</span>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
                    <span className="text-sm font-bold text-rose-800 uppercase tracking-wider">Withholding Tax</span>
                    <span className="text-lg font-extrabold text-rose-600">${dtaaResult.tax.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="p-6 bg-emerald-50 border border-emerald-200/60 rounded-2xl">
                    <p className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wider">Net Repatriated Cash</p>
                    <p className="text-4xl font-extrabold text-emerald-600 tracking-tight">${dtaaResult.net.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
