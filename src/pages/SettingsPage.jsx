import { CheckCircle2, ChevronRight, CreditCard, Trash2, User } from 'lucide-react';
import { useCompliance } from '../context/ComplianceContext.jsx';
import { MODAL_KEYS, useUI } from '../context/UIContext.jsx';

export default function SettingsPage() {
  const m = useCompliance();
  const ui = useUI();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -z-10 blur-3xl" />
        <div className="flex items-center mb-2">
          <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-extrabold text-slate-900">Enterprise License</h3>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-8 border-b border-slate-100 pb-6">
          Manage your software tier and payment methods via Stripe.
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-indigo-100 bg-indigo-50/30 rounded-xl shadow-sm backdrop-blur-sm">
          <div>
            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-md uppercase tracking-widest mb-3 border border-emerald-200/50">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Active License
            </span>
            <h4 className="text-2xl font-extrabold text-slate-900">GCC Professional Tier</h4>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Full access to 4 proprietary engines and unlimited PDF generation.
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-4xl font-extrabold text-slate-900">
              $499<span className="text-base text-slate-500 font-bold ml-1">/mo</span>
            </p>
            <button
              type="button"
              className="mt-3 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors flex items-center justify-end w-full"
            >
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
          <button
            type="button"
            onClick={() => ui.openModal(MODAL_KEYS.invite)}
            className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
          >
            + Invite Colleague
          </button>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-8 border-b border-slate-100 pb-6">
          Control which associates can view or edit sensitive GCC client structures.
        </p>
        <div className="overflow-x-auto border border-slate-200/60 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Associate Identity
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Permission Level
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Account Status
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">
                  Revoke
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {m.teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{member.email}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{member.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        member.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => m.revokeMember(member)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
