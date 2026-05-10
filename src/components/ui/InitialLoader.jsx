import { Building2 } from 'lucide-react';

export function InitialLoader() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full" />
        <div className="absolute w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
        <Building2 className="w-6 h-6 text-indigo-600 absolute" />
      </div>
      <p className="text-slate-500 font-medium mt-6 tracking-wide text-sm uppercase">
        Securing Enterprise Connection
      </p>
    </div>
  );
}
