# PHASE 0 — FOUNDATION BUILD
## Step-by-Step Implementation Walkthrough

---

## OVERVIEW
Phase 0 transforms your app from a monolithic structure into a professional, scalable architecture. You'll:
1. ✅ Create global state management (DashboardContext)
2. ✅ Build complete mock data layer (clients, filings, countries, comparables)
3. ✅ Extract calculation engines (TP, PE, ETR, SEZ, GST)
4. ✅ Build 5 reusable UI components

**Total Time: ~2 weeks**
**Complexity: Medium (no new external libraries, pure React patterns)**

---

# STEP-BY-STEP GUIDE

## STEP 0 — UNDERSTAND THE PATTERN

Before coding, understand what you're building:

### Current Problem
```
App.jsx (1,645 lines)
├── useState × 25 (modal booleans, data, filters)
├── Inline calculations mixed with UI
├── window.confirm() scattered everywhere
└── All pages drill props 5 levels deep
```

### Solution Pattern
```
App.jsx (routing only, ~60 lines)
├── DashboardProvider (global state)
│   ├── state (single source of truth)
│   ├── dispatch (mutation function)
│   └── helpers (convenience methods)
└── Pages/Components use useDashboard() hook
    ├── Access state
    ├── Call dispatch()
    └── Zero prop drilling
```

---

## STEP 1 — CREATE DashboardContext.jsx

**File location:** `src/context/DashboardContext.jsx`

**I've already created this for you above. Let me explain what each section does:**

### Section 1A: Context Creation
```javascript
const DashboardContext = createContext();
```
- This creates the context object
- All components will use `useContext(DashboardContext)` to access it

### Section 1B: Initial State
```javascript
const initialState = {
  sidebarOpen: true,
  activeModal: null,
  clients: [],
  // ... 30+ more fields
};
```
- **This is your single source of truth**
- Every piece of data your app needs is here
- No scattered useState calls in page components
- All data flows through here

### Section 1C: Reducer Function
```javascript
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    // ... 50+ more cases
  }
};
```
- **This is how you mutate state**
- Never modify state directly
- Always return new object: `{ ...state, ...changes }`
- Prevents bugs + enables debugging

### Section 1D: Provider Component
```javascript
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  // ...
}
```
- Wraps your entire app
- Makes state available to all children
- Provides helper methods for convenience

### Section 1E: Custom Hook
```javascript
export function useDashboard() {
  return useContext(DashboardContext);
}
```
- **You'll use this in every component**
- Instead of: `const data = props.data`
- You do: `const { state, dispatch } = useDashboard()`

---

## STEP 2 — INTEGRATE DashboardProvider INTO APP

Now you need to wrap your entire app with the provider.

### File to Edit: `src/App.jsx`

**Current code:**
```javascript
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          {/* routes */}
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}
```

**Updated code:**
```javascript
import { DashboardProvider } from './context/DashboardContext'; // ← ADD THIS

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <DashboardProvider>  {/* ← WRAP HERE */}
          <Routes>
            {/* routes */}
          </Routes>
        </DashboardProvider>
      </AppProvider>
    </AuthProvider>
  );
}
```

**What this does:**
- Providers are stacked: AuthProvider → AppProvider → DashboardProvider
- Each context is available to all child components
- Your app now has centralized state management

**Action:** 
1. Open `src/App.jsx`
2. Import DashboardProvider at the top
3. Wrap `<Routes>` with `<DashboardProvider>`
4. Save and verify no errors in browser console

---

## STEP 3 — CREATE MOCK DATA LAYER

Now build the data that powers your entire app.

### File 1: `src/lib/data/mockClients.js`

Create this file with 8 complete client records:

```javascript
// src/lib/data/mockClients.js

export const MOCK_CLIENTS = [
  {
    id: 'client-001',
    legalName: 'TechNova India Pvt Ltd',
    tradeName: 'TechNova',
    entityType: 'WOS', // Wholly Owned Subsidiary
    cin: 'U72900TG2020PTC123456',
    pan: 'AABCN1234A',
    tan: 'BLTT1234567A',
    parentCountry: 'United States',
    parentCompanyName: 'TechNova Inc, Delaware',
    sector: 'IT Services',
    fy_end: '31-Mar',
    turnover: '₹80 Cr',
    headcount: 450,
    riskStatus: 'Green',
    complianceScore: 92,
    assignedPartner: 'Rajesh Sharma',
    assignedManager: 'Priya Kapoor',
    safeHarbourElected: true,
    cbcrObligation: false,
    masterFileObligation: false,
    peRiskLevel: 'Low',
    lastUpdated: '2026-04-15',
    createdAt: '2026-01-10',
  },
  {
    id: 'client-002',
    legalName: 'FinServe Global Solutions Branch',
    tradeName: 'FinServe',
    entityType: 'Branch',
    cin: null,
    pan: 'AABCN1234B',
    tan: 'BLTT1234567B',
    parentCountry: 'Singapore',
    parentCompanyName: 'FinServe Pte Ltd',
    sector: 'Financial Services BPO',
    fy_end: '31-Mar',
    turnover: '₹120 Cr',
    headcount: 650,
    riskStatus: 'Amber',
    complianceScore: 78,
    assignedPartner: 'Vikram Pillai',
    assignedManager: 'Deepak Kumar',
    safeHarbourElected: false,
    cbcrObligation: false,
    masterFileObligation: false,
    peRiskLevel: 'Medium',
    lastUpdated: '2026-04-10',
    createdAt: '2025-11-20',
  },
  // ... 6 more clients
];
```

