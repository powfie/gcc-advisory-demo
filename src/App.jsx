// GCC Advisory Pro — Complete Single-File App
// All new features, new UI, new data. Split into components after this works.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Bell, Building2, Calculator, Globe, BarChart3, ShieldAlert,
  AlertTriangle, CheckCircle2, ChevronRight, FileText, Clock, AlertOctagon,
  Layers, Menu, X, Loader2, Lock, Mail, LogOut, Trash2, Download, CreditCard,
  Shield, Check, Activity, Plus, MoreVertical, MapPin, Info, Eye, EyeOff,
  ChevronDown, Star, Filter, Upload, Newspaper, BookOpen, FolderOpen,
  Users, Calculator as Calc, ArrowRight, Settings, User, TrendingUp
} from 'lucide-react';

// ─── Mock Session ─────────────────────────────────────────────────────────────
let mockSession = JSON.parse(localStorage.getItem('gcc_mock_session')) || null;
let authListeners = [];

const supabase = {
  auth: {
    getSession: async () => ({ data: { session: mockSession } }),
    onAuthStateChange: (listener) => {
      authListeners.push(listener);
      return { data: { subscription: { unsubscribe: () => { authListeners = authListeners.filter(l => l !== listener); } } } };
    },
    signUp: async ({ email }) => {
      mockSession = { user: { id: 'mock-' + Date.now(), email }, subscription: null };
      localStorage.setItem('gcc_mock_session', JSON.stringify(mockSession));
      authListeners.forEach(l => l('SIGNED_IN', mockSession));
      return { error: null };
    },
    signInWithPassword: async ({ email }) => {
      mockSession = { user: { id: 'mock-user-123', email }, subscription: null };
      localStorage.setItem('gcc_mock_session', JSON.stringify(mockSession));
      authListeners.forEach(l => l('SIGNED_IN', mockSession));
      return { error: null };
    },
    signOut: async () => {
      mockSession = null;
      localStorage.removeItem('gcc_mock_session');
      localStorage.removeItem('gcc_sub_status');
      authListeners.forEach(l => l('SIGNED_OUT', null));
    },
  },
  from: () => ({ select: async () => ({ data: [], error: null }), insert: async () => ({ error: null }), update: () => ({ eq: async () => ({ error: null }) }), delete: () => ({ eq: async () => ({ error: null }) }) }),
};

// ─── Full Client Dataset (8 clients) ─────────────────────────────────────────
const INITIAL_CLIENTS = [
  { id: 1, name: 'TechNova India Pvt Ltd', entity_type: 'WOS', sector: 'IT Services', parent_company: 'TechNova Inc.', parent_country: 'United States', tp_method: 'Safe Harbour', tp_margin: '15.5% Safe Harbour', risk_status: 'Green', annual_revenue_cr: 85, headcount: 320, compliance_score: 91, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [{ id: 101, text: 'File Form 3CEFA (Safe Harbour election)', done: false, due: '2026-10-31', priority: 'High' }, { id: 102, text: 'Renew ICA with TechNova Inc.', done: false, due: '2026-06-30', priority: 'Medium' }], documents: [{ id: 1001, name: 'TP Study FY2024-25.pdf', category: 'TP Documentation', uploaded: '2025-10-20', expiry: '2026-10-31', status: 'Valid' }, { id: 1002, name: 'IT Services Agreement v3.docx', category: 'ICA', uploaded: '2024-04-01', expiry: '2026-03-31', status: 'Expiring Soon' }], notices: [], related_parties: [{ id: 1, name: 'TechNova Inc. (US Parent)', country: 'US', transaction_type: 'IT Services', amount_cr: 85, tp_method: 'Safe Harbour', arm_length: true }] },
  { id: 2, name: 'FinServe Global Services', entity_type: 'Branch', sector: 'BFSI', parent_company: 'FinServe Plc.', parent_country: 'United Kingdom', tp_method: 'Cost Plus', tp_margin: 'Cost Plus 10%', risk_status: 'Amber', annual_revenue_cr: 42, headcount: 180, compliance_score: 64, cbcr_applicable: true, master_file_applicable: true, sez_entity: false, gift_city: false, tasks: [{ id: 201, text: 'Review PE exposure — James Wilson (94 days)', done: false, due: '2026-05-15', priority: 'High' }, { id: 202, text: 'File CbCR notification (Form 3CEAC)', done: false, due: '2026-10-31', priority: 'High' }], documents: [{ id: 2001, name: 'Master File FY2024-25.pdf', category: 'TP Documentation', uploaded: '2025-11-01', expiry: '2026-10-31', status: 'Valid' }], notices: [{ id: 301, type: 'Income Tax', section: '142(1)', date_received: '2026-03-10', due_date: '2026-04-10', subject: 'Details of related party transactions FY2022-23', status: 'Responded' }], related_parties: [{ id: 2, name: 'FinServe Plc. (UK Parent)', country: 'UK', transaction_type: 'Management Services', amount_cr: 8.5, tp_method: 'Cost Plus', arm_length: true }] },
  { id: 3, name: 'HealthAI Innovation Labs', entity_type: 'LLP', sector: 'Healthcare Technology', parent_company: 'HealthAI Corp.', parent_country: 'Germany', tp_method: 'Pending', tp_margin: 'N/A (Pending)', risk_status: 'Red', annual_revenue_cr: 18, headcount: 95, compliance_score: 38, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [{ id: 401, text: 'Draft TP Study — no documentation exists', done: false, due: '2026-05-10', priority: 'High' }, { id: 402, text: 'Respond to IT notice Section 142(1)', done: false, due: '2026-05-20', priority: 'High' }], documents: [], notices: [{ id: 601, type: 'Income Tax', section: '142(1)', date_received: '2026-04-20', due_date: '2026-05-20', subject: 'Furnish TP documentation for FY2023-24', status: 'Open' }], related_parties: [{ id: 4, name: 'HealthAI Corp. (Germany)', country: 'Germany', transaction_type: 'R&D Services', amount_cr: 18, tp_method: 'Pending', arm_length: null }] },
  { id: 4, name: 'Quantum Logistics GCC', entity_type: 'JV', sector: 'Supply Chain', parent_company: 'Quantum Global Ltd.', parent_country: 'Singapore', tp_method: 'CUP', tp_margin: 'CUP Method', risk_status: 'Green', annual_revenue_cr: 55, headcount: 210, compliance_score: 88, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [{ id: 501, text: 'Renew Secretarial Audit engagement', done: false, due: '2026-09-30', priority: 'Low' }], documents: [{ id: 5001, name: 'Joint Venture Agreement 2019.pdf', category: 'Corporate', uploaded: '2019-07-05', expiry: '2029-06-30', status: 'Valid' }, { id: 5002, name: 'CUP Benchmarking Study FY2024.pdf', category: 'TP Documentation', uploaded: '2024-10-25', expiry: '2025-10-31', status: 'Expired' }], notices: [], related_parties: [{ id: 5, name: 'Quantum Global Ltd. (Singapore)', country: 'Singapore', transaction_type: 'Logistics Platform License', amount_cr: 5.5, tp_method: 'CUP', arm_length: true }] },
  { id: 5, name: 'GlobalRetail India WOS', entity_type: 'WOS', sector: 'Retail Technology', parent_company: 'GlobalRetail Corp.', parent_country: 'Netherlands', tp_method: 'TNMM', tp_margin: 'TNMM — 13.2%', risk_status: 'Amber', annual_revenue_cr: 38, headcount: 155, compliance_score: 72, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [{ id: 701, text: 'Update TNMM benchmarking study (3-year refresh due)', done: false, due: '2026-09-30', priority: 'Medium' }], documents: [{ id: 7001, name: 'TNMM Study FY2023-24.pdf', category: 'TP Documentation', uploaded: '2024-10-28', expiry: '2025-10-31', status: 'Expired' }], notices: [], related_parties: [{ id: 6, name: 'GlobalRetail Corp. (Netherlands)', country: 'Netherlands', transaction_type: 'IT Services', amount_cr: 38, tp_method: 'TNMM', arm_length: true }] },
  { id: 6, name: 'NovaPharma R&D Centre', entity_type: 'WOS', sector: 'Pharmaceutical R&D', parent_company: 'NovaPharma AG', parent_country: 'Switzerland', tp_method: 'Cost Plus', tp_margin: 'Cost Plus 24% (Contract R&D)', risk_status: 'Red', annual_revenue_cr: 28, headcount: 130, compliance_score: 45, cbcr_applicable: false, master_file_applicable: false, sez_entity: true, gift_city: false, apa_status: 'Bilateral APA Filed', tasks: [{ id: 801, text: 'Respond to TPO questionnaire (AY 2023-24)', done: false, due: '2026-05-30', priority: 'High' }, { id: 802, text: 'Update APA pre-filing documentation', done: false, due: '2026-06-15', priority: 'High' }], documents: [{ id: 8001, name: 'APA Application FY2024.pdf', category: 'TP Documentation', uploaded: '2024-09-15', expiry: null, status: 'Valid' }], notices: [{ id: 901, type: 'Income Tax', section: 'TPO Reference', date_received: '2026-01-15', due_date: '2026-05-30', subject: "TP adjustment proposed — Contract R&D margin below arm's length", status: 'Open', amount_cr: 4.2 }], related_parties: [{ id: 7, name: 'NovaPharma AG (Switzerland)', country: 'Switzerland', transaction_type: 'Contract R&D Services', amount_cr: 28, tp_method: 'Cost Plus 24%', arm_length: true }] },
  { id: 7, name: 'MediaTech IFSC Unit', entity_type: 'WOS', sector: 'Financial Technology', parent_company: 'MediaTech Holdings Ltd.', parent_country: 'UAE', tp_method: 'TNMM', tp_margin: 'TNMM — 14.8%', risk_status: 'Green', annual_revenue_cr: 22, headcount: 75, compliance_score: 85, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: true, tasks: [{ id: 1001, text: 'File IFSCA annual return', done: false, due: '2026-06-30', priority: 'Medium' }], documents: [{ id: 10001, name: 'IFSCA Registration Certificate.pdf', category: 'Regulatory Approvals', uploaded: '2022-04-05', expiry: '2027-03-31', status: 'Valid' }], notices: [], related_parties: [{ id: 8, name: 'MediaTech Holdings Ltd. (UAE)', country: 'UAE', transaction_type: 'Financial Services', amount_cr: 22, tp_method: 'TNMM', arm_length: true }] },
  { id: 8, name: 'EngineerCo Branch Office', entity_type: 'Branch', sector: 'Engineering Services', parent_company: 'EngineerCo GmbH', parent_country: 'Germany', tp_method: 'Cost Plus', tp_margin: 'Cost Plus 12%', risk_status: 'Amber', annual_revenue_cr: 31, headcount: 140, compliance_score: 61, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [{ id: 1101, text: 'Monitor Sarah Jenkins PE exposure (75 days)', done: false, due: '2026-06-01', priority: 'High' }, { id: 1102, text: 'File FLA Annual Return', done: false, due: '2026-07-15', priority: 'High' }], documents: [], notices: [], related_parties: [{ id: 9, name: 'EngineerCo GmbH (Germany)', country: 'Germany', transaction_type: 'Engineering Services', amount_cr: 31, tp_method: 'Cost Plus 12%', arm_length: true }] },
];

