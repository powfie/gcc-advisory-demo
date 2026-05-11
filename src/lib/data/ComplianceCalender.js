// src/lib/data/complianceCalendar.js

export const complianceCalendar = [
  // INCOME TAX & TRANSFER PRICING
  {
    id: 'COMP-IT-001',
    name: 'Transfer Pricing Audit Report',
    form: 'Form 3CEB',
    law: 'Income Tax Act, 1961',
    section: 'Section 92E',
    dueDate: { month: 10, day: 31 }, // October 31
    threshold: 'International transactions > ₹1 Cr',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV'],
    penalty: '₹1,000,000 or 2% of transaction value',
    filingPortal: 'Income Tax e-Filing',
    checklistItems: [
      'Finalise related party transaction amounts',
      'Confirm TP method for each transaction',
      'Draft Local File documentation',
      'Obtain CA certification'
    ]
  },
  {
    id: 'COMP-IT-002',
    name: 'Corporate Income Tax Return',
    form: 'ITR-6',
    law: 'Income Tax Act, 1961',
    section: 'Section 139(1)',
    dueDate: { month: 10, day: 31 }, 
    threshold: 'All Companies requiring audit',
    applicableTo: ['WOS', 'JV'],
    penalty: '₹10,000 late fee + 1% interest per month',
    filingPortal: 'Income Tax e-Filing',
    checklistItems: [
      'Finalise statutory audit',
      'Compute tax liability and MAT',
      'Pay self-assessment tax'
    ]
  },

  // GST
  {
    id: 'COMP-GST-001',
    name: 'Monthly Outward Supplies',
    form: 'GSTR-1',
    law: 'CGST Act, 2017',
    section: 'Section 37',
    dueDate: { month: 'Next Month', day: 11 }, 
    threshold: 'Turnover > ₹5 Cr or monthly filer',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV'],
    penalty: '₹50 per day of delay',
    filingPortal: 'GST Portal',
    checklistItems: [
      'Reconcile export invoices',
      'Check SEZ zero-rated supplies',
      'Verify LUT validity'
    ]
  },
  {
    id: 'COMP-GST-002',
    name: 'Monthly Summary Return',
    form: 'GSTR-3B',
    law: 'CGST Act, 2017',
    section: 'Section 39',
    dueDate: { month: 'Next Month', day: 20 },
    threshold: 'All regular taxpayers',
    applicableTo: ['WOS', 'Branch', 'LLP', 'JV'],
    penalty: '₹50 per day + 18% interest on tax payable',
    filingPortal: 'GST Portal',
    checklistItems: [
      'Reconcile GSTR-2B with books for ITC',
      'Calculate RCM liability on import of services',
      'Pay net GST liability'
    ]
  },

  // FEMA & RBI
  {
    id: 'COMP-FEMA-001',
    name: 'Foreign Liabilities & Assets Return',
    form: 'FLA Return',
    law: 'FEMA, 1999',
    section: 'Notification No. FEMA 395/2019-RB',
    dueDate: { month: 7, day: 15 }, // July 15
    threshold: 'Entities with FDI or ODI',
    applicableTo: ['WOS', 'JV', 'LLP'],
    penalty: 'Up to 300% of sum involved or ₹2 Lakhs',
    filingPortal: 'RBI FIRMS Portal',
    checklistItems: [
      'Compile FDI received during FY',
      'Reconcile with FC-GPR filings',
      'Input audited financial data'
    ]
  },

  // COMPANIES ACT (MCA)
  {
    id: 'COMP-MCA-001',
    name: 'Financial Statements Filing',
    form: 'AOC-4',
    law: 'Companies Act, 2013',
    section: 'Section 137',
    dueDate: { month: 'AGM Month', day: '+30 days' },
    threshold: 'All Companies',
    applicableTo: ['WOS', 'JV'],
    penalty: '₹100 per day of default',
    filingPortal: 'MCA21',
    checklistItems: [
      'Adopt financials in AGM',
      'Attach Directors Report',
      'Attach Auditors Report'
    ]
  }
];