**Why 8 clients?**
- Enough variety to test filters, sorting, risk levels
- Includes all entity types: WOS, Branch, LLP, JV, BOT
- Mix of Green/Amber/Red risk statuses
- Covers TP scenarios, PE risks, GST complexity

**Action:**
1. Create `src/lib/data/mockClients.js`
2. Copy the 8 complete client objects (I'll provide the full list below)
3. Export `MOCK_CLIENTS`

---

### File 2: `src/lib/data/complianceFilings.js`

This is your database of all 40+ compliance obligations:

```javascript
// src/lib/data/complianceFilings.js

export const COMPLIANCE_FILINGS = [
  // INCOME TAX FILINGS
  {
    id: 'filing-itax-001',
    name: 'Form 3CEB (TP Audit Report)',
    form: '3CEB',
    law: 'Income Tax Act, 1961',
    section: 'Rule 10D(1)',
    dueDate: { month: 10, day: 31 }, // 31 October
    threshold: 'International transactions > ₹1 Cr',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV', 'BOT'],
    penalty: '₹10,000 + 25% of tax',
    portal: 'Income Tax e-filing',
    category: 'Transfer Pricing',
    checklistItems: [
      'Obtain Form 26AS from IT portal',
      'Finalise all related party transaction amounts',
      'Confirm TP method per transaction',
      'Obtain parent company TP policy',
      'Complete benchmarking study (if turnover > ₹200 Cr)',
      'Draft TP documentation (Local File)',
      'CA certification by ICAI member',
      'File on Income Tax e-filing portal',
      'Download and save acknowledgment',
    ],
  },
  {
    id: 'filing-itax-002',
    name: 'Form 3CEAA (Local File)',
    form: '3CEAA',
    law: 'Income Tax Act, 1961',
    section: 'Rule 10D(2)',
    dueDate: { month: 10, day: 31 },
    threshold: 'Global consolidated revenue > ₹500 Cr',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV'],
    penalty: '₹10,000 per day of delay (max ₹1 Cr)',
    portal: 'Income Tax e-filing',
    category: 'Transfer Pricing',
    checklistItems: [
      'Prepare Local File (80-120 pages)',
      'Include FAR analysis (Functions, Assets, Risks)',
      'Document all related party transactions',
      'Economic analysis with comparables',
      'Regulatory compliance certification',
    ],
  },
  
  // GST FILINGS
  {
    id: 'filing-gst-001',
    name: 'GSTR-1 (Outward Supplies)',
    form: 'GSTR-1',
    law: 'GST Act, 2017',
    section: 'Rule 61',
    dueDate: { month: -1, day: 11 }, // 11th of next month (calculated)
    threshold: 'All businesses with GST registration',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV', 'BOT'],
    penalty: '₹100 per day (max ₹5,000) if filed late',
    portal: 'GST portal (gst.gov.in)',
    category: 'GST',
    checklistItems: [
      'Compile all invoice data from current month',
      'Filter exports (0% GST)',
      'Include inter-state supplies with IGST',
      'Attach supporting documents',
      'File by 11th of next month',
    ],
  },
  
  // FEMA FILINGS
  {
    id: 'filing-fema-001',
    name: 'FLA Return (Foreign Liabilities & Assets)',
    form: 'FLA',
    law: 'FEMA Act, 1999 / RBI Notification',
    section: 'Schedule 4, RBI Master Circular',
    dueDate: { month: 7, day: 15 }, // 15 July
    threshold: 'Any Indian company with foreign investment or making investment abroad',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV'],
    penalty: '₹5,000 + penalty on additional tax',
    portal: 'RBI FIRMS portal',
    category: 'FEMA',
    checklistItems: [
      'Compile foreign liability data (FDI, ECB, trade credit)',
      'Compile foreign asset data (ODI, portfolio)',
      'Reconcile with last year figures',
      'Exchange rate: use RBI reference rate',
      'File on FIRMS portal by 15 July',
    ],
  },

  // ... 36 more filings covering:
  // - Companies Act (AGM, Annual Return, Board Meetings)
  // - Labour Laws (PF, ESIC, PT, LWF)
  // - FEMA/RBI (FC-GPR, FC-TRS, ECB, ODI)
  // - GST (GSTR-3B, GSTR-9, GSTR-9C)
];
```

**Key properties in each filing:**
- `id`: Unique identifier
- `name`: User-friendly name
- `form`: Official form number (for lookup)
- `section`: Relevant section of law
- `dueDate`: { month, day } (month: -1 means previous month end)
- `threshold`: When this filing is required
- `applicableTo`: Which entity types must file
- `penalty`: What happens if you miss it
- `checklistItems`: Step-by-step preparation checklist

**Action:**
1. Create `src/lib/data/complianceFilings.js`
2. Include 40+ filings covering all laws (I'll provide complete list)
3. Test: import in a component and console.log to verify data

---

### File 3: `src/lib/data/dtaaTreaties.js`

Database of all 96 India Double Taxation Avoidance Agreements:

```javascript
// src/lib/data/dtaaTreaties.js

export const DTAA_TREATIES = [
  {
    countryCode: 'US',
    countryName: 'United States of America',
    dividendRate: 15,
    interestRate: 15,
    royaltyRate: 15,
    ftsRate: 15, // Fees for Technical Services
    peThreshold: 183, // days
    mliApplicable: true, // Multilateral Instrument
    effectiveDate: '2016-12-28',
    notes: 'Article 10 (Dividends). No treaty withholding on royalty if conditions met.',
  },
  {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    dividendRate: 15,
    interestRate: 15,
    royaltyRate: 15,
    ftsRate: 15,
    peThreshold: 183,
    mliApplicable: true,
    effectiveDate: '1993-07-28',
    notes: 'Standard treaty. Check for recent amendments.',
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    dividendRate: 15,
    interestRate: 15,
    royaltyRate: 15,
    ftsRate: 15,
    peThreshold: 183,
    mliApplicable: true,
    effectiveDate: '1989-06-06',
    notes: 'Favorable rates. Common route for GCC entities.',
  },
  {
    countryCode: 'NL',
    countryName: 'Netherlands',
    dividendRate: 15,
    interestRate: 0, // No withholding on interest
    royaltyRate: 10,
    ftsRate: 15,
    peThreshold: 183,
    mliApplicable: true,
    effectiveDate: '1988-12-07',
    notes: 'Treaty shopping route. Clearance required in advance.',
  },
  {
    countryCode: 'MU',
    countryName: 'Mauritius',
    dividendRate: 15,
    interestRate: 15,
    royaltyRate: 10,
    ftsRate: 15,
    peThreshold: 183,
    mliApplicable: false,
    effectiveDate: '1983-10-21',
    notes: 'Dividend withholding recently increased to 15% (was 0%).',
  },
  
  // ... 91 more countries (all 96 DTAA partners)
];
```

**Why this matters:**
- When remitting profits/royalties abroad, DTAA rates determine withholding tax
- US parent: 15% dividend withholding
- Singapore: same, but ITC available
- Mauritius: lower rates but substance requirement scrutinized
- Your TP engine will reference this to calculate net repatriation

**Action:**
1. Create `src/lib/data/dtaaTreaties.js`
2. Add all 96 countries (key ones: US, UK, SG, NL, MU, Canada, Japan, China, UAE, Australia)
3. Verify a sample: `DTAA_TREATIES.find(t => t.countryCode === 'US')`

---

### File 4: `src/lib/data/tpComparables.js`

Database of 180+ Indian IT/ITeS companies with profit margins:

```javascript
// src/lib/data/tpComparables.js

export const TP_COMPARABLES = [
  {
    id: 'comp-001',
    companyName: 'Infosys Limited',
    cin: 'L72500KA1981PLC013609',
    functionalProfile: 'IT Services - Global Delivery',
    turnoverRange: '₹1,000 Cr+',
    headcount: '300,000+',
    fy2024Margin: 18.2,
    fy2023Margin: 17.8,
    fy2022Margin: 17.5,
    median3Yr: 17.83,
    iqrLower: 16.5,
    iqrUpper: 19.1,
    industryCode: '6209', // Computer Programming
  },
  {
    id: 'comp-002',
    companyName: 'Tata Consultancy Services',
    cin: 'L72500MH1995PLC084446',
    functionalProfile: 'IT Services - Global Delivery',
    turnoverRange: '₹1,500 Cr+',
    headcount: '600,000+',
    fy2024Margin: 19.5,
    fy2023Margin: 19.2,
    fy2022Margin: 18.9,
    median3Yr: 19.2,
    iqrLower: 18.5,
    iqrUpper: 20.1,
    industryCode: '6209',
  },
  {
    id: 'comp-003',
    companyName: 'HCL Technologies',
    cin: 'L72500DL1991PLC047969',
    functionalProfile: 'IT Services - Infrastructure Services',
    turnoverRange: '₹800 Cr+',
    headcount: '220,000+',
    fy2024Margin: 15.8,
    fy2023Margin: 15.4,
    fy2022Margin: 15.1,
    median3Yr: 15.43,
    iqrLower: 14.2,
    iqrUpper: 16.8,
    industryCode: '6209',
  },
  
  // ... 177 more companies
  // Covers: Wipro, Tech Mahindra, Cognizant, Accenture India,
  //         Deloitte Consulting, EY, PwC, KPMG, BIG, mid-size, boutique firms
];
```

**Why you need 180+ comparables:**
- TP Arm's Length analysis requires at least 5 comparable companies
- More data = stronger IQR (Inter-Quartile Range)
- Used when clients claim TNMM (Transactional Net Margin Method)
- Your benchmarking engine will calculate: Q1, Median, Q3 from this

**Action:**
1. Create `src/lib/data/tpComparables.js`
2. Add ~180 Indian IT/ITeS companies with CIN, margins for FY2022/23/24
3. Calculate median 3-year margin for each
4. Include industry codes (6209 for IT services)

---

## STEP 4 — CREATE CALCULATION ENGINES

Now extract all math from UI. These are pure functions (no side effects).

### File 1: `src/lib/calculations/tp.js`

Transfer Pricing calculations:

```javascript
// src/lib/calculations/tp.js

/**
 * Analyze Safe Harbour eligibility and scenarios
 * Budget 2026: IT/ITeS Safe Harbour margin = 15.5%
 */
export function analyzeSafeHarbour(revenue, costBase, entityType, turnover) {
  // Eligibility check
  const eligible = {
    isWos: entityType === 'WOS',
    isBelowTurnover: parseInt(turnover) < 20000000000, // ₹200 Cr
    hasInternationalTxns: revenue > 0,
  };
  
  const safeHarbourMargin = 0.155; // 15.5%
  const profitRequired = revenue * safeHarbourMargin;
  
  return {
    method: 'Safe Harbour',
    margin: safeHarbourMargin,
    marginPercentage: '15.5%',
    minProfit: profitRequired,
    filingRequired: true,
    form: '3CEFA',
    complexity: 'Low',
    litRisk: 'None',
    eligible: eligible.isWos && eligible.isBelowTurnover,
    requirements: [
      'Must file on time (31 October)',
      'No benchmarking required',
      'Margin must meet ≥ 15.5% threshold',
      'Profit above safe harbour = safe from TP scrutiny',
      'File Form 3CEAB (Local File) for documentation',
    ],
    penalty: 'None if profit ≥ 15.5%',
  };
}

/**
 * Calculate TP penalty exposure if adjustment made
 */
export function calculateTPPenalty(adjustment, isSafeHarbour) {
  const adjustmentTax = adjustment * 0.2517; // 25.17% corporate tax (incl. surcharge + cess)
  const penaltyRate = isSafeHarbour ? 0 : 1.0; // 100% penalty if outside safe harbour
  const basePenalty = adjustmentTax * penaltyRate;
  const monthsDelay = 12; // Assume 12 months interest accumulation
  const interest = (adjustmentTax * 0.01) * monthsDelay; // 1% per month
  
  return {
    adjustmentAmount: adjustment,
    adjustmentTax: adjustmentTax.toFixed(2),
    basePenalty: basePenalty.toFixed(2),
    interest: interest.toFixed(2),
    totalExposure: (parseFloat(adjustmentTax) + parseFloat(basePenalty) + parseFloat(interest)).toFixed(2),
    riskLevel: isSafeHarbour ? 'None' : 'High',
    breakdown: `Tax: ₹${adjustmentTax.toFixed(0)} + Penalty: ₹${basePenalty.toFixed(0)} + Interest: ₹${interest.toFixed(0)}`,
  };
}

/**
 * Calculate TNMM (Transactional Net Margin Method) arm's length range
 */
export function calculateTNMM(revenue, comparablePeerMargins) {
  if (!comparablePeerMargins || comparablePeerMargins.length < 5) {
    return {
      error: 'Minimum 5 comparable companies required',
      requiredDocumentation: [
        'Comparable search (databases: MAS Spectrum, Amadeus, RoyaltyRange)',
        'FAR analysis (Functions, Assets, Risks)',
        'Economic analysis',
        'Local File (80-120 pages)',
      ],
    };
  }
  
  const sortedMargins = [...comparablePeerMargins].sort((a, b) => a - b);
  const count = sortedMargins.length;
  
  // Inter-Quartile Range (IQR) calculation
  const q1_index = Math.floor(count * 0.25);
  const median_index = Math.floor(count * 0.5);
  const q3_index = Math.floor(count * 0.75);
  
  const q1 = sortedMargins[q1_index]; // Lower quartile
  const median = sortedMargins[median_index]; // Median
  const q3 = sortedMargins[q3_index]; // Upper quartile
  
  const profitRequired_q1 = revenue * q1;
  const profitRequired_median = revenue * median;
  const profitRequired_q3 = revenue * q3;
  
  return {
    method: 'TNMM',
    comparableCount: count,
    rangePercentage: `${(q1 * 100).toFixed(1)}% – ${(q3 * 100).toFixed(1)}%`,
    q1Percentage: `${(q1 * 100).toFixed(1)}%`,
    medianPercentage: `${(median * 100).toFixed(1)}%`,
    q3Percentage: `${(q3 * 100).toFixed(1)}%`,
    profitRequired: {
      lowerQuartile: profitRequired_q1.toFixed(0),
      median: profitRequired_median.toFixed(0),
      upperQuartile: profitRequired_q3.toFixed(0),
    },
    requiredDocumentation: [
      'Comparable search methodology',
      'FAR (Functional Analysis)',
      'Economic analysis',
      'Local File certification by CA',
    ],
    scrutinyRisk: 'Medium (CBDT commonly scrutinizes TNMM margins)',
  };
}
```

**Key functions:**
- `analyzeSafeHarbour()` — Is client eligible? What margin required?
- `calculateTPPenalty()` — If TP audit finds shortfall, what's the exposure?
- `calculateTNMM()` — IQR (Inter-Quartile Range) from comparable companies

**Action:**
1. Create `src/lib/calculations/tp.js`
2. Copy the 3 functions above
3. Test: `console.log(analyzeSafeHarbour(5000000000, 0, 'WOS', '₹80 Cr'))`

---

### File 2: `src/lib/calculations/pe.js`

Permanent Establishment risk calculation:

```javascript
// src/lib/calculations/pe.js

/**
 * Calculate PE (Permanent Establishment) risk based on travel log
 * PE triggered: >90 days in rolling 12 months (Service PE test)
 */
export function calculatePERisk(travelLog, role, fixedPlacePresence, dtaaCountry = 'US') {
  if (!travelLog || travelLog.length === 0) {
    return {
      peTriggered: false,
      riskLevel: 'Low',
      days: 0,
      recommendation: 'No travel recorded. PE risk is low.',
    };
  }
  
  // Calculate days in current financial year (Apr 1 - Mar 31)
  const currentFYStart = new Date(2026, 3, 1); // April 1, 2026
  const currentFYEnd = new Date(2027, 2, 31); // March 31, 2027
  
  const currentFYDays = travelLog
    .filter(entry => {
      const entryDate = new Date(entry.dateIn);
      const exitDate = new Date(entry.dateOut);
      return entryDate <= currentFYEnd && exitDate >= currentFYStart;
    })
    .reduce((sum, entry) => {
      const start = new Date(Math.max(new Date(entry.dateIn), currentFYStart));
      const end = new Date(Math.min(new Date(entry.dateOut), currentFYEnd));
      const days = (end - start) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, days);
    }, 0);
  
  // Calculate rolling 12 months (more conservative)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const rolling12Months = travelLog
    .filter(entry => new Date(entry.dateIn) >= oneYearAgo)
    .reduce((sum, entry) => {
      const days = (new Date(entry.dateOut) - new Date(entry.dateIn)) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
  
  // PE tests
  const servicePE = rolling12Months >= 90; // >90 days = PE
  const fixedPlacePE = fixedPlacePresence; // Dedicated office = PE
  const dependentAgentPE = role.toLowerCase().includes('manager') ||
                           role.toLowerCase().includes('director'); // Management authority = PE
  
  const peTriggered = servicePE || fixedPlacePE || dependentAgentPE;
  
  return {
    currentFYDays: Math.round(currentFYDays),
    rolling12Months: Math.round(rolling12Months),
    
    // PE test results
    servicePE: {
      triggered: servicePE,
      threshold: 90,
      actual: Math.round(rolling12Months),
      remaining: Math.max(0, 90 - Math.round(rolling12Months)),
    },
    fixedPlacePE: {
      triggered: fixedPlacePE,
      note: 'Does expat have dedicated office/workspace in India?',
    },
    dependentAgentPE: {
      triggered: dependentAgentPE,
      note: 'Can expat conclude contracts on behalf of parent?',
    },
    
    peTriggered,
    riskLevel: peTriggered ? 'CRITICAL' : rolling12Months >= 60 ? 'High' : 'Low',
    
    recommendation: peTriggered
      ? `🔴 PE TRIGGERED. Parent company has PE in India. Potential tax exposure on entire Indian operations income. Consider expat exit/restructuring.`
      : rolling12Months >= 60
      ? `🟡 APPROACHING THRESHOLD. ${90 - Math.round(rolling12Months)} days remaining before PE triggered. Plan exit before calendar year-end.`
      : `✅ PE risk low. ${Math.round(rolling12Months)} days in rolling 12M. Monitor travel.`,
    
    dtaaImpact: `DTAA with ${dtaaCountry}: PE threshold is 183 calendar days OR dependent agent. Lower of 90-day service PE doesn't apply under DTAA.`,
  };
}
```

**Key logic:**
- Rolling 12-month calculation (>90 days = PE trigger)
- Three PE tests: Service PE · Fixed Place PE · Dependent Agent PE
- Returns remaining days before PE threshold
- Flags if expat approaching danger zone

**Action:**
1. Create `src/lib/calculations/pe.js`
2. Copy function above
3. Test with sample travel log

---

### File 3: `src/lib/calculations/etr.js`

Pillar Two ETR (Effective Tax Rate) calculation:

```javascript
// src/lib/calculations/etr.js

