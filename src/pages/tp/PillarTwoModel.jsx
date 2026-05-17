import React, { useState } from 'react';
import { calculateGloBEETR } from '../../lib/calculations/etr';

export default function PillarTwoModel() {
  // State initialization
  const [formData, setFormData] = useState({
    globalRevenue: '',
    indianProfit: '',
    indianTaxes: '',
    enableSBIE: false,
    sbiePayroll: '',
    sbieTangibleAssets: ''
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle calculation submission
  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Parse inputs safely
    const inputs = {
      globalRevenue: parseFloat(formData.globalRevenue) || 0,
      indianProfit: parseFloat(formData.indianProfit) || 0,
      indianTaxes: parseFloat(formData.indianTaxes) || 0,
      enableSBIE: formData.enableSBIE,
      sbiePayroll: parseFloat(formData.sbiePayroll) || 0,
      sbieTangibleAssets: parseFloat(formData.sbieTangibleAssets) || 0
    };

    const calculationResults = calculateGloBEETR(inputs);
    setResults(calculationResults);

    // EXTENSION POINT: If integrating into a broader app, you might dispatch 
    // these results to a global state (e.g., AppContext) here to feed into 
    // a PDF report generator or comparative scenario dashboard.
  };

  // Reset form and results
  const handleReset = () => {
    setFormData({
      globalRevenue: '',
      indianProfit: '',
      indianTaxes: '',
      enableSBIE: false,
      sbiePayroll: '',
      sbieTangibleAssets: ''
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 bg-slate-50/50 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Pillar Two ETR Model (GloBE)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate Pillar Two effective tax rate (ETR), QDMTT exposure, and model SBIE (Substance-Based Income Exclusion).
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            
            {/* Core Financials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Consolidated Group Revenue (€)
                </label>
                <input
                  type="number"
                  name="globalRevenue"
                  value={formData.globalRevenue}
                  onChange={handleInputChange}
                  placeholder="e.g. 800000000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jurisdictional GloBE Profit (₹)
                </label>
                <input
                  type="number"
                  name="indianProfit"
                  value={formData.indianProfit}
                  onChange={handleInputChange}
                  placeholder="e.g. 50000000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Covered Taxes Paid (₹)
                </label>
                <input
                  type="number"
                  name="indianTaxes"
                  value={formData.indianTaxes}
                  onChange={handleInputChange}
                  placeholder="e.g. 6000000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* SBIE Toggle & Inputs */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enableSBIE"
                  name="enableSBIE"
                  checked={formData.enableSBIE}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableSBIE" className="ml-2 block text-sm font-bold text-slate-800">
                  Model Substance-Based Income Exclusion (SBIE)
                </label>
              </div>

              {formData.enableSBIE && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Eligible Payroll Costs (₹)
                    </label>
                    <input
                      type="number"
                      name="sbiePayroll"
                      value={formData.sbiePayroll}
                      onChange={handleInputChange}
                      placeholder="e.g. 10000000"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Eligible Tangible Assets (₹)
                    </label>
                    <input
                      type="number"
                      name="sbieTangibleAssets"
                      value={formData.sbieTangibleAssets}
                      onChange={handleInputChange}
                      placeholder="e.g. 25000000"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
              >
                Calculate ETR
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-white text-slate-700 font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="border-t border-slate-200 bg-slate-800 p-6 text-white animate-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
              Advisory Output
            </h2>
            
            <div className="bg-slate-900 rounded-lg p-5 mb-6 border border-slate-700">
              <p className={`font-semibold ${results.inScope && results.qdmttExposure > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {results.recommendation}
              </p>
            </div>

            {results.inScope && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Scope Status</p>
                  <p className="text-lg font-medium mt-1 text-slate-100">In Scope</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ETR (Base)</p>
                  <p className="text-lg font-medium mt-1 text-slate-100">{results.etrBefore.toFixed(2)}%</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ETR (Post-SBIE)</p>
                  <p className="text-lg font-medium mt-1 text-slate-100">{results.etrAfter.toFixed(2)}%</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">QDMTT Exposure</p>
                  <p className="text-lg font-medium mt-1 text-slate-100">
                    ₹{results.qdmttExposure > 0 ? results.qdmttExposure.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
                  </p>
                </div>
              </div>
            )}

            {results.inScope && formData.enableSBIE && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">SBIE Breakdown</p>
                <div className="flex gap-8">
                  <div>
                    <span className="text-sm text-slate-400">Payroll Carve-out (8%):</span>
                    <span className="ml-2 font-medium">₹{results.sbiePayrollCarveout.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-400">Asset Carve-out (10%):</span>
                    <span className="ml-2 font-medium">₹{results.sbieAssetCarveout.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}