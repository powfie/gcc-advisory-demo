import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, AlertCircle } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import SafeHarbourAnalyser from './SafeHarbourAnalyser';
import BenchmarkingEngine from './BenchmarkingEngine';
import MethodSelector from './MethodSelector';
import PillarTwoModel from './PillarTwoModel';
import APAModule from './APAModule';

export default function TPSuitePage() {
  const { clients } = useApp();
  const [selectedClientId, setSelectedClientId] = useState('');
  
  const client = clients.find(c => c.id === parseInt(selectedClientId));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Client Selector Header */}
      <div className="flex items-center justify-between p-6 bg-white border shadow-sm border-slate-200/80 rounded-2xl">
        <div className="flex items-center">
          <div className="p-3 mr-4 bg-indigo-100 rounded-xl text-indigo-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Transfer Pricing Suite</h2>
            <p className="text-sm text-slate-500">Analyze margins, Safe Harbour eligibility, and GloBE rules.</p>
          </div>
        </div>
        <select 
          value={selectedClientId} 
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-64 px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select a Client Entity...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {!client ? (
        <EmptyState 
          icon={AlertCircle} 
          title="No Entity Selected" 
          description="Select a client from the dropdown above to load their Transfer Pricing parameters and run the benchmarking engines."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SafeHarbourAnalyser client={client} />
            <MethodSelector client={client} />
            <APAModule client={client} />
          </div>
          <div className="space-y-6">
            <BenchmarkingEngine client={client} />
            <PillarTwoModel client={client} />
          </div>
        </div>
      )}
    </div>
  );
}