import { Building2, CheckCircle2 } from 'lucide-react';

export function ReportPreview({
  reportRef,
  selectedClientForReport,
  userEmailName,
  reportType,
  headcount,
  opCost,
  revenue,
  calculatedProfit,
}) {
  return (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 print:hidden">
        Live Document Preview
      </h3>
      <div
        ref={reportRef}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-xl p-12 min-h-[600px] print:p-0 print:border-none print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:bg-white"
      >
        <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-8 mb-10">
          <div>
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">GCC Advisory Pro</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Prepared by: {userEmailName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-slate-900 mb-1 tracking-widest uppercase">Confidential Memo</p>
            <p className="text-xs font-medium text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-xs font-medium text-slate-500">Ref: GCC-{Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>
        <div className="mb-10">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</p>
          <h2 className="text-2xl font-extrabold text-slate-900">{selectedClientForReport}</h2>
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
              Subject:{' '}
              {reportType === 'entity'
                ? 'Entity Structuring & Setup Feasibility in India'
                : reportType === 'tp'
                  ? 'Transfer Pricing Methodology & Safe Harbour Election'
                  : 'Permanent Establishment (PE) Risk Mitigation Strategies'}
            </p>
          </div>
        </div>
        <div className="space-y-8 text-slate-700 leading-relaxed text-base">
          <p>
            Based on our preliminary analysis of your proposed Global Capability Center (GCC) operations, we have prepared
            the following assessment regarding your structural and compliance obligations under the Indian Income Tax Act,
            1961.
          </p>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/60 shadow-sm">
            <h4 className="font-extrabold text-slate-900 mb-4 text-lg">Key Findings & Recommendations</h4>
            <ul className="space-y-4">
              {reportType === 'entity' && (
                <>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Optimal Structure:</strong> We recommend establishing a Wholly Owned Subsidiary (WOS) as a
                      Private Limited Company.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Scale of Operations:</strong> Based on your inputs, the estimated headcount is{' '}
                      <span className="font-bold text-slate-900">{headcount || '[Input in Simulator]'}</span> with an
                      annual operating cost of{' '}
                      <span className="font-bold text-slate-900">
                        ${opCost ? parseFloat(opCost).toLocaleString() : '[Input in Simulator]'}
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Corporate Tax:</strong> Subject to a concessional corporate tax rate of 25.17% (inclusive
                      of surcharge and cess).
                    </span>
                  </li>
                </>
              )}
              {reportType === 'tp' && (
                <>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Methodology:</strong> Electing for the Safe Harbour rules at a 15.5% operating profit margin
                      reduces litigation risk.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Financial Baseline:</strong> Declared IT Service Revenue of{' '}
                      <span className="font-bold text-slate-900">
                        ₹{revenue ? parseFloat(revenue).toLocaleString('en-IN') : '[Input in TP Engine]'}
                      </span>
                      .
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Required Safe Harbour Profit:</strong> Minimum required profit stands at{' '}
                      <span className="font-bold text-emerald-700">
                        ₹{calculatedProfit ? calculatedProfit.toLocaleString('en-IN') : '[Calculate in TP Engine]'}
                      </span>{' '}
                      to remain strictly compliant.
                    </span>
                  </li>
                </>
              )}
              {reportType === 'pe' && (
                <>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Service PE Trigger:</strong> Expatriate personnel must not exceed 90 days of physical
                      presence in India within a 12-month period to avoid Service PE risks under relevant DTAAs.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Fixed Place PE:</strong> Ensure the Indian entity operates independently with its own
                      management to mitigate risks of creating a Fixed Place PE for the foreign enterprise.
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
          <p className="text-sm text-slate-500 italic">
            * Please note that this is a preliminary assessment based on standard models. A detailed factual analysis is
            required before implementing any structuring decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
