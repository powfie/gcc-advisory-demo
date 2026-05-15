import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ReportsEnginePage() {
  const { clients } = useApp();
  const [selectedClient, setSelectedClient] = useState(clients[0]);

  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Left Pane: Report Builder Controls */}
      <div className="w-1/3 bg-white border border-slate-200/80 shadow-sm rounded-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Report Builder
          </h2>
          <select 
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSelectedClient(clients.find(c => c.id === Number(e.target.value)))}
          >
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {['Executive Summary', 'Transfer Pricing Strategy', 'Entity & Repatriation', 'PE Risk Analysis', 'Compliance Roadmap'].map((section, idx) => (
            <button key={section} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 text-left group">
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500" />
                <span className="text-sm font-semibold text-slate-700">{section}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          <button className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>
      </div>

      {/* Right Pane: Live Document Preview (A4 Paper UI) */}
      <div className="flex-1 bg-slate-200/50 rounded-2xl overflow-y-auto p-8 flex justify-center border border-slate-200/80 inset-shadow-sm">
        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg rounded-sm p-12 print:shadow-none print:p-0">
          
          {/* Memo Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8">
            <h1 className="text-3xl font-serif text-slate-900 mb-6">Strategic Advisory Memo</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-bold text-slate-500 uppercase text-xs">To:</span> <p className="font-semibold">{selectedClient.name} Board of Directors</p></div>
              <div><span className="font-bold text-slate-500 uppercase text-xs">Date:</span> <p className="font-semibold">{date}</p></div>
              <div><span className="font-bold text-slate-500 uppercase text-xs">Prepared By:</span> <p className="font-semibold">GCC Advisory Pro Partners</p></div>
              <div><span className="font-bold text-slate-500 uppercase text-xs">Subject:</span> <p className="font-semibold">Structuring & Transfer Pricing Optimization</p></div>
            </div>
          </div>

          {/* Report Body */}
          <div className="space-y-8 font-serif text-slate-800 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">1. Executive Summary</h2>
              <p className="text-justify">
                This memorandum outlines the strategic roadmap for <strong>{selectedClient.name}</strong> operating as a <strong>{selectedClient.entity_type}</strong> in the <strong>{selectedClient.sector}</strong> sector. With current annual revenues tracking at ₹{selectedClient.annual_revenue_cr} Cr, optimizing the cross-border transaction flows with <strong>{selectedClient.parent_company} ({selectedClient.parent_country})</strong> is critical to mitigating tax leakage and Permanent Establishment (PE) exposure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">2. Transfer Pricing & Margin Analysis</h2>
              <p className="mb-4 text-justify">
                Under the current operating model, the entity applies the <strong>{selectedClient.tp_method}</strong> method, reporting a margin of <strong>{selectedClient.tp_margin}</strong>. 
                {selectedClient.risk_status === 'Red' ? 
                  " Current metrics indicate HIGH risk of litigation. Immediate remediation is required to defend against adjustment under Section 92C." : 
                  " Current metrics align with Safe Harbour thresholds, providing a defensible posture against aggressive assessment."}
              </p>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-sm font-sans">
                <strong>Recommendation:</strong> Proceed with filing Form 3CEFA to lock in certainty for the upcoming assessment year. Ensure intercompany agreements (ICAs) are updated to reflect exact substance.
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">3. Repatriation & DTAA Friction</h2>
              <p className="text-justify mb-4">
                Based on the India-{selectedClient.parent_country} Double Tax Avoidance Agreement (DTAA), dividend repatriation currently suffers a withholding tax friction. It is highly advised to explore structuring a portion of repatriations as software/technology royalties (subject to FTS testing) to optimize the Effective Tax Rate (ETR).
              </p>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
}