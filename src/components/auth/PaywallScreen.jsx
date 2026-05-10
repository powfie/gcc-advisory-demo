// src/components/auth/PaywallScreen.jsx
import React, { useState } from 'react';
import { Building2, Check, X, CreditCard, Loader2, Lock, ChevronDown, Star } from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 199,
    annual: 159,
    clients: '5 clients',
    users: '2 users',
    badge: null,
    color: 'border-slate-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    features: [
      'Client portfolio management',
      'Compliance calendar (20 filings)',
      'Basic TP calculator',
      'DTAA rate lookup',
      'PE risk tracker',
      'Email support',
    ],
    excluded: ['Benchmarking engine', 'ICA document builder', 'FEMA module', 'GST intelligence', 'Report generation'],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthly: 499,
    annual: 399,
    clients: '20 clients',
    users: '5 users',
    badge: 'Most Popular',
    color: 'border-indigo-500 ring-2 ring-indigo-500/30',
    btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]',
    features: [
      'Everything in Starter',
      'Full Transfer Pricing Suite',
      'Benchmarking engine (180+ comparables)',
      'ICA document builder (6 templates)',
      'FEMA & RBI compliance module',
      'GST intelligence & ITC checker',
      'Expat & shadow payroll',
      'Notice & litigation manager',
      'Document vault',
      'All 12 report types (PDF + DOCX)',
      'Priority support',
    ],
    excluded: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    annual: null,
    clients: 'Unlimited clients',
    users: 'Unlimited users',
    badge: null,
    color: 'border-slate-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
    features: [
      'Everything in Professional',
      'White-label branding',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
      'Custom compliance modules',
    ],
    excluded: [],
  },
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel anytime from your billing dashboard. No cancellation fees. Access continues until the end of your billing period.',
  },
  {
    q: 'How is client data secured?',
    a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and GDPR compliant. Data never leaves India-region servers.',
  },
  {
    q: 'How do team seats work?',
    a: 'Each tier includes a fixed number of named users. You can add extra seats at ₹2,000/seat/month. Enterprise plans have unlimited seats.',
  },
];

export default function PaywallScreen({ session, onSubscribe, onSignOut }) {
  const [annual, setAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCheckout = (tierId) => {
    if (tierId === 'enterprise') {
      window.open('mailto:sales@gccadvisorypro.com', '_blank');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubscribe();
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">GCC Advisory Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            <span className="text-xs text-slate-500 ml-1 font-medium">4.9 / 5 from 120+ firms</span>
          </div>
          <button onClick={onSignOut} className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            14-day free trial — no credit card required
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Choose your plan
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            At ₹40,000/month, a single TP penalty avoided pays for 3 years of Professional.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!annual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${annual ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-semibold ${annual ? 'text-slate-900' : 'text-slate-400'}`}>
              Annual
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier) => (
            <div key={tier.id}
              className={`bg-white rounded-3xl border ${tier.color} p-8 flex flex-col relative shadow-sm hover:shadow-lg transition-shadow duration-300`}>
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{tier.name}</p>
                {tier.monthly ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${annual ? tier.annual : tier.monthly}
                    </span>
                    <span className="text-slate-500 text-sm mb-1">/month</span>
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold text-slate-900">Custom</div>
                )}
                {tier.monthly && annual && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Billed ${tier.annual * 12}/year · Save ${(tier.monthly - tier.annual) * 12}/year
                  </p>
                )}
              </div>

              <div className="text-xs text-slate-500 font-medium mb-6 pb-6 border-b border-slate-100 space-y-1">
                <div className="font-bold text-slate-700">{tier.clients}</div>
                <div>{tier.users}</div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{f}</span>
                  </li>
                ))}
                {tier.excluded.map((f, i) => (
                  <li key={i} className="flex items-start text-sm opacity-40">
                    <X className="w-4 h-4 text-slate-400 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-500">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier.id)}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 ${tier.btnClass}`}
              >
                {isProcessing && tier.id === 'professional' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : tier.id === 'enterprise' ? (
                  'Contact Sales'
                ) : (
                  <><CreditCard className="w-4 h-4" /> Start Free Trial</>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-slate-400 text-xs">
            <Lock className="w-3 h-3" />
            <span>Secure checkout · Cancel anytime · SOC 2 certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}