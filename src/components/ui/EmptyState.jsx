import React from 'react';
import { FileQuestion } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = 'No data available', 
  description = 'Get started by creating a new record.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-50">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 mb-6 text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}