/**
 * Calculate GloBE ETR (Effective Tax Rate) under Pillar Two
 * Global minimum tax: 15%
 * India QDMTT (Qualified Domestic Minimum Top-up Tax): 15%
 */
export function calculateGloBEETR(globalRevenue, indianProfit, indianTaxes, sbiePayroll, sbieTangibleAssets) {
  const glbeThreshold = 750000000; // €750M global revenue threshold
  const etrThreshold = 0.15; // 15% minimum ETR
  
  // SBIE (Substance-Based Income Exclusion) calculation
  // Exclusion = 8% of payroll + 10% of net tangible assets
  const sbieAmount = (sbiePayroll * 0.08) + (sbieTangibleAssets * 0.10);
  
  // Adjusted income = Indian profit - SBIE
  const adjustedIncome = Math.max(0, indianProfit - sbieAmount);
  
  // ETR calculations
  const etrBefore = (indianTaxes / indianProfit) * 100;
  const etrAfterSBIE = adjustedIncome > 0 ? (indianTaxes / adjustedIncome) * 100 : 0;
  
  // Top-up tax (QDMTT) calculation
  let topUpTax = 0;
  if (etrAfterSBIE < etrThreshold * 100) {
    const requiredTax = adjustedIncome * etrThreshold;
    topUpTax = Math.max(0, requiredTax - indianTaxes);
  }
  
  return {
    inScope: globalRevenue >= glbeThreshold,
    globalRevenue,
    
    withoutSBIE: {
      indianProfit,
      indianTaxes,
      etr: etrBefore.toFixed(2) + '%',
      topUpTax: etrBefore < 15 ? 'Yes' : 'No',
      topUpAmount: etrBefore < 15 ? calculateTopUpTax(indianProfit, indianTaxes, etrThreshold).toFixed(0) : '0',
    },
    
    withSBIE: {
      sbiePayroll,
      sbieTangibleAssets,
      sbieAmount: sbieAmount.toFixed(0),
      adjustedIncome: adjustedIncome.toFixed(0),
      indianTaxes,
      etr: etrAfterSBIE.toFixed(2) + '%',
      topUpTax: etrAfterSBIE < 15 ? 'Yes' : 'No',
      topUpAmount: topUpTax.toFixed(0),
      benefit: (calculateTopUpTax(indianProfit, indianTaxes, etrThreshold) - topUpTax).toFixed(0),
    },
    
    recommendation: !inScope
      ? 'Out of scope (global revenue < €750M). Pillar Two QDMTT does not apply.'
      : etrAfterSBIE >= 15
      ? '✅ No QDMTT. ETR >= 15%. Compliant with Pillar Two.'
      : `⚠️ QDMTT Exposure: ₹${topUpTax.toFixed(0)} lakhs. Consider SBIE optimization.`,
  };
}

