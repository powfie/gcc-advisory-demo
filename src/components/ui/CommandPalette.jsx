import React, { useState } from 'react';
import { Search, Calculator, FileText, Building2, Calendar } from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pb-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-xl ring-1 ring-slate-900/5">
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            className="w-full px-4 text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search clients, tools, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="px-2 py-1 text-xs font-medium border rounded text-slate-500 border-slate-200 bg-slate-50">
            ESC
          </button>
        </div>

        {/* Results Area (Mocked for now) */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="p-4 text-sm text-center text-slate-500">
              Type a command or search...
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients</div>
              <button className="flex items-center w-full px-3 py-2 text-sm text-left rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600">
                <Building2 className="w-4 h-4 mr-3 text-slate-400" />
                TechNova India Pvt Ltd
              </button>
              
              <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tools</div>
              <button className="flex items-center w-full px-3 py-2 text-sm text-left rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600">
                <Calculator className="w-4 h-4 mr-3 text-slate-400" />
                Transfer Pricing Engine
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-left rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600">
                <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                Compliance Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}