import { Download, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useClient } from '../context/ClientContext.jsx';
import { useCompliance } from '../context/ComplianceContext.jsx';
import { ReportPreview } from './ReportPreview.jsx';

export default function ReportsPage() {
  const { session } = useAuth();
  const { clients } = useClient();
  const m = useCompliance();
  const userEmailName = session.user.email.split('@')[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8 print:hidden">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
          <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Configure Strategy Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Client Entity</label>
            <select
              value={m.selectedClientForReport}
              onChange={(e) => m.setSelectedClientForReport(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
            >
              <option value="">-- Choose a Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Report Module Output</label>
            <select
              value={m.reportType}
              onChange={(e) => m.setReportType(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-sm font-medium"
            >
              <option value="entity">Entity Structuring Assessment</option>
              <option value="tp">Transfer Pricing Safe Harbour Profile</option>
              <option value="pe">Permanent Establishment Risk Audit</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={m.handleDownloadReport}
            disabled={!m.selectedClientForReport}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-indigo-500/25"
          >
            <Download className="w-4 h-4 mr-2" /> Export Final PDF
          </button>
        </div>
      </div>

      {m.selectedClientForReport && (
        <ReportPreview
          reportRef={m.reportRef}
          selectedClientForReport={m.selectedClientForReport}
          userEmailName={userEmailName}
          reportType={m.reportType}
          headcount={m.headcount}
          opCost={m.opCost}
          revenue={m.revenue}
          calculatedProfit={m.calculatedProfit}
        />
      )}
    </div>
  );
}
