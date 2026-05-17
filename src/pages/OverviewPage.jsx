import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart4, Globe, ShieldAlert, TrendingDown, 
  ArrowRight, FileText, Landmark, Activity, 
  PieChart, AlertTriangle, ArrowUpRight, Scale
} from 'lucide-react';

export default function OverviewPage() {
  const { clients } = useApp();

  // --- ENTERPRISE DATA AGGREGATIONS ---
  const totalFDI = clients.reduce((sum, c) => sum + (c.annual_revenue_cr || 0) * 1.2, 0); // Simulated Capital
  const avgETR = 23.4; // Simulated Blended Effective Tax Rate
  
  // Calculate BEPS (Base Erosion and Profit Shifting) Exposure
  const bepsExposure = clients
    .filter(c => c.risk_status === 'Red' || c.tp_margin < '15%')
    .reduce((sum, c) => sum + ((c.annual_revenue_cr || 0) * 0.15), 0);

  const activeAPAs = clients.filter(c => c.apa_status).length;

  // Jurisdictional Friction (Simulated Data)
  const jurisdictions = [
    { country: 'United States', entities: 4, capital: 450, friction: 'High', wht: '15%' },
    { country: 'Singapore', entities: 3, capital: 280, friction: 'Low', wht: '10%' },
    { country: 'United Kingdom', entities: 2, capital: 150, friction: 'Medium', wht: '10%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* HEADER: Terminal-Style KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
        
        <div className="p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Capital Managed</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-light text-slate-400">₹</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{totalFDI.toLocaleString()}</span>
            <span className="text-sm font-semibold text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center bg-emerald-50 w-max px-2 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3 mr-1" /> +12.4% YoY
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blended Platform ETR</span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{avgETR}</span>
            <span className="text-sm font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-500 flex items-center">
            Sec 115BAA Optimized
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between bg-rose-50/20 hover:bg-rose-50/40 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">BEPS Value at Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-light text-rose-400">₹</span>
            <span className="text-3xl font-black text-rose-700 tracking-tight tabular-nums">{bepsExposure.toFixed(1)}</span>
            <span className="text-sm font-semibold text-rose-500">Cr</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-rose-600 flex items-center">
            Across {clients.filter(c => c.risk_status === 'Red').length} vulnerable entities
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active APAs / MAPs</span>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{activeAPAs}</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center bg-indigo-50 w-max px-2 py-0.5 rounded">
            Litigation Shield Active
          </div>
        </div>
      </div>

      {/* MAIN GRID: 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1 & 2: Structural Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Transfer Pricing Deviation Heatmap (Abstracted) */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Arm's Length Range Deviation</h3>
                <p className="text-xs text-slate-500 mt-1">Operating margin vs Safe Harbour 10TD thresholds.</p>
              </div>
              <button className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                Run Benchmarking
              </button>
            </div>

            <div className="space-y-4">
              {clients.slice(0, 4).map((client, i) => {
                const margin = parseFloat(client.tp_margin?.replace(/[^0-9.]/g, '') || 0);
                const safeHarbour = client.sector.includes('R&D') ? 24 : 17;
                const deficit = safeHarbour - margin;
                const isBreach = deficit > 0;

                return (
                  <div key={i} className="flex items-center group">
                    <div className="w-1/3 pr-4">
                      <p className="text-xs font-bold text-slate-900 truncate">{client.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate">{client.tp_method}</p>
                    </div>
                    <div className="w-2/3 relative h-6 bg-slate-50 rounded border border-slate-100 flex items-center">
                      {/* Target Line */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10" style={{ left: '60%' }} title={`Safe Harbour: ${safeHarbour}%`}></div>
                      
                      {/* Actual Bar */}
                      <div 
                        className={`h-full rounded-l ${isBreach ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((margin / safeHarbour) * 60, 100)}%` }}
                      ></div>
                      
                      <span className="absolute right-3 text-[10px] font-bold tabular-nums text-slate-600">
                        {margin}% {isBreach && <span className="text-rose-600">({deficit.toFixed(1)}% gap)</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <div className="w-2 h-2 bg-slate-800 mr-2"></div> Safe Harbour Threshold
            </div>
          </div>

          {/* Jurisdictional Capital Flow Table */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center">
                <Landmark className="w-4 h-4 mr-2 text-slate-400" /> Jurisdictional Friction Matrix
              </h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-5 py-3">Parent DTAA</th>
                  <th className="px-5 py-3">Entities</th>
                  <th className="px-5 py-3 text-right">Capital Flow</th>
                  <th className="px-5 py-3 text-right">WHT Leakage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jurisdictions.map((j, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-slate-900">{j.country}</span>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-600">{j.entities}</td>
                    <td className="px-5 py-3 text-right text-xs font-black text-slate-900 tabular-nums">₹{j.capital} Cr</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded ${
                        j.friction === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {j.wht} Effective
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* COL 3: Actionable Directives (The "Partner Brain") */}
        <div className="space-y-6">
          <div className="bg-[#0B132B] border border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white flex items-center tracking-wide">
                <Activity className="w-4 h-4 mr-2 text-indigo-400" /> Partner Directives
              </h3>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              </div>
            </div>
            
            <div className="p-5 flex-1 space-y-4 overflow-y-auto">
              
              {/* Directive 1 */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest border border-rose-400/30 px-1.5 py-0.5 rounded">Action Required</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-bold text-white mb-1">Thin Cap Breach: NovaPharma</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Current ECB interest payments exceed 30% of projected EBITDA. Sec 94B disallowance triggered.
                </p>
                <div className="flex items-center text-xs font-bold text-indigo-300">
                  <TrendingDown className="w-3 h-3 mr-1" /> ₹4.2 Cr Tax Shield Loss
                </div>
              </div>

              {/* Directive 2 */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border border-amber-400/30 px-1.5 py-0.5 rounded">Opportunity</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-bold text-white mb-1">DTAA Optimization: UK Corridor</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Recharacterizing 20% of dividend repatriations to FTS (Fees for Technical Services) under UK DTAA.
                </p>
                <div className="flex items-center text-xs font-bold text-emerald-400">
                  <TrendingDown className="w-3 h-3 mr-1" /> Reduce WHT by 5%
                </div>
              </div>

              {/* Directive 3 */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-400/30 px-1.5 py-0.5 rounded">Compliance</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">Form 3CEB Deadline</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Accountant's report due in 14 days for 6 entities. Transfer pricing documentation pending final sign-off.
                </p>
              </div>

            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/20">
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center">
                <FileText className="w-4 h-4 mr-2" /> Generate Risk Memo
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}