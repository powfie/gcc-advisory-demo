import { Activity, Clock, User } from 'lucide-react';
import { useCompliance } from '../context/ComplianceContext.jsx';

export default function AuditPage() {
  const { auditLogs } = useCompliance();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center text-slate-900">
            <Activity className="w-5 h-5 mr-3 text-indigo-600" />
            <h3 className="font-extrabold text-lg">System Activity Ledger</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200/50">
            {auditLogs.length} Records
          </span>
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
  );
}
