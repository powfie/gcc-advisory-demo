// src/pages/Dashboard.jsx
// Main shell — renders sidebar + header + active page.
// Add new pages by importing and adding a case below. No other file needs to change.
import React, { lazy, Suspense } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { useUI } from '../context/UIContext';
import { SkeletonCard } from '../components/ui/shared';

// ─── Page imports ────────────────────────────────────────────────────────────
// We'll add proper pages as we build each phase.
// For now, placeholder stubs keep the app running immediately.
import OverviewPage     from './overview/OverviewPage';
import ClientsPage      from './clients/ClientsPage';

// Stub component for pages not yet built
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500">
    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
      This module is being built as part of Phase 2+. It will appear here automatically once complete.
    </p>
  </div>
);

// ─── Page loader fallback ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

// ─── Router ───────────────────────────────────────────────────────────────────
const PAGES = {
  overview:   <OverviewPage />,
  clients:    <ClientsPage />,
  // The rest are stubs until we build them in upcoming phases:
  regulatory: <ComingSoon title="Regulatory Intelligence Feed" />,
  notices:    <ComingSoon title="Notice & Litigation Manager" />,
  tp:         <ComingSoon title="Transfer Pricing Suite" />,
  fema:       <ComingSoon title="FEMA & RBI Compliance" />,
  gst:        <ComingSoon title="GST Intelligence" />,
  entity:     <ComingSoon title="Entity Structuring Lab" />,
  expat:      <ComingSoon title="Expat & Shadow Payroll" />,
  documents:  <ComingSoon title="Document Vault" />,
  ica:        <ComingSoon title="ICA Builder" />,
  reports:    <ComingSoon title="Strategy Reports" />,
  compliance: <ComingSoon title="Compliance Calendar" />,
  audit:      <ComingSoon title="Audit Trail" />,
  settings:   <ComingSoon title="Firm Settings" />,
};

export default function Dashboard() {
  const { currentView } = useUI();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto scroll-smooth print:overflow-visible">
          {/* Page header */}
          <div className="px-6 lg:px-10 pt-8 pb-6 print:hidden">
            <PageTitle view={currentView} />
          </div>

          {/* Page content */}
          <div className="px-6 lg:px-10 pb-16 print:p-0">
            <Suspense fallback={<PageLoader />}>
              <div key={currentView} className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                {PAGES[currentView] ?? <ComingSoon title={currentView} />}
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Page title/subtitle map ──────────────────────────────────────────────────
const PAGE_META = {
  overview:   { title: 'Command Centre',          sub: 'Firm-wide metrics, risk intelligence and advisory tools.' },
  regulatory: { title: 'Regulatory Feed',         sub: 'CBDT circulars, GST council updates, RBI notifications and case law.' },
  clients:    { title: 'Client Portfolios',       sub: 'Master database of all active GCC entity structures.' },
  notices:    { title: 'Notice Manager',          sub: 'Track and respond to all income tax, GST and FEMA notices.' },
  tp:         { title: 'Transfer Pricing Suite',  sub: 'Method selection, benchmarking, APA and documentation engine.' },
  fema:       { title: 'FEMA & RBI Compliance',   sub: 'FDI register, FLA return, ECB tracker and repatriation modeller.' },
  gst:        { title: 'GST Intelligence',        sub: 'Export of services, ITC eligibility, RCM and SEZ rules.' },
  entity:     { title: 'Entity Structuring Lab',  sub: 'Compare entity types, model setup costs and plan the incorporation journey.' },
  expat:      { title: 'Expat & Shadow Payroll',  sub: 'PE risk monitoring, residency calculator, shadow payroll and ESOP tracker.' },
  documents:  { title: 'Document Vault',          sub: 'Centralised storage for all client documents with expiry tracking.' },
  ica:        { title: 'ICA Builder',             sub: 'Generate intercompany agreements from professional legal templates.' },
  reports:    { title: 'Strategy Reports',        sub: 'Build and export partner-ready advisory reports in PDF or DOCX.' },
  compliance: { title: 'Compliance Calendar',     sub: 'All 40+ annual filings tracked across Income Tax, GST, FEMA and Company Law.' },
  audit:      { title: 'Audit Trail',             sub: 'Immutable log of all firm-wide data access and modifications.' },
  settings:   { title: 'Firm Settings',           sub: 'Manage firm profile, team access, billing and security.' },
};

const PageTitle = ({ view }) => {
  const meta = PAGE_META[view] || { title: view, sub: '' };
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{meta.title}</h1>
      {meta.sub && <p className="text-slate-500 mt-1 text-sm font-medium">{meta.sub}</p>}
    </div>
  );
};