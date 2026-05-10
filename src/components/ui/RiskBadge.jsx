import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RiskBadge({ risk }) {
  const riskLevel = risk?.toLowerCase();
  if (riskLevel === 'green') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Compliant
      </span>
    );
  }
  if (riskLevel === 'amber') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Elevated Risk
      </span>
    );
  }
  if (riskLevel === 'red') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
        <AlertOctagon className="w-3.5 h-3.5 mr-1" /> Critical
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
      Unknown
    </span>
  );
}