function calculateTopUpTax(profit, taxPaid, threshold) {
  return Math.max(0, (profit * threshold) - taxPaid);
}
```

**Key points:**
- Pillar Two applies if global revenue > €750M
- SBIE (Substance-Based Income Exclusion) reduces Indian profit for ETR calculation
- QDMTT (Qualified Domestic Minimum Top-up Tax) = additional Indian tax if ETR < 15%
- Shows benefit of SBIE optimization

**Action:**
1. Create `src/lib/calculations/etr.js`
2. Copy function above
3. Test with sample data

---

### File 4: `src/lib/calculations/sez.js`

SEZ tax benefit calculation (10-year analysis):

```javascript
// src/lib/calculations/sez.js

/**
 * Calculate SEZ tax benefits over 10 years
 * Standard rate: 25.17% (incl. surcharge + cess)
 * SEZ rate: 10% + varying restrictions
 */
export function calculateSEZSavings(annualRevenue, profitMargin = 0.20, yearsInSEZ = 10) {
  const standardTaxRate = 0.2517; // 25.17% (domestic company)
  const sezTaxRate = 0.10; // 10% in SEZ for export of goods/services
  
  const yearlyData = [];
  
  for (let year = 1; year <= yearsInSEZ; year++) {
    const yearProfit = annualRevenue * profitMargin;
    const standardTax = yearProfit * standardTaxRate;
    const sezTax = yearProfit * sezTaxRate;
    const annualSaving = standardTax - sezTax;
    
    const cumulativeSaving = yearlyData.reduce((sum, y) => sum + y.annualSaving, 0) + annualSaving;
    
    yearlyData.push({
      year,
      revenue: annualRevenue,
      profit: yearProfit,
      profitMargin: (profitMargin * 100).toFixed(1) + '%',
      standardTax: standardTax.toFixed(0),
      sezTax: sezTax.toFixed(0),
      annualSaving: annualSaving.toFixed(0),
      cumulativeSaving: cumulativeSaving.toFixed(0),
    });
  }
  
  const totalSaving = yearlyData.reduce((sum, y) => sum + parseFloat(y.annualSaving), 0);
  const totalStandardTax = yearlyData.reduce((sum, y) => sum + parseFloat(y.standardTax), 0);
  const totalSEZTax = yearlyData.reduce((sum, y) => sum + parseFloat(y.sezTax), 0);
  
  return {
    scenario: `SEZ Setup in Year 1, Operate 10 Years`,
    setupCost: 0, // To be filled in Entity Structuring module
    annualRevenue,
    profitMargin: (profitMargin * 100).toFixed(1) + '%',
    
    summary: {
      totalStandardTax: totalStandardTax.toFixed(0),
      totalSEZTax: totalSEZTax.toFixed(0),
      totalSavings: totalSaving.toFixed(0),
      roi: ((totalSaving / 500000) * 100).toFixed(1) + '%', // Assume ₹5 Cr setup cost
    },
    
    yearByYear: yearlyData,
    
    conditions: [
      'Export of goods/services must be primary activity',
      'SEZ certificate must remain valid',
      'Benefits sunset after 15 years from commissioning',
      'Domestic sales subject to standard tax rates',
      'Capital goods procurement: IGST refund available',
    ],
    
    riskFactors: [
      'Policy amendments (benefit withdrawal possible)',
      'Compliance burden (monitoring, audit requirements)',
      'Transfer pricing scrutiny (related party pricing tested)',
      'SEZ certificate cancellation (loss of benefits immediately)',
    ],
  };
}
```

**Action:**
1. Create `src/lib/calculations/sez.js`
2. Copy function above

---

## STEP 5 — CREATE 5 REUSABLE UI COMPONENTS

Now build the UI primitives your entire app will use.

### Component 1: `src/components/ui/ConfirmModal.jsx`

Replaces all `window.confirm()` calls:

```javascript
// src/components/ui/ConfirmModal.jsx

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { AlertCircle, Check, X } from 'lucide-react';

