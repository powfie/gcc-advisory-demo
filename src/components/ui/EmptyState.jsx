import React from 'react';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed bg-slate-50 border-slate-300 rounded-2xl">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm">
        <Icon className="w-8 h-8 text-indigo-500" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
      <p className="max-w-sm mt-2 mb-6 text-sm text-slate-500">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}