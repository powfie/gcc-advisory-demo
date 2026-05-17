// src/pages/tp/MethodSelector.jsx
import React, { useState } from 'react';
import { ChevronRight, RotateCcw, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const TRANSACTION_TYPES = [
  {
    id: 'IT_ITES',
    label: 'IT / ITeS Services',
    icon: '💻',
    description: 'Software development, testing, BPO, support services to non-resident',
    common: true,
  },
  {
    id: 'CONTRACT_RND',
    label: 'Contract R&D',
    icon: '🔬',
    description: 'Research and development services on behalf of foreign principal',
    common: true,
  },
  {
    id: 'MGMT_SERVICES',
    label: 'Management / Support Services',
    icon: '📊',
    description: 'HR, finance, legal, IT support charged as management fee',
    common: true,
  },
  {
    id: 'ROYALTY_IP',
    label: 'Royalty / IP Licensing',
    icon: '📜',
    description: 'Payment for use of patents, trademarks, software, trade secrets',
    common: false,
  },
  {
    id: 'INTEREST_LOAN',
    label: 'Intercompany Loan / Interest',
    icon: '🏦',
    description: 'Interest on loans, guarantees, or other financial instruments',
    common: false,
  },
  {
    id: 'GOODS',
    label: 'Purchase / Sale of Goods',
    icon: '📦',
    description: 'Tangible goods transferred between related parties',
    common: false,
  },
  {
    id: 'COST_SHARING',
    label: 'Cost Contribution / Sharing',
    icon: '🤝',
    description: 'Shared development costs or platform charges across group',
    common: false,
  },
];

// Decision tree questions and method outcomes per transaction type
const DECISION_TREES = {
  IT_ITES: {
    questions: [
      {
        id: 'q1',
        text: 'Is the annual IT/ITeS revenue ≤ ₹200 Crore?',
        detail: 'Safe Harbour under Rule 10TD is only available for entities with turnover below this threshold.',
      },
      {
        id: 'q2',
        text: 'Is the operating margin ≥ 15.5%?',
        detail: 'Budget 2026 unified Safe Harbour rate for IT and ITeS services.',
      },
      {
        id: 'q3',
        text: 'Are reliable CUP comparables available for the specific service?',
        detail: 'CUP requires identical or near-identical transactions in uncontrolled conditions — rare for IT services.',
      },
    ],
    getOutcome: (answers) => {
      if (answers.q1 === 'yes' && answers.q2 === 'yes') {
        return {
          method: 'Safe Harbour (Rule 10TD)',
          rationale: 'Entity meets both turnover and margin thresholds. Electing Safe Harbour eliminates documentation burden and litigation risk.',
          citation: 'Rule 10TD(1)(a), CBDT Notification S.O. 5347(E)',
          scrutiny: 'Nil',
          alternate: 'TNMM as fallback if Safe Harbour not elected',
          color: 'emerald',
        };
      }
      if (answers.q3 === 'yes') {
        return {
          method: 'Comparable Uncontrolled Price (CUP)',
          rationale: 'Comparable uncontrolled transactions are available — CUP is the most direct and preferred method.',
          citation: 'Rule 10B(1)(a), Income Tax Rules 1962',
          scrutiny: 'Low',
          alternate: 'TNMM if CUP comparables are insufficient',
          color: 'indigo',
        };
      }
      return {
        method: 'Transactional Net Margin Method (TNMM)',
        rationale: 'Most widely accepted method for IT services. Net margin of tested party compared against external comparables. CBDT generally accepts TNMM for routine service providers.',
        citation: 'Rule 10B(1)(e), Income Tax Rules 1962',
        scrutiny: 'Medium',
        alternate: 'Cost Plus if entity is a pure cost centre',
        color: 'blue',
      };
    },
  },
  CONTRACT_RND: {
    questions: [
      {
        id: 'q1',
        text: 'Is the R&D undertaken wholly for the non-resident principal?',
        detail: 'If wholly for non-resident: Safe Harbour at 24%. If partly: 21%.',
      },
      {
        id: 'q2',
        text: 'Is turnover ≤ ₹200 Crore and margin ≥ 24%?',
        detail: 'Safe Harbour eligibility check for Contract R&D under Rule 10TD.',
      },
      {
        id: 'q3',
        text: 'Does the Indian entity bear significant entrepreneurial risk?',
        detail: 'If yes, a higher return is appropriate and Profit Split may be relevant.',
      },
    ],
    getOutcome: (answers) => {
      if (answers.q1 === 'yes' && answers.q2 === 'yes') {
        return {
          method: 'Safe Harbour @ 24% (Contract R&D)',
          rationale: 'Contract R&D wholly for non-resident qualifies for Safe Harbour at 24% margin under Rule 10TD(1)(c).',
          citation: 'Rule 10TD(1)(c), CBDT Notification S.O. 5347(E)',
          scrutiny: 'Nil',
          alternate: 'Cost Plus with benchmarked markup if Safe Harbour not elected',
          color: 'emerald',
        };
      }
      if (answers.q3 === 'yes') {
        return {
          method: 'Profit Split Method (PSM)',
          rationale: 'Entity bears significant risk and contributes unique intangibles — residual profit split is appropriate.',
          citation: 'Rule 10B(1)(f), Income Tax Rules 1962',
          scrutiny: 'High — requires detailed value chain analysis',
          alternate: 'TNMM if risk allocation is restructured',
          color: 'violet',
        };
      }
      return {
        method: 'Cost Plus Method (CPM)',
        rationale: 'Contract R&D with no significant risk-bearing is best benchmarked using cost plus markup. Comparable contract research agreements used as comparables.',
        citation: 'Rule 10B(1)(c), Income Tax Rules 1962',
        scrutiny: 'Medium',
        alternate: 'TNMM as alternative',
        color: 'blue',
      };
    },
  },
  MGMT_SERVICES: {
    questions: [
      {
        id: 'q1',
        text: 'Is the management fee charged on an actual cost + markup basis?',
        detail: 'Cost-based charges are the OECD-preferred approach for low-value-adding services.',
      },
      {
        id: 'q2',
        text: 'Does the service provide a measurable economic benefit to the recipient?',
        detail: 'CBDT will disallow the deduction if it cannot be demonstrated that the service provides genuine value.',
      },
    ],
    getOutcome: (answers) => {
      if (!answers.q2 || answers.q2 === 'no') {
        return {
          method: 'Deduction May Be Disallowed',
          rationale: 'If the service does not provide a demonstrable economic benefit, CBDT may disallow the deduction under Section 37. Restructure or document benefit rigorously.',
          citation: 'Section 37, Income Tax Act 1961; OECD TP Guidelines Para 7.6',
          scrutiny: 'Very High',
          alternate: 'Restructure to cost-sharing arrangement with benefit documentation',
          color: 'rose',
        };
      }
      return {
        method: 'Cost Plus Method (CPM) / TNMM',
        rationale: 'Management fees are benchmarked on cost + markup basis (CPM) for routine services. TNMM applied at recipient level for complex multi-function arrangements.',
        citation: 'Rule 10B(1)(c)/(e); CBDT Circular 6/2013',
        scrutiny: 'Medium',
        alternate: 'Simplified cost pooling approach for low-value intragroup services',
        color: 'blue',
      };
    },
  },
  ROYALTY_IP: {
    questions: [
      {
        id: 'q1',
        text: 'Are there comparable uncontrolled royalty rates available (industry databases)?',
        detail: 'CUP is preferred for royalties when comparable licensing agreements exist.',
      },
      {
        id: 'q2',
        text: 'Is the IP unique / difficult to value (e.g. proprietary pharma patents)?',
        detail: 'Hard-to-value intangibles require special approaches per OECD BEPS Action 8.',
      },
    ],
    getOutcome: (answers) => {
      if (answers.q1 === 'yes') {
        return {
          method: 'Comparable Uncontrolled Price (CUP)',
          rationale: 'Comparable licensing agreements in public databases (Royalty Source, ktMINE) support CUP application for royalty rates.',
          citation: 'Rule 10B(1)(a); OECD TP Guidelines Chapter VI',
          scrutiny: 'Low to Medium',
          alternate: 'TNMM at licensee level',
          color: 'indigo',
        };
      }
      if (answers.q2 === 'yes') {
        return {
          method: 'Profit Split / Income Approach (DCF)',
          rationale: 'Hard-to-value intangibles require income-based valuation. Discounted Cash Flow analysis of expected royalty income stream.',
          citation: 'Rule 10B(1)(f); OECD BEPS Action 8 (Hard-to-Value Intangibles)',
          scrutiny: 'Very High — CBDT may apply Sec 92CA reference to TPO',
          alternate: 'CUP with adjustments',
          color: 'violet',
        };
      }
      return {
        method: 'TNMM at Licensee Level',
        rationale: 'If CUP comparables unavailable, test the licensee\'s net margin against comparable entities that do not pay royalties.',
        citation: 'Rule 10B(1)(e); OECD TP Guidelines Para 6.65',
        scrutiny: 'Medium',
        alternate: 'CUP if market data sourced',
        color: 'blue',
      };
    },
  },
  INTEREST_LOAN: {
    questions: [
      {
        id: 'q1',
        text: 'Is the loan denominated in foreign currency (forex ECB)?',
        detail: 'Safe Harbour applies differently for forex vs INR loans under Rule 10TD.',
      },
      {
        id: 'q2',
        text: 'Is the loan within the RBI ECB all-in cost ceiling?',
        detail: 'ECB must comply with RBI\'s benchmark rate + spread ceiling regardless of TP.',
      },
    ],
    getOutcome: (answers) => {
      if (answers.q1 === 'yes') {
        return {
          method: 'Safe Harbour (Forex Loan) / CUP',
          rationale: 'Forex intercompany loans: Safe Harbour rate = 6-month LIBOR/SOFR + 150–450 bps (based on credit rating). CUP using comparable external debt instruments as alternative.',
          citation: 'Rule 10TD(2)(a); RBI Master Direction — ECB',
          scrutiny: 'Low if within RBI ceiling',
          alternate: 'CUP using comparable Bloomberg bond data',
          color: 'emerald',
        };
      }
      return {
        method: 'Safe Harbour (INR Loan) / CUP',
        rationale: 'INR intercompany loans: Safe Harbour rate = SBI Prime Lending Rate + 100–325 bps. CUP using comparable Indian corporate bond rates.',
        citation: 'Rule 10TD(2)(b); CBDT Circular 3/2021',
        scrutiny: 'Low if within safe harbour band',
        alternate: 'CUP using RBI published lending rates',
        color: 'emerald',
      };
    },
  },
  GOODS: {
    questions: [
      {
        id: 'q1',
        text: 'Are identical or closely comparable uncontrolled transactions available?',
        detail: 'CUP is the preferred method for commodities and standardised goods.',
      },
      {
        id: 'q2',
        text: 'Is the Indian entity a distributor (buying and reselling)?',
        detail: 'Resale Price Method (RPM) is appropriate for distribution functions with no significant value addition.',
      },
    ],
    getOutcome: (answers) => {
      if (answers.q1 === 'yes') {
        return {
          method: 'Comparable Uncontrolled Price (CUP)',
          rationale: 'CUP is the most direct method for goods — commodity exchanges, published price lists, or comparable third-party contracts used as benchmarks.',
          citation: 'Rule 10B(1)(a); OECD TP Guidelines Para 2.15',
          scrutiny: 'Low',
          alternate: 'TNMM if product not truly comparable',
          color: 'indigo',
        };
      }
      if (answers.q2 === 'yes') {
        return {
          method: 'Resale Price Method (RPM)',
          rationale: 'For distributors, the gross margin earned on resale is benchmarked against comparable distributors. Appropriate where distributor performs limited functions.',
          citation: 'Rule 10B(1)(b); OECD TP Guidelines Para 2.27',
          scrutiny: 'Medium',
          alternate: 'TNMM if gross margin data unavailable',
          color: 'blue',
        };
      }
      return {
        method: 'Transactional Net Margin Method (TNMM)',
        rationale: 'Where CUP and RPM are unavailable, TNMM applied at the level of the Indian entity is the fallback for goods transactions.',
        citation: 'Rule 10B(1)(e)',
        scrutiny: 'Medium',
        alternate: 'CPM for manufacturer role',
        color: 'blue',
      };
    },
  },
  COST_SHARING: {
    questions: [
      {
        id: 'q1',
        text: 'Is the cost sharing arrangement (CSA) governed by a written agreement?',
        detail: 'A formal Cost Contribution Agreement (CCA) is required for the arrangement to be respected.',
      },
      {
        id: 'q2',
        text: 'Are contributions proportional to expected benefits?',
        detail: 'Each participant must contribute in proportion to their anticipated benefit — misalignment triggers TP adjustment.',
      },
    ],
    getOutcome: (answers) => {
      if (!answers.q1 || answers.q1 === 'no') {
        return {
          method: 'Arrangement May Be Recharacterised',
          rationale: 'Without a formal CCA, CBDT may recharacterise the arrangement as a service charge or royalty, attracting different TP treatment and TDS obligations.',
          citation: 'Rule 10B; OECD TP Guidelines Chapter VIII',
          scrutiny: 'Very High',
          alternate: 'Execute a formal CCA immediately',
          color: 'rose',
        };
      }
      return {
        method: 'Cost Contribution Arrangement (CCA)',
        rationale: 'Each participant\'s contribution is benchmarked against their proportionate share of expected benefits. Excess contributions treated as royalty/service fee.',
        citation: 'Rule 10B; OECD TP Guidelines Para 8.3',
        scrutiny: 'Medium to High',
        alternate: 'PSM if contributions involve unique intangibles',
        color: 'violet',
      };
    },
  },
};

const SCRUTINY_COLORS = {
  'Nil':         'bg-emerald-100 text-emerald-800',
  'Low':         'bg-blue-100 text-blue-800',
  'Low to Medium': 'bg-blue-100 text-blue-800',
  'Medium':      'bg-amber-100 text-amber-800',
  'Medium to High': 'bg-amber-100 text-amber-800',
  'High':        'bg-orange-100 text-orange-800',
  'Very High':   'bg-rose-100 text-rose-800',
};

export default function MethodSelector({ client }) {
  const [selectedType, setSelectedType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [outcome, setOutcome] = useState(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setAnswers({});
    setOutcome(null);
  };

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    const tree = DECISION_TREES[selectedType.id];
    const allAnswered = tree.questions.every(q => newAnswers[q.id] !== undefined);
    if (allAnswered) {
      setOutcome(tree.getOutcome(newAnswers));
    } else {
      setOutcome(null);
    }
  };

  const reset = () => {
    setSelectedType(null);
    setAnswers({});
    setOutcome(null);
  };

  const currentTree = selectedType ? DECISION_TREES[selectedType.id] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div>
          <h3 className="font-bold text-slate-900">TP Method Selector</h3>
          <p className="text-xs text-slate-500 mt-0.5">Rule 10B · OECD TP Guidelines</p>
        </div>
        {selectedType && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">

        {/* Step 1: Transaction Type */}
        {!selectedType ? (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Step 1 — Select Transaction Type
            </p>
            <div className="space-y-2">
              {TRANSACTION_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group"
                >
                  <span className="text-xl flex-shrink-0">{type.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">{type.label}</p>
                      {type.common && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">Common</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{type.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Selected type header */}
            <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
              <span className="text-xl">{selectedType.icon}</span>
              <div>
                <p className="text-sm font-bold text-indigo-900">{selectedType.label}</p>
                <p className="text-xs text-indigo-600">{selectedType.description}</p>
              </div>
            </div>

            {/* Step 2: Questions */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Step 2 — Qualifying Questions
              </p>
              <div className="space-y-3">
                {currentTree.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/60">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{q.text}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{q.detail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-7">
                      {['yes', 'no'].map(val => (
                        <button
                          key={val}
                          onClick={() => handleAnswer(q.id, val)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                            answers[q.id] === val
                              ? val === 'yes'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {val === 'yes' ? '✓ Yes' : '✗ No'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Outcome */}
            {outcome && (
              <div className={`border rounded-xl overflow-hidden ${
                outcome.color === 'emerald' ? 'border-emerald-200' :
                outcome.color === 'rose'    ? 'border-rose-200'    :
                outcome.color === 'violet'  ? 'border-violet-200'  :
                                              'border-indigo-200'
              }`}>
                <div className={`px-5 py-3.5 ${
                  outcome.color === 'emerald' ? 'bg-emerald-50' :
                  outcome.color === 'rose'    ? 'bg-rose-50'    :
                  outcome.color === 'violet'  ? 'bg-violet-50'  :
                                                'bg-indigo-50'
                }`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Step 3 — Recommended Method
                  </p>
                  <p className={`text-base font-extrabold ${
                    outcome.color === 'emerald' ? 'text-emerald-900' :
                    outcome.color === 'rose'    ? 'text-rose-900'    :
                    outcome.color === 'violet'  ? 'text-violet-900'  :
                                                  'text-indigo-900'
                  }`}>
                    {outcome.method}
                  </p>
                </div>
                <div className="p-5 bg-white space-y-4">
                  <p className="text-sm text-slate-700 leading-relaxed">{outcome.rationale}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Regulatory Basis</p>
                      <p className="text-xs font-bold text-slate-800">{outcome.citation}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CBDT Scrutiny Risk</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${SCRUTINY_COLORS[outcome.scrutiny] || 'bg-slate-100 text-slate-700'}`}>
                        {outcome.scrutiny}
                      </span>
                    </div>
                  </div>

                  {outcome.alternate && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        <strong>Alternative method:</strong> {outcome.alternate}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}