/**
 * Professional Confirm Modal
 * Replaces window.confirm() with styled dialog
 * 
 * Usage: const { showConfirm } = useDashboard();
 *        showConfirm('Delete Client?', 'This action cannot be undone.', () => deleteClient());
 */
export function ConfirmModal() {
  const { state, dispatch } = useDashboard();
  const { confirmDialog } = state;

  if (!confirmDialog?.open) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm?.();
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  const handleCancel = () => {
    confirmDialog.onCancel?.();
    dispatch({ type: 'CLOSE_CONFIRM' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        {/* Icon */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="ml-3 text-lg font-semibold text-gray-900">
            {confirmDialog.title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          {confirmDialog.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {confirmDialog.confirmText || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Action:**
1. Create `src/components/ui/ConfirmModal.jsx`
2. Copy code above
3. Import into `DashboardLayout.jsx` and render at top level

---

### Component 2: `src/components/ui/EmptyState.jsx`

Displays when lists are empty:

```javascript
// src/components/ui/EmptyState.jsx

import React from 'react';

/**
 * Empty State Component
 * Used when: list is empty, no search results, no data
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

**Usage:**
```javascript
<EmptyState
  icon={PlusIcon}
  title="No clients yet"
  description="Add your first GCC entity to get started"
  action={{ label: 'Add Client', onClick: () => openModal('add-client') }}
/>
```

**Action:**
1. Create `src/components/ui/EmptyState.jsx`
2. Copy code above

---

### Component 3: `src/components/ui/Skeleton.jsx`

Loading placeholders (animated grey blocks):

```javascript
// src/components/ui/Skeleton.jsx

/**
 * Skeleton Loader
 * Shows while data is loading
 * Variants: text, title, card, tableRow, kpiCard
 */
export function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full bg-gray-200 rounded',
    title: 'h-6 w-2/3 bg-gray-200 rounded',
    card: 'h-40 w-full bg-gray-200 rounded-lg',
    tableRow: 'h-10 w-full bg-gray-200 rounded',
    kpiCard: 'h-32 w-full bg-gray-200 rounded-lg',
  };

  return (
    <div
      className={`${variants[variant]} animate-pulse ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
```

**Usage:**
```javascript
{isLoading ? (
  <Skeleton variant="kpiCard" className="mb-4" />
) : (
  <KPICard data={data} />
)}
```

**Action:**
1. Create `src/components/ui/Skeleton.jsx`
2. Copy code above

---

### Component 4: `src/components/ui/ComplianceScore.jsx`

Circular progress gauge (0–100):

```javascript
// src/components/ui/ComplianceScore.jsx

/**
 * Compliance Score Gauge
 * Circular progress indicator from 0–100
 * Colors: Green (80+) · Amber (50–79) · Red (<50)
 */
export function ComplianceScore({ score = 75, size = 120 }) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${getColor()}`}
        />
      </svg>
      <p className={`text-2xl font-bold mt-2 ${getColor()}`}>
        {score}
      </p>
    </div>
  );
}
```

**Action:**
1. Create `src/components/ui/ComplianceScore.jsx`
2. Copy code above

---

### Component 5: `src/components/ui/CommandPalette.jsx`

Search/command palette (opens with ⌘K):

```javascript
// src/components/ui/CommandPalette.jsx

import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Search, X } from 'lucide-react';

/**
 * Command Palette
 * Opens on ⌘K (Cmd+K on Mac, Ctrl+K on Windows)
 * Searches: Clients · Pages · Tools · Help
 */
export function CommandPalette() {
  const { state, dispatch } = useDashboard();
  const { commandPaletteOpen, clients } = state;
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Keyboard shortcut: ⌘K or Ctrl+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'OPEN_COMMAND_PALETTE' });
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_COMMAND_PALETTE' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    // Search logic
    if (!search) {
      setResults([]);
      return;
    }

    const searchLower = search.toLowerCase();
    const clientResults = clients
      .filter((c) => c.legalName.toLowerCase().includes(searchLower))
      .map((c) => ({
        category: 'Clients',
        title: c.legalName,
        description: `${c.entityType} · Risk: ${c.riskStatus}`,
        action: () => dispatch({ type: 'SET_SELECTED_CLIENT', payload: c.id }),
      }));

    setResults(clientResults);
  }, [search, clients]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search clients, tools, pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 flex-1 outline-none text-sm"
          />
          <button
            onClick={() => dispatch({ type: 'CLOSE_COMMAND_PALETTE' })}
            className="ml-2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => {
                  result.action();
                  dispatch({ type: 'CLOSE_COMMAND_PALETTE' });
                }}
                className="w-full px-4 py-3 text-left hover:bg-indigo-50 border-b transition"
              >
                <p className="text-xs font-semibold text-indigo-600">
                  {result.category}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {result.title}
                </p>
                <p className="text-xs text-gray-600">
                  {result.description}
                </p>
              </button>
            ))
          ) : search ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Type to search clients, tools, pages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Action:**
