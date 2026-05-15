import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, TrendingUp, Landmark, Globe, IndianRupee, ArrowRight } from 'lucide-react';
import { DTAA_RATES } from '../../lib/data/dtaaTreaties';

export default function EntityStructuringPage() {
  const { clients } = useApp();
  const [revenue, setRevenue] = useState(50); // in Crores
  const [margin, setMargin] = useState(20); // EBITDA %
  const [parentCountry, setParentCountry] = useState('United States');
  const [years, setYears] = useState(5);

  const ebitda = revenue * (margin / 100);
  const dtaa = DTAA_RATES[parentCountry] || { dividend: 20 }; // Fallback to 20% if no treaty

  // The $100k ACV Math: Tax cascades & Repatriation Friction
  const structures = [
    {
      id: 'wos',
      name: 'Wholly Owned Subsidiary (WOS)',
      cit_rate: 25.17, // Concessional rate under 115BAA
      wht_rate: dtaa.dividend,
      setup_time: '4-6 Weeks',
      repatriation: 'Dividends / Buyback',
      calculateCashFlow: () => {
        const cit = ebitda * 0.2517;
        const pat = ebitda - cit;
        const wht = pat * (dtaa.dividend / 100);
        const netCash = pat - wht;
        return { cit, pat, wht, netCash };
      }
    },
    {
      id: 'branch',
      name: 'Project / Branch Office',
      cit_rate: 43.68, // 40% + Surcharge + Cess
      wht_rate: 0, // No dividend tax on branch profit remittence
      setup_time: '8-12 Weeks (RBI Approval)',
      repatriation: 'Direct Remittance',
      calculateCashFlow: () => {
        const cit = ebitda * 0.4368;
        const pat = ebitda - cit;
        const wht = 0;
        const netCash = pat;
        return { cit, pat, wht, netCash };
      }
    },
    {
      id: 'llp',
      name: 'Limited Liability Partnership',
      cit_rate: 34.94, // 30% + 12% SC + 4% Cess
      wht_rate: 0, // No tax in hands of partners
      setup_time: '3-5 Weeks',
      repatriation: 'Profit Share',
      calculateCashFlow: () => {
        const cit = ebitda * 0.3494;
        const pat = ebitda - cit;
        const wht = 0;
        const netCash = pat;
        return { cit, pat, wht, netCash };
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Modeler Controls */}
      <div className="p-6 bg-white border border-slate-200/80 shadow-sm rounded-2xl">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl mr-4">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Entity Structuring & Repatriation Modeler</h2>
            <p className="text-sm text-slate-500">5-Year NPV cash flow analysis and treaty friction calculator.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Parent Country (DTAA)</label>
            <select 
              value={parentCountry} 
              onChange={(e) => setParentCountry(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              {Object.keys(DTAA_RATES).map(country => <option key={country}>{country}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Annual Revenue (₹ Cr)</label>
              <span className="text-sm font-black text-indigo-600">₹{revenue} Cr</span>
            </div>
            <input 
              type="range" min="10" max="500" step="10" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">EBITDA Margin</label>
              <span className="text-sm font-black text-indigo-600">{margin}%</span>
            </div>
            <input 
              type="range" min="5" max="50" step="1" value={margin} onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {structures.map((struct) => {
          const { cit, pat, wht, netCash } = struct.calculateCashFlow();
          const etr = ((ebitda - netCash) / ebitda) * 100;

          return (
            <div key={struct.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">{struct.name}</h3>
                <div className="flex items-center text-xs font-semibold text-slate-500">
                  <Landmark className="w-3.5 h-3.5 mr-1" /> {struct.cit_rate}% CIT + {struct.wht_rate}% WHT
                </div>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 mb-2">Cash Flow Waterfall (Annual)</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">EBITDA</span>
                      <span className="font-semibold text-slate-900">₹{ebitda.toFixed(2)} Cr</span>
                    </div>
                    <div className="flex justify-between text-sm text-rose-600">
                      <span>Corporate Tax ({struct.cit_rate}%)</span>
                      <span>- ₹{cit.toFixed(2)} Cr</span>
                    </div>
                    <div className="flex justify-between text-sm text-rose-600">
                      <span>Repatriation Tax ({struct.wht_rate}%)</span>
                      <span>- ₹{wht.toFixed(2)} Cr</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between">
                      <span className="font-bold text-slate-900">Net Repatriated</span>
                      <span className="font-black text-emerald-600 text-lg">₹{netCash.toFixed(2)} Cr</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Effective Tax Rate (ETR)</p>
                  <p className="text-2xl font-black text-slate-900">{etr.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}