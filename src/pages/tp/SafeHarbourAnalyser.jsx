// src/pages/tp/SafeHarbourAnalyser.jsx
import React, { useState } from 'react';
import { ShieldCheck, ShieldX, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';

// Budget 2026 Safe Harbour rates per Rule 10TD
const SAFE_HARBOUR_RATES = {
  IT_ITES:       { rate: 15.5, label: 'IT / ITeS Services',           rule: 'Rule 10TD(1)(a)' },
  KPO:           { rate: 17.5, label: 'Knowledge Process Outsourcing', rule: 'Rule 10TD(1)(b)' },
  CONTRACT_RND:  { rate: 24.0, label: 'Contract R&D (wholly for non-resident)', rule: 'Rule 10TD(1)(c)' },
  PARTLY_RND:    { rate: 21.0, label: 'Contract R&D (partly for non-resident)', rule: 'Rule 10TD(1)(d)' },
  LOAN_FOREX:    { rate: null, label: 'Intercompany Loan (Forex)',     rule: 'Rule 10TD(2)(a)' },
  LOAN_INR:      { rate: null, label: 'Intercompany Loan (INR)',       rule: 'Rule 10TD(2)(b)' },
};

const getSHCategory = (client) => {
  if (client?.sector?.toLowerCase().includes('r&d') ||
      client?.sector?.toLowerCase().includes('pharma'))     return 'CONTRACT_RND';
  if (client?.sector?.toLowerCase().includes('kpo') ||
      client?.sector?.toLowerCase().includes('analytics'))  return 'KPO';
  return 'IT_ITES';
};

const getClientMargin = (client) => {
  const raw = client?.tp_margin || '';
  const parsed = parseFloat(raw.replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export default function SafeHarbourAnalyser({ client }) {
  const [showPenalty, setShowPenalty] = useState(false);
  const [manualRevenue, setManualRevenue] = useState('');

  if (!client) return null;

  const shCategory     = getSHCategory(client);
  const shConfig       = SAFE_HARBOUR_RATES[shCategory];
  const shRate         = shConfig.rate;
  const currentMargin  = getClientMargin(client);
  const revenue        = parseFloat(manualRevenue) || client.annual_revenue_cr || 0;
  const isRevenueEligible = revenue <= 200;
  const isMarginCompliant  = shRate ? currentMargin >= shRate : true;
  const isEligible         = isRevenueEligible && isMarginCompliant && client.tp_method !== 'Pending';

  // Penalty modeller math
  const profitAtCurrentMargin  = revenue * (currentMargin / 100);
  const profitAtSHMargin       = shRate ? revenue * (shRate / 100) : 0;
  const tpAdjustment           = Math.max(0, profitAtSHMargin - profitAtCurrentMargin);
  const additionalTax          = tpAdjustment * 0.2517;
  const penaltyMin             = additionalTax * 1.0;  // 100% — with documentation
  const penaltyMax             = additionalTax * 2.0;  // 200% — no documentation
  const interestMonths         = 18;
  const interest               = additionalTax * 0.01 * interestMonths;
  const totalExposureMin       = additionalTax + penaltyMin + interest;
  const totalExposureMax       = additionalTax + penaltyMax + interest;

  // 3-scenario comparison
  const TNMM_MEDIAN    = shCategory === 'CONTRACT_RND' ? 25.1 : 19.1;
  const TNMM_LOWER     = shCategory === 'CONTRACT_RND' ? 21.0 : 15.5;

  const scenarios = [
    {
      label: `Safe Harbour @ ${shRate}%`,
      sub: shConfig.rule,
      margin: shRate,
      profit: shRate ? (revenue * shRate / 100) : null,
      risk: 'Nil litigation risk',
      riskColor: 'emerald',
      recommended: isRevenueEligible,
    },
    {
      label: `TNMM — Median (${TNMM_MEDIAN}%)`,
      sub: 'Benchmarking study required',
      margin: TNMM_MEDIAN,
      profit: revenue * TNMM_MEDIAN / 100,
      risk: 'Medium scrutiny',
      riskColor: 'amber',
      recommended: false,
    },
    {
      label: `TNMM — Lower IQR (${TNMM_LOWER}%)`,
      sub: 'Detailed comparables defence needed',
      margin: TNMM_LOWER,
      profit: revenue * TNMM_LOWER / 100,
      risk: 'High scrutiny',
      riskColor: 'rose',
      recommended: false,
    },
  ];

  const eligibilityChecks = [
    {
      label: 'Transaction type eligible for Safe Harbour',
      pass: !['Pending', 'CUP', 'Profit Split (PSM)'].includes(client.tp_method),
      detail: `Eligible types: IT/ITeS, KPO, Contract R&D, intercompany loans`,
    },
    {
      label: `Annual turnover ≤ ₹200 Crore`,
      pass: isRevenueEligible,
      detail: `Current: ₹${revenue} Cr — ${isRevenueEligible ? 'Within limit' : 'Exceeds limit — Safe Harbour not available'}`,
    },
    {
      label: `Operating margin ≥ ${shRate}% (${shConfig.label})`,
      pass: isMarginCompliant,
      detail: `Declared: ${currentMargin}% — Required: ${shRate}%`,
    },
    {
      label: 'Form 3CEFA filed on time (by 31 October)',
      pass: null,
      detail: 'Verify filing status — late filing disqualifies Safe Harbour for the year',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div>
          <h3 className="font-bold text-slate-900">Safe Harbour Analyser</h3>
          <p className="text-xs text-slate-500 mt-0.5">Rule 10TD · Budget 2026 Rates</p>
        </div>
        <span className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${
          isEligible
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {isEligible
            ? <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Eligible</>
            : <><ShieldX className="w-3.5 h-3.5 mr-1.5" />Not Eligible</>}
        </span>
      </div>

      <div className="p-6 space-y-6">

        {/* Revenue Override */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Override Annual Revenue (₹ Cr)
            </label>
            <input
              type="number"
              value={manualRevenue}
              onChange={e => setManualRevenue(e.target.value)}
              placeholder={`Using client data: ₹${client.annual_revenue_cr} Cr`}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              SH Category Detected
            </label>
            <div className="px-3.5 py-2.5 border border-indigo-100 bg-indigo-50 rounded-xl text-sm font-semibold text-indigo-800">
              {shConfig.label}
            </div>
          </div>
        </div>

        {/* Eligibility Checklist */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Eligibility Assessment</p>
          <div className="space-y-2">
            {eligibilityChecks.map((chk, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                chk.pass === true  ? 'bg-emerald-50/60 border-emerald-100' :
                chk.pass === false ? 'bg-rose-50/60 border-rose-100' :
                                     'bg-amber-50/60 border-amber-100'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  chk.pass === true  ? 'bg-emerald-500' :
                  chk.pass === false ? 'bg-rose-500' :
                                       'bg-amber-500'
                }`}>
                  {chk.pass === true  ? <ShieldCheck className="w-3 h-3 text-white" /> :
                   chk.pass === false ? <ShieldX className="w-3 h-3 text-white" /> :
                                        <Info className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    chk.pass === true ? 'text-emerald-900' :
                    chk.pass === false ? 'text-rose-900' : 'text-amber-900'
                  }`}>{chk.label}</p>
                  <p className={`text-xs mt-0.5 ${
                    chk.pass === true ? 'text-emerald-700' :
                    chk.pass === false ? 'text-rose-700' : 'text-amber-700'
                  }`}>{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Scenario Comparison Table */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Scenario Comparison — ₹{revenue} Cr Revenue Base
          </p>
          <div className="space-y-2">
            {scenarios.map((s, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                i === 0 && s.recommended
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`text-sm font-bold ${i === 0 && s.recommended ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
                  </div>
                  {i === 0 && s.recommended && (
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Required Margin</p>
                    <p className="text-lg font-extrabold text-slate-900">{s.margin}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Min. Profit</p>
                    <p className="text-lg font-extrabold text-slate-900">
                      ₹{s.profit ? s.profit.toFixed(2) : '—'} Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Scrutiny Risk</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md bg-${s.riskColor}-100 text-${s.riskColor}-700`}>
                      {s.risk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penalty Modeller — collapsible */}
        <div className="border border-rose-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowPenalty(!showPenalty)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-rose-600 mr-2" />
              <span className="text-sm font-bold text-rose-800">
                Penalty Exposure Modeller
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-rose-700">
                ₹{totalExposureMin.toFixed(2)}–{totalExposureMax.toFixed(2)} Cr
              </span>
              {showPenalty
                ? <ChevronUp className="w-4 h-4 text-rose-600" />
                : <ChevronDown className="w-4 h-4 text-rose-600" />}
            </div>
          </button>

          {showPenalty && (
            <div className="p-5 bg-white space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3">
                If Safe Harbour is <strong>not elected</strong> and the declared margin falls below the arm's length range,
                the following exposure applies under the Income Tax Act.
              </p>

              <div className="space-y-2 text-sm">
                {[
                  { label: 'TP Adjustment (revenue × margin gap)', value: tpAdjustment, color: 'slate' },
                  { label: 'Additional Tax on Adjustment (25.17%)', value: additionalTax, color: 'rose' },
                  { label: `Penalty — With Documentation (100%)`, value: penaltyMin, color: 'rose' },
                  { label: `Penalty — No Documentation (200%)`, value: penaltyMax, color: 'rose' },
                  { label: `Interest u/s 234B (1%/month × ${interestMonths}m)`, value: interest, color: 'amber' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600 text-xs">{row.label}</span>
                    <span className={`font-bold tabular-nums text-${row.color}-700`}>
                      ₹{row.value.toFixed(2)} Cr
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-2">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                  Total Downside Exposure
                </p>
                <p className="text-2xl font-extrabold text-rose-700">
                  ₹{totalExposureMin.toFixed(2)} – ₹{totalExposureMax.toFixed(2)} Cr
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  Range: with documentation (lower) vs without documentation (upper) — Section 270A
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}