1. Create `src/components/ui/CommandPalette.jsx`
2. Copy code above
3. Import into `DashboardLayout.jsx` and render
4. Press ⌘K (Mac) or Ctrl+K (Windows) to test

---

## STEP 6 — LOAD MOCK DATA INTO CONTEXT ON APP START

When app loads, populate DashboardContext with mock data.

### File to Create: `src/hooks/useInitializeApp.js`

```javascript
// src/hooks/useInitializeApp.js

import { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MOCK_CLIENTS } from '../lib/data/mockClients';
import { COMPLIANCE_FILINGS } from '../lib/data/complianceFilings';

/**
 * Hook to initialize app data on load
 * Populates DashboardContext with mock data
 */
export function useInitializeApp() {
  const { dispatch } = useDashboard();

  useEffect(() => {
    // Load mock data into context
    dispatch({ type: 'SET_CLIENTS', payload: MOCK_CLIENTS });
    dispatch({ type: 'SET_COMPLIANCE_ITEMS', payload: COMPLIANCE_FILINGS });
    
    // Generate compliance items per client
    const clientComplianceMap = MOCK_CLIENTS.map((client) => {
      const applicableFilings = COMPLIANCE_FILINGS.filter((filing) =>
        filing.applicableTo.includes(client.entityType)
      );
      return {
        clientId: client.id,
        filings: applicableFilings,
      };
    });
    
    console.log('✅ App initialized with mock data:', {
      clients: MOCK_CLIENTS.length,
      filings: COMPLIANCE_FILINGS.length,
    });
  }, [dispatch]);
}
```