const INITIAL_EXPATS = [
  { id: 1, client_id: 2, client_name: 'FinServe Global Services', director_name: 'James Wilson', nationality: 'British', role: 'Managing Director', days_in_india: 94, dtaa_country: 'UK', pe_risk: 'TRIGGERED' },
  { id: 2, client_id: 8, client_name: 'EngineerCo Branch Office', director_name: 'Sarah Jenkins', nationality: 'German', role: 'Technical Director', days_in_india: 75, dtaa_country: 'Germany', pe_risk: 'Approaching' },
];

const INITIAL_TEAM = [
  { id: 1, email: 'partner@big4.com', name: 'Arjun Mehta', role: 'Admin', status: 'Active' },
  { id: 2, email: 'associate@big4.com', name: 'Priya Sharma', role: 'Editor', status: 'Active' },
  { id: 3, email: 'viewer@client.com', name: 'Rahul Gupta', role: 'Viewer', status: 'Pending' },
];

const DEADLINES = [
  { id: 1, date: '2026-05-15', task: 'TechNova India — Form 3CEFA Filing', status: 'Urgent', type: 'Tax Filing' },
  { id: 2, date: '2026-05-20', task: 'HealthAI — IT Notice Response (Sec 142(1))', status: 'Urgent', type: 'Notice Response' },
  { id: 3, date: '2026-05-30', task: 'NovaPharma — TPO Questionnaire Response', status: 'Pending', type: 'Notice Response' },
  { id: 4, date: '2026-06-15', task: 'Advance Tax Q1 — All Clients', status: 'Scheduled', type: 'Tax Payment' },
  { id: 5, date: '2026-07-15', task: 'EngineerCo Branch — FLA Annual Return', status: 'Scheduled', type: 'FEMA Filing' },
  { id: 6, date: '2026-10-31', task: 'All Clients — Form 3CEB Filing Deadline', status: 'Scheduled', type: 'Tax Filing' },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[500] animate-bounce-in">
      <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center border border-slate-700 min-w-72">
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={onClose} className="ml-4 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ title, description, confirmLabel = 'Confirm', onConfirm, onCancel, variant = 'danger' }) => (
  <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-rose-50' : 'bg-amber-50'}`}>
        <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
        <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white ${variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

const RiskBadge = ({ risk }) => {
  const r = risk?.toLowerCase();
  if (r === 'green') return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Compliant</span>;
  if (r === 'amber') return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Elevated Risk</span>;
  if (r === 'red') return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertOctagon className="w-3.5 h-3.5 mr-1" />Critical</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Unknown</span>;
};

const ClientAvatar = ({ name, size = 'md' }) => {
  const colors = ['bg-indigo-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-teal-600'];
  const color = name ? colors[name.charCodeAt(0) % colors.length] : colors[0];
  const sz = size === 'lg' ? 'w-12 h-12 text-lg' : size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return <div className={`${color} ${sz} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>{name?.charAt(0).toUpperCase()}</div>;
};

const ScoreColor = (s) => s >= 80 ? 'text-emerald-600 bg-emerald-50' : s >= 60 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">{Icon && <Icon className="w-8 h-8 text-slate-400" />}</div>
    <h3 className="text-base font-bold text-slate-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-5">{description}</p>}
    {action}
  </div>
);

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────
const NAV = [
  { group: 'Intelligence',       items: [{ id: 'overview', icon: BarChart3, label: 'Command Centre' }, { id: 'regulatory', icon: Newspaper, label: 'Regulatory Feed' }] },
  { group: 'Client Management',  items: [{ id: 'clients', icon: Layers, label: 'Client Portfolios' }, { id: 'notices', icon: AlertOctagon, label: 'Notice Manager' }] },
  { group: 'Tax Tools',          items: [{ id: 'tp', icon: Calculator, label: 'Transfer Pricing' }, { id: 'fema', icon: Globe, label: 'FEMA & RBI' }, { id: 'gst', icon: FileText, label: 'GST Intelligence' }, { id: 'entity', icon: Building2, label: 'Entity Structuring' }] },
  { group: 'Advisory',           items: [{ id: 'expat', icon: Users, label: 'Expat & Payroll' }, { id: 'documents', icon: FolderOpen, label: 'Document Vault' }, { id: 'ica', icon: BookOpen, label: 'ICA Builder' }, { id: 'reports', icon: FileText, label: 'Strategy Reports' }] },
  { group: 'Operations',         items: [{ id: 'compliance', icon: Shield, label: 'Compliance Calendar' }, { id: 'audit', icon: Activity, label: 'Audit Trail' }, { id: 'settings', icon: Settings, label: 'Firm Settings' }] },
];

const PAGE_META = {
  overview: { title: 'Command Centre', sub: 'Firm-wide risk intelligence and advisory tools.' },
  regulatory: { title: 'Regulatory Intelligence Feed', sub: 'CBDT circulars, GST updates, RBI notifications and case law.' },
  clients: { title: 'Client Portfolios', sub: 'Master database of all active GCC entity structures.' },
  notices: { title: 'Notice Manager', sub: 'Track and respond to all income tax, GST and FEMA notices.' },
  tp: { title: 'Transfer Pricing Suite', sub: 'Method selection, benchmarking, APA and documentation engine.' },
  fema: { title: 'FEMA & RBI Compliance', sub: 'FDI register, FLA return, ECB tracker and repatriation modeller.' },
  gst: { title: 'GST Intelligence', sub: 'Export of services, ITC eligibility, RCM and SEZ rules.' },
  entity: { title: 'Entity Structuring Lab', sub: 'Compare entity types, model setup costs and incorporation journey.' },
  expat: { title: 'Expat & Shadow Payroll', sub: 'PE risk monitoring, residency calculator and shadow payroll.' },
  documents: { title: 'Document Vault', sub: 'Centralised storage with expiry tracking.' },
  ica: { title: 'ICA Builder', sub: 'Generate intercompany agreements from professional templates.' },
  reports: { title: 'Strategy Reports', sub: 'Build and export partner-ready advisory reports.' },
  compliance: { title: 'Compliance Calendar', sub: 'All 40+ annual filings tracked across all applicable laws.' },
  audit: { title: 'Audit Trail', sub: 'Immutable log of all firm-wide data access and modifications.' },
  settings: { title: 'Firm Settings', sub: 'Manage firm profile, team access, billing and security.' },
};

// ─── Auth Screen ──────────────────────────────────────────────────────────────
const AuthScreen = () => {
  const [view, setView] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const fn = view === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
      const { error: err } = await fn({ email, password });
      if (err) throw err;
      if (view === 'signup') setView('signin');
    } catch (err) { setError(err.message || 'Authentication failed.'); }
    finally { setLoading(false); }
  };

  const features = ['Complete Transfer Pricing Suite with benchmarking', 'Real-time PE & Expat risk monitoring', '40+ compliance filings auto-tracked', 'FEMA, GST & DTAA advisory tools', 'ICA document generation engine', 'Pillar Two / ETR modelling'];

  return (
    <div className="min-h-screen bg-[#0B132B] flex relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/8 blur-[120px]" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight">GCC Advisory Pro</span>
          <span className="ml-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest border border-indigo-500/30 px-2 py-0.5 rounded-full">Enterprise</span>
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            The complete<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">GCC tax advisory</span><br />
            platform.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">Replace 6 people worth of manual advisory work. Built for Indian GCC Transfer Pricing, FEMA, GST, and Pillar Two compliance.</p>
          <div className="grid grid-cols-2 gap-3 mb-12">
            {features.map((f, i) => (
              <div key={i} className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-2.5 mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium leading-snug">{f}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-slate-300 text-sm leading-relaxed italic mb-4">"Reduced our TP documentation time by 60%. The benchmarking engine alone saves ₹15 lakhs per client annually."</p>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3"><span className="text-indigo-300 font-bold text-xs">M</span></div>
              <span className="text-slate-400 text-xs font-semibold">Managing Partner, Big 4 Advisory Firm</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {['SOC 2 Type II', '256-bit AES', 'GDPR Compliant'].map((b, i) => (
            <div key={i} className="flex items-center text-slate-500 text-xs font-semibold"><Shield className="w-3.5 h-3.5 mr-1.5 text-slate-600" />{b}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mr-3"><Building2 className="w-6 h-6 text-white" /></div>
            <span className="text-white font-extrabold text-xl">GCC Advisory Pro</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {['signin', 'signup'].map(v => (
                <button key={v} onClick={() => { setView(v); setError(''); }}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${view === v ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}>
                  {v === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
            <div className="p-8">
              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">{view === 'signin' ? 'Welcome back' : 'Create your account'}</h3>
                  <p className="text-slate-400 text-sm">{view === 'signin' ? 'Sign in to your advisory platform.' : 'Start your 14-day free trial.'}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="partner@firm.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-start"><AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center disabled:opacity-60 active:scale-[0.98]">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{view === 'signin' ? 'Sign In Securely' : 'Start Free Trial'}</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                </button>
                <p className="text-center text-slate-600 text-xs">Demo: use any email & password</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Paywall Screen ───────────────────────────────────────────────────────────
const PaywallScreen = ({ onSubscribe, onSignOut }) => {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const tiers = [
    { name: 'Starter', monthly: 199, annual: 159, clients: '5 clients', users: '2 users', badge: null, featured: false, features: ['Client portfolio management', 'Compliance calendar (20 filings)', 'Basic TP calculator', 'DTAA rate lookup', 'PE risk tracker'], excluded: ['Benchmarking engine', 'ICA builder', 'FEMA module', 'GST intelligence'] },
    { name: 'Professional', monthly: 499, annual: 399, clients: '20 clients', users: '5 users', badge: 'Most Popular', featured: true, features: ['Everything in Starter', 'Full Transfer Pricing Suite', 'Benchmarking engine (180+ comparables)', 'ICA builder (6 templates)', 'FEMA & RBI module', 'GST intelligence & ITC checker', 'Expat & shadow payroll', 'Notice manager', 'Document vault', 'All 12 report types (PDF + DOCX)'], excluded: [] },
    { name: 'Enterprise', monthly: null, annual: null, clients: 'Unlimited clients', users: 'Unlimited users', badge: null, featured: false, features: ['Everything in Professional', 'White-label branding', 'API access', 'Dedicated account manager', 'SLA guarantee', 'Custom integrations'], excluded: [] },
  ];

  const faqs = [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your billing dashboard with no cancellation fees. Access continues until the end of your billing period.' },
    { q: 'How is client data secured?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and GDPR compliant.' },
    { q: 'How do team seats work?', a: 'Each tier includes named users. Add extra seats at ₹2,000/seat/month. Enterprise plans include unlimited seats.' },
  ];

  const handleCheckout = (tier) => {
    if (tier.name === 'Enterprise') return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubscribe(); }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3"><Building2 className="w-4 h-4 text-white" /></div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">GCC Advisory Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-amber-500">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}<span className="text-xs text-slate-500 ml-1">4.9/5 from 120+ firms</span></div>
          <button onClick={onSignOut} className="text-sm text-slate-500 hover:text-slate-900 font-medium">Sign Out</button>
        </div>
      </header>
      <div className="flex-1 px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />14-day free trial — no credit card required
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Choose your plan</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">At ₹40,000/month, a single TP penalty avoided pays for 3 years of Professional.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!annual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${annual ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-semibold ${annual ? 'text-slate-900' : 'text-slate-400'}`}>Annual <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Save 20%</span></span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <div key={tier.name} className={`bg-white rounded-3xl border p-8 flex flex-col relative shadow-sm hover:shadow-lg transition-shadow ${tier.featured ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'}`}>
              {tier.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">{tier.badge}</div>}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{tier.name}</p>
                {tier.monthly ? <div className="flex items-end gap-1"><span className="text-4xl font-extrabold text-slate-900">${annual ? tier.annual : tier.monthly}</span><span className="text-slate-500 text-sm mb-1">/month</span></div> : <div className="text-3xl font-extrabold text-slate-900">Custom</div>}
                {tier.monthly && annual && <p className="text-xs text-emerald-600 font-semibold mt-1">Save ${(tier.monthly - tier.annual) * 12}/year</p>}
              </div>
              <div className="text-xs text-slate-500 font-medium mb-6 pb-6 border-b border-slate-100">
                <div className="font-bold text-slate-700">{tier.clients}</div><div>{tier.users}</div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {tier.features.map((f, i) => <li key={i} className="flex items-start text-sm"><Check className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" /><span className="text-slate-700 font-medium">{f}</span></li>)}
                {tier.excluded.map((f, i) => <li key={i} className="flex items-start text-sm opacity-40"><X className="w-4 h-4 text-slate-400 mr-2.5 mt-0.5 flex-shrink-0" /><span className="text-slate-500">{f}</span></li>)}
              </ul>
              <button onClick={() => handleCheckout(tier)} disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 ${tier.featured ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                {loading && tier.featured ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : tier.name === 'Enterprise' ? 'Contact Sales' : <><CreditCard className="w-4 h-4" />Start Free Trial</>}
              </button>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</div>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-8 text-slate-400 text-xs"><Lock className="w-3 h-3" />Secure checkout · Cancel anytime · SOC 2 certified</div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = ({ session, onSignOut }) => {
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [expats] = useState(INITIAL_EXPATS);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'partner@big4.com', action: 'Updated TP Margin', target: 'FinServe Global Services', time: '1 hour ago' },
    { id: 2, user: 'associate@big4.com', action: 'Generated Tax Report', target: 'TechNova India Pvt Ltd', time: '3 hours ago' },
    { id: 3, user: 'partner@big4.com', action: 'Added New Client', target: 'Quantum Logistics GCC', time: 'Yesterday' },
  ]);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'James Wilson — PE Triggered (94 days)', time: 'Critical', type: 'critical', link: 'expat' },
    { id: 2, text: 'TechNova — Form 3CEFA due in 8 days', time: '8 Days', type: 'warning', link: 'compliance' },
    { id: 3, text: 'HealthAI — IT Notice response due May 20', time: '10 Days', type: 'warning', link: 'clients' },
    { id: 4, text: 'GlobalRetail — TNMM study expired', time: 'Overdue', type: 'critical', link: 'clients' },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Client state
  const [selectedClient, setSelectedClient] = useState(null);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierTab, setDossierTab] = useState('overview');
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  // Tool modals
  const [modal, setModal] = useState(null);

  // TP state
  const [tpRevenue, setTpRevenue] = useState('');
  const [tpResult, setTpResult] = useState(null);

  // ETR state
  const [etrGlobal, setEtrGlobal] = useState(''); const [etrProfit, setEtrProfit] = useState(''); const [etrTax, setEtrTax] = useState(''); const [etrResult, setEtrResult] = useState(null);

  // DTAA state
  const [dtaaCountry, setDtaaCountry] = useState('US'); const [dtaaAmount, setDtaaAmount] = useState(''); const [dtaaResult, setDtaaResult] = useState(null);

  // SEZ state
  const [sezRevenue, setSezRevenue] = useState(''); const [sezMargin, setSezMargin] = useState('15.5'); const [sezHeadcount, setSezHeadcount] = useState(''); const [sezResult, setSezResult] = useState(null);

  // Add client form
  const [newClient, setNewClient] = useState({ name: '', entity_type: 'WOS', sector: 'IT Services', parent_company: '', parent_country: 'United States', tp_method: 'Safe Harbour', risk_status: 'Green', annual_revenue_cr: '', headcount: '' });
  const [addStep, setAddStep] = useState(1);

  // Invite
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const userEmail = session?.user?.email || '';
  const userName = userEmail.split('@')[0];

  const showToast = (msg, type = 'success') => setToast({ message: msg, type, id: Date.now() });

  const addLog = (action, target) => {
    setAuditLogs(prev => [{ id: Date.now(), user: userEmail, action, target, time: 'Just now' }, ...prev]);
  };

  const showConfirm = (cfg) => setConfirm(cfg);

  const openDossier = (client, tab = 'overview') => { setSelectedClient(client); setDossierTab(tab); setDossierOpen(true); };
  const closeDossier = () => { setDossierOpen(false); };

  const deleteClient = (client) => {
    showConfirm({ title: `Remove ${client.name}?`, description: 'This permanently deletes the client and all data. This cannot be undone.', confirmLabel: 'Delete Permanently', variant: 'danger', onConfirm: () => { setClients(p => p.filter(c => c.id !== client.id)); closeDossier(); addLog('Deleted Client', client.name); showToast(`${client.name} removed.`); } });
  };

  const toggleTask = (clientId, taskId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : c));
    if (selectedClient?.id === clientId) setSelectedClient(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const client = { ...newClient, id: Date.now(), compliance_score: 70, annual_revenue_cr: Number(newClient.annual_revenue_cr) || 0, headcount: Number(newClient.headcount) || 0, tp_margin: newClient.tp_method, cbcr_applicable: false, master_file_applicable: false, sez_entity: false, gift_city: false, tasks: [], documents: [], notices: [], related_parties: [] };
    setClients(p => [...p, client]);
    addLog('Added New Client', client.name);
    showToast(`${client.name} successfully onboarded.`);
    setAddOpen(false);
    setNewClient({ name: '', entity_type: 'WOS', sector: 'IT Services', parent_company: '', parent_country: 'United States', tp_method: 'Safe Harbour', risk_status: 'Green', annual_revenue_cr: '', headcount: '' });
    setAddStep(1);
  };

  const calcTP = () => { const r = parseFloat(tpRevenue); if (!isNaN(r)) setTpResult(r * 0.155); };
  const calcETR = () => {
    const rev = parseFloat(etrGlobal), profit = parseFloat(etrProfit), tax = parseFloat(etrTax);
    if (isNaN(rev) || isNaN(profit) || isNaN(tax) || profit <= 0) return;
    const etr = (tax / profit) * 100;
    const topUp = rev >= 750000000 && etr < 15 ? (0.15 - tax / profit) * profit : 0;
    setEtrResult({ inScope: rev >= 750000000, etr: etr.toFixed(2), topUp });
  };
  const calcDTAA = () => {
    const amt = parseFloat(dtaaAmount); if (isNaN(amt)) return;
    const rates = { US: 0.15, UK: 0.10, UAE: 0.10, Singapore: 0.10, Netherlands: 0.10 };
    const rate = rates[dtaaCountry] ?? 0.20;
    setDtaaResult({ rate: rate * 100, tax: amt * rate, net: amt * (1 - rate) });
  };
  const calcSEZ = () => {
    const rev = parseFloat(sezRevenue), margin = parseFloat(sezMargin) / 100, hc = parseInt(sezHeadcount) || 0;
    if (isNaN(rev) || isNaN(margin)) return;
    const profit = rev * margin;
    const stdTax = profit * 0.2517 * 10;
    const subsidies = hc * 180 * 5;
    setSezResult({ profit, standard: stdTax, sez: 0, subsidies, savings: stdTax + subsidies });
  };

  const navTo = (id) => { setView(id); setSidebarOpen(false); };
  const filteredClients = clients.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.sector?.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'All' || c.risk_status === riskFilter;
    return matchSearch && matchRisk;
  });

  const ComingSoon = ({ title }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 text-3xl">🚧</div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 max-w-xs">This module is being built. It will appear here automatically once complete.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} onConfirm={() => { confirm.onConfirm(); setConfirm(null); }} />}

      {/* Mobile backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0B132B] text-slate-300 flex flex-col transition-transform duration-300 z-50 print:hidden flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#070D1F] flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(79,70,229,0.2)]"><Building2 className="w-5 h-5 text-white" /></div>
          <div className="flex-1 min-w-0"><h1 className="text-white font-extrabold text-base tracking-tight truncate">GCC Advisory Pro</h1><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise</p></div>
          <button className="lg:hidden text-slate-400 hover:text-white ml-2" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
          {NAV.map(group => (
            <div key={group.group}>
              <p className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">{group.group}</p>
              {group.items.map(item => (
                <button key={item.id} onClick={() => navTo(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl mb-0.5 transition-all group relative ${view === item.id ? 'bg-indigo-600/15 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                  {view === item.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" />}
                  <item.icon className={`flex-shrink-0 w-4 h-4 mr-3 ${view === item.id ? 'scale-110' : ''}`} />
                  <span className="font-semibold text-sm truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center px-3 py-2.5 mb-2 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm mr-3 flex-shrink-0">{userName.charAt(0).toUpperCase()}</div>
            <div className="overflow-hidden flex-1"><p className="text-sm font-bold text-white truncate">{userName}</p><p className="text-[10px] text-slate-500 uppercase tracking-wider">Partner · Admin</p></div>
          </div>
          <button onClick={onSignOut} className="w-full flex items-center justify-center py-2 text-sm font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 print:hidden flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden text-slate-500 hover:text-indigo-600" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <div className="flex items-center text-sm min-w-0">
              <span className="text-slate-400 font-medium hidden sm:block flex-shrink-0">GCC Advisory Pro</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 hidden sm:block flex-shrink-0" />
              <span className="font-bold text-slate-800 truncate">{PAGE_META[view]?.title || view}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} onClick={() => setView('clients')} placeholder="Search clients… (⌘K)" readOnly
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden xl:block text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">{notifications.length}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50">
                    <div><h4 className="font-bold text-slate-900 text-sm">Notifications</h4><p className="text-xs text-slate-500">{notifications.length} alerts</p></div>
                    <button onClick={() => setNotifications([])} className="text-xs font-semibold text-indigo-600">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">All caught up</div> : notifications.map(n => (
                      <div key={n.id} onClick={() => { navTo(n.link); setNotifOpen(false); }} className="flex items-start p-4 hover:bg-slate-50 cursor-pointer group">
                        <div className="flex-1"><p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">{n.text}</p><span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${n.type === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{n.time}</span></div>
                        <button onClick={e => { e.stopPropagation(); setNotifications(p => p.filter(x => x.id !== n.id)); }} className="text-slate-300 hover:text-slate-600 ml-2"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="px-6 lg:px-10 pt-8 pb-4 print:hidden">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{PAGE_META[view]?.title}</h1>
            <p className="text-slate-500 mt-1 text-sm">{PAGE_META[view]?.sub}</p>
          </div>
          <div className="px-6 lg:px-10 pb-16">

            {/* ── OVERVIEW ─── */}
            {view === 'overview' && (
              <div className="space-y-8">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active GCCs', value: clients.length, icon: Building2, color: 'indigo', onClick: () => navTo('clients') },
                    { label: 'High Risk Entities', value: clients.filter(c => c.risk_status !== 'Green').length, icon: AlertTriangle, color: 'rose', onClick: () => navTo('clients') },
                    { label: 'Expat PE Watchlist', value: expats.filter(e => e.days_in_india >= 60).length, icon: Globe, color: 'amber', onClick: () => setModal('pe') },
                    { label: 'Filings Due (30d)', value: 6, icon: Clock, color: 'violet', onClick: () => navTo('compliance') },
                  ].map((k, i) => (
                    <button key={i} onClick={k.onClick}
                      className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center text-left group">
                      <div className={`w-11 h-11 bg-${k.color}-50 text-${k.color}-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}><k.icon className="w-5 h-5" /></div>
                      <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{k.label}</p><p className="text-2xl font-extrabold text-slate-900">{k.value}</p></div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Tools */}
                  <div className="xl:col-span-2">
                    <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center"><Calculator className="w-5 h-5 mr-2 text-indigo-600" />Advisory Engines</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'entity', icon: Building2, title: 'Entity Structuring Lab', desc: 'Compare WOS, Branch, LLP, JV — model costs and timelines.', badge: null },
                        { id: 'tp', icon: Calculator, title: 'Transfer Pricing Suite', desc: 'Safe Harbour analyser, TNMM benchmarking, documentation engine.', badge: null },
                        { id: 'pe', icon: Globe, title: 'PE Risk & Expat Tracker', desc: 'Real-time monitoring of Service PE and Fixed Place PE triggers.', badge: 'Live Risk', badgeColor: 'bg-rose-500' },
                        { id: 'etr', icon: BarChart3, title: 'Pillar Two ETR Model', desc: 'GloBE income, SBIE exclusion, QDMTT offset — full modelling.', badge: null },
                        { id: 'dtaa', icon: Globe, title: 'DTAA Analyzer', desc: 'Withholding rates for 96 treaties — dividends, royalties, FTS.', badge: null },
                        { id: 'sez', icon: MapPin, title: 'GIFT City / SEZ Optimizer', desc: '10-year tax holiday model with MAT credits and state subsidies.', badge: 'High ROI', badgeColor: 'bg-emerald-500' },
                      ].map(t => (
                        <button key={t.id} onClick={() => setModal(t.id)}
                          className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col text-left relative overflow-hidden">
                          {t.badge && <div className={`absolute top-0 right-0 ${t.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider`}>{t.badge}</div>}
                          <div className="w-10 h-10 bg-slate-50 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                            <t.icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                          <h3 className="font-bold text-slate-900 mb-1.5">{t.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed flex-1">{t.desc}</p>
                          <div className="flex items-center text-indigo-600 font-semibold text-xs mt-4 group-hover:translate-x-1 transition-transform">Launch Module <ChevronRight className="w-3.5 h-3.5 ml-1" /></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center"><Clock className="w-5 h-5 mr-2 text-indigo-600" />Upcoming Deadlines</h2>
                      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">FY 2025-26</span>
                          <button onClick={() => navTo('compliance')} className="text-xs font-semibold text-indigo-600">View All →</button>
                        </div>
                        {DEADLINES.slice(0, 5).map(d => {
                          const days = Math.ceil((new Date(d.date) - new Date()) / 86400000);
                          return (
                            <div key={d.id} className="px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/60 cursor-pointer" onClick={() => navTo('compliance')}>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-xs font-bold text-slate-500">{new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${days < 0 ? 'bg-rose-100 text-rose-700' : days <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{days < 0 ? 'Overdue' : days <= 7 ? `${days}d left` : d.status}</span>
                              </div>
                              <p className="text-sm text-slate-700 font-medium leading-snug">{d.task}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-5">
                      <h3 className="text-xs font-extrabold text-slate-900 mb-4 flex items-center uppercase tracking-wider"><ShieldAlert className="w-4 h-4 mr-2 text-rose-600" />TP & CbCR Thresholds</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Local File (Form 3CEB)', threshold: "Int'l Txns > ₹1 Crore", penalty: '2% Txn Val', severe: false },
                          { label: 'Master File (Form 3CEAA)', threshold: 'Cons. Rev > ₹500 Cr', penalty: '₹5 Lakhs', severe: true },
                          { label: 'CbCR (Form 3CEAD)', threshold: 'Global Rev > ₹6,400 Cr', penalty: '₹5K/Day', severe: true },
                        ].map((t, i) => (
                          <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{t.label}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.severe ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>{t.penalty}</span>
                            </div>
                            <p className="text-sm font-extrabold text-slate-900">{t.threshold}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── CLIENTS ─── */}
            {view === 'clients' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients, sectors..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Filter className="w-4 h-4 text-slate-400" />
                    {['All', 'Green', 'Amber', 'Red'].map(f => (
                      <button key={f} onClick={() => setRiskFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${riskFilter === f ? f === 'Green' ? 'bg-emerald-600 text-white border-emerald-600' : f === 'Amber' ? 'bg-amber-500 text-white border-amber-500' : f === 'Red' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{f}</button>
                    ))}
                  </div>
                  <button onClick={() => setAddOpen(true)} className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex-shrink-0 transition-all">
                    <Plus className="w-4 h-4" />Onboard Client
                  </button>
                </div>
                <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
                  <span>{filteredClients.length} of {clients.length} clients</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{clients.filter(c => c.risk_status === 'Green').length} Compliant</span>
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />{clients.filter(c => c.risk_status === 'Amber').length} Elevated</span>
                  <span className="flex items-center gap-1"><AlertOctagon className="w-3.5 h-3.5 text-rose-500" />{clients.filter(c => c.risk_status === 'Red').length} Critical</span>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  {filteredClients.length === 0 ? (
                    <EmptyState icon={Building2} title="No clients found" description={search ? 'Try adjusting your search.' : 'Add your first GCC entity.'} action={<button onClick={() => setAddOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700">+ Onboard Client</button>} />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50/80">
                          <tr>{['Client', 'Sector', 'Entity', 'TP Method', 'Health', 'Score', ''].map(h => <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredClients.map(c => (
                            <tr key={c.id} onClick={() => openDossier(c)} className="hover:bg-slate-50/60 cursor-pointer group transition-colors">
                              <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><ClientAvatar name={c.name} size="sm" /><div><p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</p><p className="text-xs text-slate-400">{c.parent_country}</p></div></div></td>
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">{c.sector}</td>
                              <td className="px-5 py-4 whitespace-nowrap"><span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">{c.entity_type}{c.gift_city ? ' · GIFT' : ''}</span></td>
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">{c.tp_margin}</td>
                              <td className="px-5 py-4 whitespace-nowrap"><RiskBadge risk={c.risk_status} /></td>
                              <td className="px-5 py-4 whitespace-nowrap"><span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${ScoreColor(c.compliance_score)}`}>{c.compliance_score}</span></td>
                              <td className="px-5 py-4 whitespace-nowrap text-right"><ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 ml-auto transition-colors" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── AUDIT ─── */}
            {view === 'audit' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center"><Activity className="w-5 h-5 mr-3 text-indigo-600" /><h3 className="font-extrabold text-lg text-slate-900">System Activity Ledger</h3></div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-lg">{auditLogs.length} Records</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <div key={log.id} className="px-6 py-4 flex items-start hover:bg-slate-50/60 group">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                        <User className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                      </div>
                      <div><p className="text-sm text-slate-800"><span className="font-bold text-slate-900">{log.user}</span> {log.action} <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{log.target}</span></p><p className="text-xs text-slate-400 mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" />{log.time}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ─── */}
            {view === 'settings' && (
              <div className="max-w-4xl space-y-6">
                {/* License */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
                  <div className="flex items-center mb-6"><CreditCard className="w-6 h-6 text-indigo-600 mr-3" /><h3 className="text-xl font-extrabold text-slate-900">Enterprise License</h3></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-indigo-100 bg-indigo-50/30 rounded-xl">
                    <div><span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-md uppercase tracking-widest mb-3 border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" />Active License</span><h4 className="text-2xl font-extrabold text-slate-900">GCC Professional Tier</h4><p className="text-sm text-slate-600 mt-1">Full access to all modules and unlimited report generation.</p></div>
                    <div className="mt-4 md:mt-0 text-right"><p className="text-4xl font-extrabold text-slate-900">$499<span className="text-base text-slate-500 font-bold ml-1">/mo</span></p><button className="mt-3 text-indigo-600 font-bold text-sm hover:text-indigo-800 flex items-center justify-end">Manage via Stripe Portal <ChevronRight className="w-4 h-4 ml-1" /></button></div>
                  </div>
                </div>
                {/* Team */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center"><User className="w-6 h-6 text-indigo-600 mr-3" /><h3 className="text-xl font-extrabold text-slate-900">Access Management</h3></div>
                    <button onClick={() => setInviteOpen(true)} className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold">+ Invite Colleague</button>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50"><tr>{['Name', 'Email', 'Role', 'Status', ''].map(h => <th key={h} className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {team.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50/60">
                            <td className="px-5 py-3.5 font-bold text-slate-900">{m.name}</td>
                            <td className="px-5 py-3.5 text-slate-500">{m.email}</td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium">{m.role}</td>
                            <td className="px-5 py-3.5"><span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{m.status}</span></td>
                            <td className="px-5 py-3.5 text-right"><button onClick={() => showConfirm({ title: `Revoke access for ${m.email}?`, description: 'This user will immediately lose all access.', confirmLabel: 'Revoke Access', variant: 'danger', onConfirm: () => { setTeam(p => p.filter(x => x.id !== m.id)); addLog('Revoked Access', m.email); showToast(`Access revoked for ${m.email}`); } })} className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── REPORTS ─── */}
            {view === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 print:hidden">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4"><FileText className="w-5 h-5 mr-2 text-indigo-600" />Configure Strategy Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Select Client Entity</label><select className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 shadow-sm font-medium text-sm"><option value="">-- Choose a Client --</option>{clients.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Report Type</label><select className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 shadow-sm font-medium text-sm"><option>Entity Structuring Assessment</option><option>Transfer Pricing Position Paper</option><option>PE Risk Assessment</option><option>Pillar Two ETR Analysis</option><option>DTAA Position Paper</option><option>SEZ Feasibility Study</option></select></div>
                  </div>
                  <div className="flex justify-end"><button onClick={() => { addLog('Exported PDF Report', 'Selected Client'); showToast('Report exported successfully.'); window.print(); }} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md"><Download className="w-4 h-4 mr-2" />Export PDF</button></div>
                </div>
              </div>
            )}

            {/* ── ALL OTHER PAGES ─── */}
            {!['overview', 'clients', 'audit', 'settings', 'reports'].includes(view) && (
              <ComingSoon title={PAGE_META[view]?.title || view} />
            )}
          </div>
        </main>
      </div>

      {/* ── CLIENT DOSSIER ─── */}
      {dossierOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] print:hidden" onClick={closeDossier} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200 print:hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${dossierOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedClient && (() => {
          const c = selectedClient;
          return (
            <>
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3"><ClientAvatar name={c.name} size="lg" /><div><h2 className="font-extrabold text-slate-900 text-lg leading-tight">{c.name}</h2><p className="text-xs text-slate-400 mt-0.5">{c.parent_company} · {c.parent_country}</p></div></div>
                  <button onClick={closeDossier} className="bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm flex-shrink-0"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap"><RiskBadge risk={c.risk_status} /><span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">{c.entity_type}{c.gift_city ? ' · GIFT' : ''}</span>{c.sez_entity && <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">SEZ</span>}{c.cbcr_applicable && <span className="text-xs font-bold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-md border border-violet-200">CbCR</span>}</div>
                  <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Score</p><p className={`text-2xl font-extrabold ${c.compliance_score >= 80 ? 'text-emerald-600' : c.compliance_score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>{c.compliance_score}</p></div>
                </div>
              </div>
              <div className="flex border-b border-slate-100 px-4 overflow-x-auto flex-shrink-0">
                {['overview', 'tasks', 'tp', 'documents', 'notices', 'timeline'].map(tab => (
                  <button key={tab} onClick={() => setDossierTab(tab)} className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-colors relative flex-shrink-0 capitalize ${dossierTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab === 'tp' ? 'TP Register' : tab}
                    {dossierTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                {dossierTab === 'overview' && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Entity Profile</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {[['PAN', c.pan], ['GSTIN', c.gstin], ['Sector', c.sector], ['Revenue (₹ Cr)', c.annual_revenue_cr], ['Headcount', c.headcount], ['FY End', c.fy_end || 'March 31'], ['TP Method', c.tp_method]].map(([label, val]) => (
                          <div key={label}><p className="text-slate-400 text-xs mb-0.5">{label}</p><p className="font-semibold text-slate-900 truncate">{val || '—'}</p></div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ label: 'Open Tasks', value: c.tasks?.filter(t => !t.done).length || 0, color: 'text-indigo-600' }, { label: 'Documents', value: c.documents?.length || 0, color: 'text-slate-700' }, { label: 'Notices', value: c.notices?.length || 0, color: c.notices?.length ? 'text-rose-600' : 'text-slate-700' }].map(s => (
                        <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3.5 text-center shadow-sm"><p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p></div>
                      ))}
                    </div>
                    <button onClick={() => deleteClient(c)} className="w-full flex items-center justify-center py-3 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all"><Trash2 className="w-4 h-4 mr-2" />Remove Client from Database</button>
                  </div>
                )}
                {dossierTab === 'tasks' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2"><h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</h4><button className="text-xs text-indigo-600 font-bold flex items-center"><Plus className="w-3.5 h-3.5 mr-1" />Add Task</button></div>
                    {c.tasks?.length > 0 ? c.tasks.map(task => (
                      <div key={task.id} onClick={() => toggleTask(c.id, task.id)} className={`p-4 rounded-xl border flex items-start cursor-pointer transition-all ${task.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-indigo-100 shadow-sm hover:border-indigo-300'}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 transition-all ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>{task.done && <Check className="w-3 h-3 text-white" />}</div>
                        <div className="flex-1"><p className={`text-sm font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.text}</p>
                          {task.due && <p className="text-xs text-slate-400 mt-1 flex items-center gap-2"><Clock className="w-3 h-3" />{new Date(task.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{task.priority === 'High' && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">HIGH</span>}</p>}
                        </div>
                      </div>
                    )) : <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl"><p className="text-sm text-slate-400">No tasks yet.</p></div>}
                  </div>
                )}
                {dossierTab === 'tp' && (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Party Transactions</h4>
                    {c.related_parties?.length > 0 ? c.related_parties.map(rp => (
                      <div key={rp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2"><p className="font-bold text-slate-900 text-sm">{rp.name}</p>{rp.arm_length === true ? <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Arm's Length ✓</span> : rp.arm_length === null ? <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Under Review</span> : null}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">{[['Type', rp.transaction_type], ['Amount', `₹${rp.amount_cr} Cr`], ['Method', rp.tp_method]].map(([l, v]) => <div key={l}><p className="text-slate-400">{l}</p><p className="font-semibold text-slate-700">{v}</p></div>)}</div>
                      </div>
                    )) : <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl"><p className="text-sm text-slate-400">No transactions recorded.</p></div>}
                  </div>
                )}
                {dossierTab === 'documents' && (
                  <div className="space-y-3">
                    <button className="w-full border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 rounded-xl p-5 text-center group transition-all"><div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"><Upload className="w-4 h-4" /></div><p className="text-sm font-bold text-slate-700">Upload Document</p><p className="text-xs text-slate-400 mt-0.5">TP Studies · ICA · Regulatory Approvals</p></button>
                    {c.documents?.map(doc => <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm"><div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-indigo-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p><p className="text-xs text-slate-400 mt-0.5">{doc.category} · {doc.uploaded}</p></div><span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 border ${doc.status === 'Valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : doc.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{doc.status}</span></div>)}
                  </div>
                )}
                {dossierTab === 'notices' && (
                  <div className="space-y-3">
                    {c.notices?.length > 0 ? c.notices.map(n => <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><div className="flex items-start justify-between mb-1.5"><p className="font-bold text-sm text-slate-900">{n.type} · Section {n.section}</p><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${n.status === 'Open' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{n.status}</span></div><p className="text-xs text-slate-500 mb-2">{n.subject}</p><div className="flex gap-4 text-xs text-slate-400"><span>Received: {n.date_received}</span><span>Due: {n.due_date}</span></div>{n.amount_cr && <div className="mt-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5">Amount in dispute: ₹{n.amount_cr} Crore</div>}</div>) : <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl"><p className="text-2xl mb-2">🎉</p><p className="text-sm text-slate-400 font-medium">No notices for this client.</p></div>}
                  </div>
                )}
                {dossierTab === 'timeline' && (
                  <div className="space-y-3">
                    {auditLogs.filter(l => l.target === c.name).length > 0 ? auditLogs.filter(l => l.target === c.name).map(log => <div key={log.id} className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0"><span className="text-indigo-600 font-bold text-xs">{log.user.charAt(0).toUpperCase()}</span></div><div className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm"><p className="text-sm text-slate-700"><span className="font-bold text-slate-900">{log.user}</span> {log.action}</p><p className="text-xs text-slate-400 mt-1">{log.time}</p></div></div>) : <div className="text-center py-10 text-sm text-slate-400">No activity for this client yet.</div>}
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </div>

      {/* ── ADD CLIENT MODAL ─── */}
      {addOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50">
              <div><h3 className="text-lg font-extrabold text-slate-900">Onboard New Client</h3><p className="text-xs text-slate-500 mt-0.5">Step {addStep} of 2 — {addStep === 1 ? 'Entity Identity' : 'Compliance Setup'}</p></div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">{[1, 2].map(s => <div key={s} className={`h-1.5 rounded-full transition-all ${addStep >= s ? 'bg-indigo-600 w-8' : 'bg-slate-200 w-4'}`} />)}</div>
                <button onClick={() => { setAddOpen(false); setAddStep(1); }} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <form onSubmit={handleAddClient}>
              <div className="p-7 space-y-4 max-h-[65vh] overflow-y-auto">
                {addStep === 1 ? (
                  <>
                    {[['Company Legal Name', 'name', 'text', 'e.g. Acme Technology India Pvt Ltd', true], ['Parent Company Name', 'parent_company', 'text', 'e.g. Acme Corp Inc.', false]].map(([label, key, type, ph, req]) => (
                      <div key={key}><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{label}{req && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <input required={req} type={type} value={newClient[key]} onChange={e => setNewClient(p => ({ ...p, [key]: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder={ph} /></div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Entity Type</label><select value={newClient.entity_type} onChange={e => setNewClient(p => ({ ...p, entity_type: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm">{['WOS', 'Branch', 'LLP', 'JV', 'GIFT City', 'Liaison Office'].map(o => <option key={o}>{o}</option>)}</select></div>
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Parent Country</label><select value={newClient.parent_country} onChange={e => setNewClient(p => ({ ...p, parent_country: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm">{['United States', 'United Kingdom', 'Germany', 'Singapore', 'Netherlands', 'Switzerland', 'Japan', 'Australia', 'UAE', 'France', 'Other'].map(o => <option key={o}>{o}</option>)}</select></div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Sector</label><select value={newClient.sector} onChange={e => setNewClient(p => ({ ...p, sector: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm">{['IT Services', 'BFSI', 'Healthcare Technology', 'Supply Chain & Logistics', 'Retail Technology', 'Pharmaceutical R&D', 'Financial Technology', 'Engineering Services', 'Other'].map(o => <option key={o}>{o}</option>)}</select></div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Annual Revenue (₹ Cr)</label><input type="number" value={newClient.annual_revenue_cr} onChange={e => setNewClient(p => ({ ...p, annual_revenue_cr: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder="e.g. 85" /></div>
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Headcount</label><input type="number" value={newClient.headcount} onChange={e => setNewClient(p => ({ ...p, headcount: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder="e.g. 320" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">TP Method</label><select value={newClient.tp_method} onChange={e => setNewClient(p => ({ ...p, tp_method: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm">{['Safe Harbour', 'TNMM', 'Cost Plus', 'CUP', 'RPM', 'Profit Split (PSM)', 'Pending'].map(o => <option key={o}>{o}</option>)}</select></div>
                      <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Risk Status</label><select value={newClient.risk_status} onChange={e => setNewClient(p => ({ ...p, risk_status: e.target.value }))} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"><option>Green</option><option>Amber</option><option>Red</option></select></div>
                    </div>
                  </>
                )}
              </div>
              <div className="px-7 pb-7 flex gap-3">
                {addStep === 1 ? <button type="button" onClick={() => setAddStep(2)} disabled={!newClient.name.trim()} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-40">Next: Compliance Setup →</button>
                  : <><button type="button" onClick={() => setAddStep(1)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">← Back</button><button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold">✓ Onboard Client</button></>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INVITE MODAL ─── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900">Invite Team Member</h3><button onClick={() => setInviteOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
            <div className="p-7 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label><input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder="colleague@firm.com" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Role</label><select className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"><option>Admin</option><option>Editor</option><option>Viewer</option></select></div>
              <button disabled={!inviteEmail} onClick={() => { setTeam(p => [...p, { id: Date.now(), email: inviteEmail, name: inviteEmail.split('@')[0], role: 'Editor', status: 'Pending' }]); addLog('Invited Team Member', inviteEmail); showToast(`Invitation sent to ${inviteEmail}`); setInviteOpen(false); setInviteEmail(''); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50">Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOOL MODALS ─── */}
      {modal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          {modal === 'tp' && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900 flex items-center"><Calculator className="w-5 h-5 mr-2 text-indigo-600" />Budget 2026 TP Engine</h3><button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-7 space-y-5">
                <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Total IT Service Revenue (₹)</label><input type="number" value={tpRevenue} onChange={e => setTpRevenue(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder="e.g. 50000000" /></div>
                <button onClick={calcTP} disabled={!tpRevenue} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Calculate Safe Harbour (15.5%)</button>
                {tpResult !== null && <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl"><p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Required Operating Profit</p><p className="text-3xl font-extrabold text-emerald-600">₹{tpResult.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p><p className="text-xs text-emerald-700 mt-1">At 15.5% Safe Harbour margin (Budget 2026 rate)</p></div>}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1"><p className="font-bold text-slate-800">Safe Harbour Conditions:</p><p>• IT/ITeS services to non-resident entity</p><p>• Annual turnover ≤ ₹200 Crore</p><p>• Form 3CEFA filed by 31 October</p><p>• Minimum 3 consecutive year commitment</p></div>
              </div>
            </div>
          )}
          {modal === 'etr' && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />Pillar Two ETR Model</h3><button onClick={() => { setModal(null); setEtrResult(null); }} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-7 space-y-4">
                {[['Global Revenue (€)', etrGlobal, setEtrGlobal, 'e.g. 800000000'], ['Indian GloBE Profit (€)', etrProfit, setEtrProfit, 'e.g. 5000000'], ['Indian Covered Taxes (€)', etrTax, setEtrTax, 'e.g. 500000']].map(([label, val, setter, ph]) => (
                  <div key={label}><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label><input type="number" value={val} onChange={e => setter(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder={ph} /></div>
                ))}
                <button onClick={calcETR} disabled={!etrGlobal || !etrProfit || !etrTax} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Calculate Pillar Two Impact</button>
                {etrResult && <div className={`p-5 border rounded-2xl ${!etrResult.inScope ? 'bg-slate-50 border-slate-200' : etrResult.topUp > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  {!etrResult.inScope ? <div className="text-center"><p className="font-bold text-slate-800">Out of Scope</p><p className="text-sm text-slate-500 mt-1">Revenue below €750M threshold</p></div> : <>
                    <div className="flex justify-between items-center mb-3"><span className="text-sm font-bold text-slate-700 uppercase tracking-wider">ETR:</span><span className={`text-2xl font-extrabold ${parseFloat(etrResult.etr) < 15 ? 'text-rose-600' : 'text-emerald-600'}`}>{etrResult.etr}%</span></div>
                    {etrResult.topUp > 0 ? <div className="pt-3 border-t border-rose-200"><p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">Top-up Tax Required</p><p className="text-2xl font-extrabold text-rose-600">€{etrResult.topUp.toLocaleString()}</p></div> : <div className="pt-3 border-t border-emerald-200 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" /><p className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider">Compliant — ETR ≥ 15%</p></div>}
                  </>}
                </div>}
              </div>
            </div>
          )}
          {modal === 'pe' && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900 flex items-center"><Globe className="w-5 h-5 mr-2 text-rose-600" />PE Risk & Expat Tracker</h3><button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-7 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">Service PE threshold: <strong>90 days</strong> in any 12-month period under most DTAAs. Fixed Place PE triggers if expat has a dedicated office.</div>
                {INITIAL_EXPATS.map(e => {
                  const pct = Math.min((e.days_in_india / 90) * 100, 100);
                  const color = e.days_in_india >= 90 ? 'bg-rose-500' : e.days_in_india >= 60 ? 'bg-amber-500' : 'bg-emerald-500';
                  const textColor = e.days_in_india >= 90 ? 'text-rose-700' : e.days_in_india >= 60 ? 'text-amber-700' : 'text-emerald-700';
                  const bgColor = e.days_in_india >= 90 ? 'bg-rose-50 border-rose-200' : e.days_in_india >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
                  return (
                    <div key={e.id} className={`p-5 rounded-2xl border ${bgColor}`}>
                      <div className="flex justify-between items-start mb-3"><div><p className="font-extrabold text-slate-900">{e.director_name}</p><p className="text-xs text-slate-500 mt-0.5">{e.client_name} · {e.nationality} · DTAA: {e.dtaa_country}</p></div><span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm uppercase tracking-wider ${textColor}`}>{e.pe_risk}</span></div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider"><span className={textColor}>{e.days_in_india} days</span><span>90 day limit</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200"><div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {modal === 'dtaa' && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900 flex items-center"><Globe className="w-5 h-5 mr-2 text-indigo-600" />DTAA Analyzer</h3><button onClick={() => { setModal(null); setDtaaResult(null); }} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-7 space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Treaty Country</label><select value={dtaaCountry} onChange={e => setDtaaCountry(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm">{[['US', 'United States (15%)'], ['UK', 'United Kingdom (10%)'], ['UAE', 'United Arab Emirates (10%)'], ['Singapore', 'Singapore (10%)'], ['Netherlands', 'Netherlands (10%)'], ['Germany', 'Germany (10%)'], ['OTHER', 'Other (20% — no treaty / no benefit)']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Payment Amount (₹)</label><input type="number" value={dtaaAmount} onChange={e => setDtaaAmount(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder="e.g. 10000000" /></div>
                <button onClick={calcDTAA} disabled={!dtaaAmount} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Calculate Withholding Tax</button>
                {dtaaResult && <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">WHT Rate</p><p className="text-2xl font-extrabold text-indigo-600">{dtaaResult.rate}%</p></div>
                    <div><p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Tax Withheld</p><p className="text-2xl font-extrabold text-rose-600">₹{dtaaResult.tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p></div>
                    <div><p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Net Remittance</p><p className="text-2xl font-extrabold text-emerald-600">₹{dtaaResult.net.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p></div>
                  </div>
                </div>}
              </div>
            </div>
          )}
          {modal === 'sez' && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50 flex-shrink-0"><div><h3 className="text-lg font-extrabold text-slate-900 flex items-center"><MapPin className="w-5 h-5 mr-2 text-indigo-600" />SEZ/GIFT City Tax Optimizer</h3><p className="text-xs text-slate-500 mt-0.5">10-year tax holiday forecast with MAT credits and state subsidies</p></div><button onClick={() => { setModal(null); setSezResult(null); }} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-7 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Financial Projections</h4>
                      {[['Annual Revenue ($)', sezRevenue, setSezRevenue, 'e.g. 5000000'], ['Operating Margin (%)', sezMargin, setSezMargin, '15.5'], ['Headcount', sezHeadcount, setSezHeadcount, 'e.g. 100']].map(([label, val, setter, ph]) => (
                        <div key={label} className="mb-4"><label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label><input type="number" value={val} onChange={e => setter(e.target.value)} className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm" placeholder={ph} /></div>
                      ))}
                      <button onClick={calcSEZ} disabled={!sezRevenue || !sezMargin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-40">Generate Optimization Model</button>
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    {sezResult ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">10-Year Cumulative Savings</h4>
                          <p className="text-4xl font-extrabold text-emerald-600">${sezResult.savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                          <p className="text-sm text-emerald-700 mt-1">vs. standard WOS corporate tax structure</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Tax (10yr)</p><p className="text-2xl font-extrabold text-slate-900">${sezResult.standard.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p><p className="text-xs text-slate-400 mt-1">At 25.17% effective rate</p></div>
                          <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm"><p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">SEZ/IFSC Tax (10yr)</p><p className="text-2xl font-extrabold text-indigo-600">$0</p><p className="text-xs text-indigo-400 mt-1">100% exemption (Sec 80LA)</p></div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                          <h4 className="font-bold text-slate-900 mb-3 text-sm">Professional Notes</h4>
                          <div className="space-y-3 text-xs text-slate-600">
                            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><p><strong>MAT (9%):</strong> IFSC units pay 9% MAT, but it is fully creditable against future tax — net-zero impact during holiday.</p></div>
                            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><p><strong>State Subsidies:</strong> Estimated PF reimbursements of ${sezResult.subsidies.toLocaleString('en-US', { maximumFractionDigits: 0 })} over 5 years based on {sezHeadcount} headcount.</p></div>
                            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><p><strong>FEMA:</strong> GIFT City entities treated as non-residents — free repatriation without standard RBI approvals.</p></div>
                          </div>
                        </div>
                      </div>
                    ) : <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-slate-50"><MapPin className="w-12 h-12 text-slate-300 mb-4" /><h4 className="text-lg font-bold text-slate-700">Awaiting Parameters</h4><p className="text-sm text-slate-500 mt-2 max-w-xs">Enter your financial projections to generate a 10-year SEZ optimization model.</p></div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          {['entity', 'fema', 'gst', 'expat', 'documents', 'ica', 'compliance', 'regulatory', 'notices'].includes(modal) && (
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50"><h3 className="text-lg font-extrabold text-slate-900">{PAGE_META[modal]?.title}</h3><button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200"><X className="w-4 h-4" /></button></div>
              <div className="p-12 text-center"><div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🚧</div><h3 className="text-lg font-bold text-slate-900 mb-2">{PAGE_META[modal]?.title}</h3><p className="text-sm text-slate-500 max-w-xs mx-auto">This module is actively being built and will be available shortly.</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const applySubscription = (s) => {
    if (!s) return null;
    return localStorage.getItem('gcc_sub_status') === 'active' ? { ...s, subscription: 'active' } : s;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => { setSession(applySubscription(s)); setIsInitializing(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(applySubscription(s)));
    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full" />
        <div className="absolute w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        <Building2 className="w-6 h-6 text-indigo-600 absolute" />
      </div>
      <p className="text-slate-500 font-medium mt-6 tracking-wide text-sm uppercase">Securing Enterprise Connection</p>
    </div>
  );

  if (!session) return <AuthScreen />;
  if (session.subscription !== 'active') return <PaywallScreen onSubscribe={() => { localStorage.setItem('gcc_sub_status', 'active'); setSession(s => ({ ...s, subscription: 'active' })); }} onSignOut={async () => { await supabase.auth.signOut(); }} />;
  return <Dashboard session={session} onSignOut={async () => { await supabase.auth.signOut(); }} />;
}