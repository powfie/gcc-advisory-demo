import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, CreditCard, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { InitialLoader } from '../components/ui/InitialLoader.jsx';

export default function PaywallPage() {
  const { session, isInitializing, simulateStripePayment, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isInitializing || !session) return;
    if (session.subscription === 'active') {
      navigate('/app/overview', { replace: true });
    }
  }, [session, isInitializing, navigate]);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      simulateStripePayment();
      navigate('/app/overview', { replace: true });
    }, 1500);
  };

  if (isInitializing) return <InitialLoader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">GCC Advisory Pro</span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Sign Out
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 animate-in zoom-in-95 duration-500">
          <div className="p-10 lg:p-12 flex flex-col justify-center bg-[#0B132B] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider mb-6 border border-indigo-500/30">
                Partner Tier
              </span>
              <h2 className="text-3xl font-extrabold mb-4">Unlock the complete Tax Advisory Suite.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Join elite Big 4 partners and boutique firms using GCC Advisory Pro to instantly model entity structures
                and Pillar Two tax implications.
              </p>

              <div className="space-y-5">
                {[
                  'Entity Structuring Simulator',
                  'Budget 2026 Transfer Pricing Engine',
                  'Live Expatriate PE Risk Database',
                  'DTAA & SEZ Optimizers',
                  'Unlimited PDF Strategy Reports',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 mt-0.5 border border-indigo-500/30">
                      <Check className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">Professional License</p>
              <div className="flex items-end justify-center">
                <span className="text-5xl font-extrabold text-slate-900">$499</span>
                <span className="text-slate-500 ml-2 mb-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mt-3">Billed monthly. Cancel anytime.</p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing securely...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" /> Subscribe securely via Stripe
                  </>
                )}
              </button>
              <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center">
                <Lock className="w-3 h-3 mr-1" /> Guaranteed secure checkout by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