### Use in `DashboardLayout.jsx`:

```javascript
import { useInitializeApp } from '../hooks/useInitializeApp';

export function DashboardLayout() {
  useInitializeApp(); // Load data on mount
  // ... rest of component
}
```

**Action:**
1. Create `src/hooks/useInitializeApp.js`
2. Call `useInitializeApp()` in `DashboardLayout.jsx`
3. Check browser console for "✅ App initialized..." message

---

## STEP 7 — VERIFY EVERYTHING WORKS

Test that Phase 0 foundation is solid:

### Test 1: Confirm DashboardContext is accessible

In any component, add:
```javascript
const { state } = useDashboard();
console.log('Clients:', state.clients);
console.log('Filings:', state.complianceItems);
```

Expected output: 8 clients, 40+ filings logged to console.

### Test 2: Confirm state mutations work

Add a button to any page:
```javascript
const { addNotification } = useDashboard();

<button onClick={() => {
  addNotification({
    title: 'Test Notification',
    type: 'success'
  });
}}>
  Add Test Notification
</button>
```

Expected: Toast appears at top of screen.

### Test 3: Confirm ConfirmModal works

```javascript
const { showConfirm } = useDashboard();

<button onClick={() => {
  showConfirm('Delete?', 'Are you sure?', () => {
    console.log('Deleted!');
  });
}}>
  Test Delete
</button>
```

