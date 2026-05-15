import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, DollarSign, TrendingDown, Landmark, ArrowRight, ShieldAlert, BarChart4 } from 'lucide-react';

export default function FEMASuitePage() {
  const { clients } = useApp();
  
  // Financial Inputs
  const [capitalReq, setCapitalReq] = useState(100); // ₹ Crores
  const [projectedEbitda, setProjectedEbitda] = useState(25); // ₹ Crores
  const [debtPercentage, setDebtPercentage] = useState(40); // %
  const [interestRate, setInterestRate] = useState(8.5); // % (SOFR + Spread)

  // Constants
  const CIT_RATE = 0.2517; // 25.17% Corporate Tax
  const WHT_INTEREST = 0.05; // 5% concessional WHT on ECB
  const WHT_DIVIDEND = 0.15; // 15% DTAA average

  // CFA Treasury Math Engine
  const debtAmount = capitalReq * (debtPercentage / 100);
  const equityAmount = capitalReq - debtAmount;
  
  const annualInterest = debtAmount * (interestRate / 100);
  
  // Section 94B Thin Cap Rule (Max interest deduction is 30% of EBITDA)
  const maxDeductibleInterest = projectedEbitda * 0.30;
  const allowableInterest = Math.min(annualInterest, maxDeductibleInterest);
  const disallowedInterest = Math.max(0, annualInterest - maxDeductibleInterest);
  
  const taxShield = allowableInterest * CIT_RATE;
  
  // Repatriation Math
  const ebt = projectedEbitda - allowableInterest;
  const corporateTax = Math.max(0, ebt * CIT_RATE);
  const pat = ebt - corporateTax - disallowedInterest; // Disallowed interest still paid out of pocket
  
  const interestRepatriated = annualInterest * (1 - WHT_INTEREST);
  const dividendRepatriated = pat * (1 - WHT_DIVIDEND);
  const totalRepatriated = interestRepatriated + dividendRepatriated;

  const thinCapBreach = annualInterest > maxDeductibleInterest;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
        <div className="flex items-center">
          <div className="p-3 mr-4 bg-emerald-100 rounded-xl text-emerald-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">FEMA & Capital Structuring (ECB vs FDI)</h2>
            <p className="text-sm text-slate-500">Optimize Debt/Equity ratios against RBI limits and Sec 94B Thin Cap rules.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modeler Controls */}
        <div className="p-6 bg-white border shadow-sm lg:col-span-1 border-slate-200/80 rounded-2xl space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2 text-slate-400" /> Capital Requirements
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Capital Required</label>
              <span className="text-sm font-black text-slate-900">₹{capitalReq} Cr</span>
            </div>
            <input type="range" min="10" max="500" step="10" value={capitalReq} onChange={(e) => setCapitalReq(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Projected EBITDA</label>
              <span className="text-sm font-black text-slate-900">₹{projectedEbitda} Cr</span>
            </div>
            <input type="range" min="5" max="200" step="5" value={projectedEbitda} onChange={(e) => setProjectedEbitda(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Debt (ECB) vs Equity</label>
              <span className="text-sm font-black text-emerald-600">{debtPercentage}% Debt</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={debtPercentage} onChange={(e) => setDebtPercentage(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>All Equity</span>
              <span>Highly Leveraged</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">ECB Interest Rate (Landed)</label>
              <span className="text-sm font-black text-slate-900">{interestRate}%</span>
            </div>
            <input type="range" min="4" max="15" step="0.5" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
          </div>
        </div>

        {/* Financial Outputs & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
              <p className="text-xs font-bold uppercase text-slate-500">Total Debt (ECB)</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{debtAmount.toFixed(1)} <span className="text-sm text-slate-500 font-medium">Cr</span></p>
            </div>
            <div className="p-4 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
              <p className="text-xs font-bold uppercase text-slate-500">Total Equity (FDI)</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{equityAmount.toFixed(1)} <span className="text-sm text-slate-500 font-medium">Cr</span></p>
            </div>
            <div className="p-4 bg-white border shadow-sm border-emerald-200 rounded-2xl bg-emerald-50/30">
              <p className="text-xs font-bold uppercase text-emerald-700">Annual Tax Shield</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">+₹{taxShield.toFixed(2)} <span className="text-sm opacity-70 font-medium">Cr</span></p>
            </div>
            <div className="p-4 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
              <p className="text-xs font-bold uppercase text-slate-500">Net Repatriation</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{totalRepatriated.toFixed(2)} <span className="text-sm text-slate-500 font-medium">Cr</span></p>
            </div>
          </div>

          {/* Thin Cap Analysis Section */}
          <div className="bg-white border shadow-sm border-slate-200/80 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Landmark className="w-5 h-5 mr-2 text-indigo-500" /> Sec 94B Thin Capitalization Analysis
              </h3>
              {thinCapBreach ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Limit Breached
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Optimal Leverage</span>
              )}
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Indian tax law restricts interest deduction to a maximum of <strong>30% of EBITDA</strong> (₹{maxDeductibleInterest.toFixed(2)} Cr). Any interest paid beyond this creates immediate tax leakage.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Total Interest Expense</span>
                  <span className="font-black text-slate-900">₹{annualInterest.toFixed(2)} Cr</span>
                </div>
                
                {/* Visual Bar */}
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (allowableInterest / Math.max(annualInterest, maxDeductibleInterest)) * 100)}%` }}></div>
                  {thinCapBreach && (
                    <div className="h-full bg-rose-500" style={{ width: `${(disallowedInterest / annualInterest) * 100}%` }}></div>
                  )}
                  {/* Marker for 30% EBITDA */}
                  <div className="absolute top-0 bottom-0 w-1 bg-slate-800 z-10" style={{ left: `${Math.min(100, (maxDeductibleInterest / Math.max(annualInterest, maxDeductibleInterest)) * 100)}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center text-emerald-700 font-bold">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></div> Deductible (₹{allowableInterest.toFixed(2)} Cr)
                  </div>
                  {thinCapBreach && (
                    <div className="flex items-center text-rose-700 font-bold">
                      <div className="w-3 h-3 bg-rose-500 rounded-sm mr-2"></div> Disallowed (₹{disallowedInterest.toFixed(2)} Cr)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}