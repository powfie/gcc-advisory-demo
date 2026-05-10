// src/pages/clients/ClientDossier.jsx
import React from 'react';
import { X, Settings, Trash2, Check, Plus, Upload, FileText, Clock } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useUI } from '../../context/UIContext';
import { RiskBadge, ClientAvatar, Badge } from '../../components/ui/shared';

const TABS = [
  { id: 'overview',    label: 'Overview'    },
  { id: 'compliance',  label: 'Compliance'  },
  { id: 'tp',          label: 'TP Register' },
  { id: 'documents',   label: 'Documents'   },
  { id: 'notices',     label: 'Notices'     },
  { id: 'timeline',    label: 'Timeline'    },
];

const scoreColor = (s = 70) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-amber-600' : 'text-rose-600';

export default function ClientDossier() {
  const { selectedClient, deleteClient, updateClientTasks, auditLogs } = useClients();
  const { dossierOpen, closeDossier, dossierTab, setDossierTab, showConfirm } = useUI();

  if (!selectedClient) return null;

  const c = selectedClient;
  const clientLogs = auditLogs.filter(l => l.target === c.name);

  const handleDelete = () => {
    showConfirm({
      title: `Remove ${c.name}?`,
      description: 'This will permanently delete the client and all associated data. This action cannot be undone.',
      confirmLabel: 'Delete Permanently',
      variant: 'danger',
      onConfirm: () => { deleteClient(c); closeDossier(); },
    });
  };

  const toggleTask = (taskId) => {
    const updated = c.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    updateClientTasks(c.id, updated);
  };

  return (
    <>
      {/* Backdrop */}
      {dossierOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] print:hidden" onClick={closeDossier} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200 print:hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${dossierOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <ClientAvatar name={c.name} size="lg" />
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg leading-tight">{c.name}</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{c.parent_company} · {c.parent_country}</p>
              </div>
            </div>
            <button onClick={closeDossier} className="bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full p-1.5 transition-colors border border-slate-200 shadow-sm flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badges + score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <RiskBadge risk={c.risk_status} />
              <Badge variant="default">{c.entity_type}{c.gift_city ? ' · GIFT City' : ''}</Badge>
              {c.sez_entity && <Badge variant="emerald">SEZ</Badge>}
              {c.cbcr_applicable && <Badge variant="violet">CbCR</Badge>}
              {c.apa_status && <Badge variant="amber">APA Filed</Badge>}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</p>
              <p className={`text-2xl font-extrabold ${scoreColor(c.compliance_score)}`}>{c.compliance_score}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4 overflow-x-auto flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setDossierTab(tab.id)}
              className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-colors relative flex-shrink-0 ${dossierTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
              {dossierTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">

          {/* OVERVIEW */}
          {dossierTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Entity Profile</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ['PAN', c.pan || '—'],
                    ['GSTIN', c.gstin || '—'],
                    ['CIN', c.cin || '—'],
                    ['Sector', c.sector],
                    ['Revenue (₹ Cr)', c.annual_revenue_cr],
                    ['Headcount', c.headcount],
                    ['FY End', c.fy_end],
                    ['TP Method', c.tp_method],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-slate-400 text-xs mb-0.5">{label}</p>
                      <p className="font-semibold text-slate-900 truncate">{val || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Open Tasks', value: c.tasks?.filter(t => !t.done).length || 0, color: 'text-indigo-600' },
                  { label: 'Documents', value: c.documents?.length || 0, color: 'text-slate-700' },
                  { label: 'Notices', value: c.notices?.length || 0, color: c.notices?.length ? 'text-rose-600' : 'text-slate-700' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3.5 text-center">
                    <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <button onClick={handleDelete}
                className="w-full flex items-center justify-center py-3 bg-rose-50 border border-rose-100 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all">
                <Trash2 className="w-4 h-4 mr-2" /> Remove Client from Database
              </button>
            </div>
          )}

          {/* COMPLIANCE */}
          {dossierTab === 'compliance' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Compliance</h4>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                </button>
              </div>
              {c.tasks && c.tasks.length > 0 ? c.tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border flex items-start cursor-pointer transition-colors ${task.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-indigo-100 shadow-sm hover:border-indigo-300'}`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 transition-colors ${task.done ? 'bg-emerald-500 border-emerald-600' : 'border-slate-300 bg-white'}`}>
                    {task.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.text}</p>
                    {task.due && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(task.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {task.priority === 'High' && <span className="ml-2 text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">HIGH</span>}
                      </p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 font-medium">No tasks. Click "Add Task" to create one.</p>
                </div>
              )}
            </div>
          )}

          {/* TP REGISTER */}
          {dossierTab === 'tp' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Party Transactions</h4>
              {c.related_parties?.length > 0 ? (
                <div className="space-y-3">
                  {c.related_parties.map(rp => (
                    <div key={rp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-slate-900 text-sm">{rp.name}</p>
                        {rp.arm_length === true && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Arm's Length ✓</span>}
                        {rp.arm_length === null && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Under Review</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                        <div><p className="text-slate-400">Type</p><p className="font-semibold text-slate-700">{rp.transaction_type}</p></div>
                        <div><p className="text-slate-400">Amount</p><p className="font-semibold text-slate-700">₹{rp.amount_cr} Cr</p></div>
                        <div><p className="text-slate-400">Method</p><p className="font-semibold text-slate-700">{rp.tp_method}</p></div>
                      </div>
                    </div>
                  ))}
                  {c.related_parties.reduce((s, r) => s + r.amount_cr, 0) >= 1 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-semibold text-amber-800 flex items-center">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      Total txns ₹{c.related_parties.reduce((s, r) => s + r.amount_cr, 0)} Cr — Form 3CEB filing required (>₹1 Cr threshold)
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400">No related party transactions recorded.</p>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS */}
          {dossierTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <button className="w-full border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 rounded-xl p-5 text-center transition-all group">
                <div className="w-9 h-9 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-700">Upload Document</p>
                <p className="text-xs text-slate-400 mt-0.5">TP Studies · Form 3CEFA · ICA · Approvals</p>
              </button>
              {c.documents?.length > 0 ? c.documents.map(doc => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.category} · Uploaded {doc.uploaded}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                    doc.status === 'Valid' ? 'bg-emerald-50 text-emerald-700' :
                    doc.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>{doc.status}</span>
                </div>
              )) : (
                <div className="text-center py-6 text-sm text-slate-400">No documents uploaded.</div>
              )}
            </div>
          )}

          {/* NOTICES */}
          {dossierTab === 'notices' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
              {c.notices?.length > 0 ? c.notices.map(n => (
                <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-sm text-slate-900">{n.type} · Section {n.section}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.status === 'Open' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{n.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{n.subject}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>Received: {n.date_received}</span>
                    <span>Due: {n.due_date}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 font-medium">No notices for this client. 🎉</p>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE */}
          {dossierTab === 'timeline' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
              {clientLogs.length > 0 ? clientLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-xs">{log.user.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <p className="text-sm text-slate-700"><span className="font-bold text-slate-900">{log.user}</span> {log.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{log.time_display}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-sm text-slate-400">No activity recorded yet for this client.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


// ─── AddClientModal ──────────────────────────────────────────────────────────
// src/pages/clients/AddClientModal.jsx
export function AddClientModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', entity_type: 'WOS', parent_company: '', parent_country: 'United States',
    sector: 'IT Services', assigned_partner: '',
    fy_end: 'March 31', annual_revenue_cr: '', headcount: '',
    tp_method: 'Safe Harbour', risk_status: 'Green', sez_entity: false, gift_city: false,
    cbcr_applicable: false, master_file_applicable: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const { addClient } = useClients();

  const { useState: useLocalState } = React;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await addClient({ ...form, tp_margin: `${form.tp_method}` });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Onboard New Client</h3>
            <p className="text-xs text-slate-500 mt-0.5">Step {step} of 2 — {step === 1 ? 'Entity Identity' : 'Compliance Setup'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1, 2].map(s => <div key={s} className={`w-6 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {step === 1 ? (
            <>
              <Field label="Company Legal Name" required>
                <input required value={form.name} onChange={e => set('name', e.target.value)}
                  className={inputCls} placeholder="e.g. Acme Corp India Pvt Ltd" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Entity Type">
                  <select value={form.entity_type} onChange={e => set('entity_type', e.target.value)} className={inputCls}>
                    {['WOS', 'Branch', 'LLP', 'JV', 'GIFT City', 'Liaison Office'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Sector">
                  <select value={form.sector} onChange={e => set('sector', e.target.value)} className={inputCls}>
                    {['IT Services', 'BFSI', 'Healthcare Technology', 'Supply Chain', 'Retail Technology', 'Pharmaceutical R&D', 'Financial Technology', 'Engineering Services', 'Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Parent Company Name">
                  <input value={form.parent_company} onChange={e => set('parent_company', e.target.value)} className={inputCls} placeholder="e.g. Acme Corp Inc." />
                </Field>
                <Field label="Parent Country">
                  <select value={form.parent_country} onChange={e => set('parent_country', e.target.value)} className={inputCls}>
                    {['United States', 'United Kingdom', 'Germany', 'Singapore', 'Netherlands', 'Switzerland', 'Japan', 'Australia', 'UAE', 'France', 'Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setStep(2)}
                  disabled={!form.name}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  Next: Compliance Setup →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Financial Year End">
                  <select value={form.fy_end} onChange={e => set('fy_end', e.target.value)} className={inputCls}>
                    {['March 31', 'December 31'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Annual Revenue (₹ Cr)">
                  <input type="number" value={form.annual_revenue_cr} onChange={e => set('annual_revenue_cr', e.target.value)} className={inputCls} placeholder="e.g. 85" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="TP Method">
                  <select value={form.tp_method} onChange={e => set('tp_method', e.target.value)} className={inputCls}>
                    {['Safe Harbour', 'TNMM', 'Cost Plus', 'CUP', 'RPM', 'PSM', 'Pending / Not determined'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Risk Status">
                  <select value={form.risk_status} onChange={e => set('risk_status', e.target.value)} className={inputCls}>
                    {['Green', 'Amber', 'Red'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                {[
                  { key: 'sez_entity',           label: 'SEZ Entity'            },
                  { key: 'gift_city',             label: 'GIFT City / IFSC'      },
                  { key: 'cbcr_applicable',       label: 'CbCR Applicable'       },
                  { key: 'master_file_applicable',label: 'Master File Required'  },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                      className="w-4 h-4 rounded accent-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  ← Back
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : '✓ Onboard Client'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

// Helpers
const inputCls = 'block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium text-slate-800';

const Field = ({ label, children, required }) => (
  <div>
    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

// Need useState in AddClientModal
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';