Expected: Modal appears asking for confirmation.

### Test 4: Confirm CommandPalette works

Press `⌘K` (Mac) or `Ctrl+K` (Windows).

Expected: Search palette opens, searching clients works.

---

## PHASE 0 COMPLETE CHECKLIST

- [ ] `src/context/DashboardContext.jsx` created with 50+ actions
- [ ] `src/App.jsx` wrapped with `<DashboardProvider>`
- [ ] `src/lib/data/mockClients.js` has 8 complete clients
- [ ] `src/lib/data/complianceFilings.js` has 40+ filings
- [ ] `src/lib/data/dtaaTreaties.js` has 96 countries
- [ ] `src/lib/data/tpComparables.js` has 180+ companies
- [ ] `src/lib/calculations/tp.js` has 3 functions (Safe Harbour, TNMM, Penalty)
- [ ] `src/lib/calculations/pe.js` has PE risk calculation
- [ ] `src/lib/calculations/etr.js` has Pillar Two ETR calculation
- [ ] `src/lib/calculations/sez.js` has SEZ savings model
- [ ] `src/components/ui/ConfirmModal.jsx` created
- [ ] `src/components/ui/EmptyState.jsx` created
- [ ] `src/components/ui/Skeleton.jsx` created
- [ ] `src/components/ui/ComplianceScore.jsx` created
- [ ] `src/components/ui/CommandPalette.jsx` created
- [ ] `src/hooks/useInitializeApp.js` created
- [ ] `DashboardLayout.jsx` calls `useInitializeApp()`
- [ ] ConfirmModal rendered in `DashboardLayout.jsx`
- [ ] CommandPalette rendered in `DashboardLayout.jsx`
- [ ] Tests pass: state accessible, notifications work, modals work, search works
- [ ] Zero `window.confirm()` / `window.alert()` / `Math.random()` in code

---

## TIMELINE FOR PHASE 0

| Step | Task | Hours | By Day |
|---|---|---|---|
| 1 | Understand pattern + create DashboardContext | 4 | Mon |
| 2 | Integrate DashboardProvider into App | 1 | Mon |
| 3 | Create mock data layer (8 clients, 40+ filings, 96 countries, 180+ comparables) | 6 | Tue |
| 4 | Create calculation engines (TP, PE, ETR, SEZ) | 8 | Wed |
| 5 | Create 5 UI components | 4 | Thu |
| 6 | Integrate mock data loading + initialize app | 2 | Fri |
| 7 | Test everything (state, notifications, modals, search) | 2 | Fri |
| **TOTAL** | | **27 hours** | **1 week** |

---

## NEXT STEPS (After Phase 0)

Once Phase 0 is solid:

**Phase 1 (Weeks 2–3):** Auth & Paywall improvements
- Separate Sign In / Sign Up screens
- 3-tier pricing paywall
- Full 12-module sidebar
- ⌘K command palette fully functional

Then Phase 2–15 follow the same pattern.

---

**Ready to start? Let me know when you've completed Phase 0 Step 1 (DashboardContext), and I'll guide you through Step 2!**
