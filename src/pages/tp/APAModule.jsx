import React from 'react';
import { FileCheck } from 'lucide-react';

export default function APAModule({ client }) {
  if (client?.apa_status) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <h3 className="flex items-center mb-2 text-lg font-bold text-emerald-900">
          <FileCheck className="w-5 h-5 mr-2" /> APA Status: {client.apa_status}
        </h3>
        <p className="text-sm text-emerald-800">Rollback provisions apply. Annual compliance report form 3CEF is active.</p>
      </div>
    );
  }
  return null;
}