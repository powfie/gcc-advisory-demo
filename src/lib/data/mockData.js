// src/lib/data/mockData.js

export const clientsData = [
  {
    id: 'CLI-001',
    name: 'TechNova India Pvt Ltd',
    entityType: 'WOS',
    sector: 'IT Services',
    riskStatus: 'Green',
    tpMethod: 'Safe Harbour',
    parentCountry: 'USA',
    incorporationDate: '2021-04-12',
    complianceScore: 92,
    activeExpats: 2,
    flags: { isCbCR: false, isSEZ: true }
  },
  {
    id: 'CLI-002',
    name: 'FinServe Global Services',
    entityType: 'Branch',
    sector: 'BFSI',
    riskStatus: 'Amber',
    tpMethod: 'Cost Plus',
    parentCountry: 'UK',
    incorporationDate: '2019-08-05',
    complianceScore: 74,
    activeExpats: 5,
    flags: { isCbCR: true, isSEZ: false }
  },
  {
    id: 'CLI-003',
    name: 'HealthAI Innovation Labs',
    entityType: 'LLP',
    sector: 'Healthcare Tech',
    riskStatus: 'Red',
    tpMethod: 'Pending',
    parentCountry: 'Singapore',
    incorporationDate: '2023-01-20',
    complianceScore: 45,
    activeExpats: 1,
    flags: { isCbCR: false, isSEZ: false }
  },
  {
    id: 'CLI-004',
    name: 'Quantum Logistics GCC',
    entityType: 'JV',
    sector: 'Supply Chain',
    riskStatus: 'Green',
    tpMethod: 'CUP Method',
    parentCountry: 'Germany',
    incorporationDate: '2020-11-10',
    complianceScore: 88,
    activeExpats: 0,
    flags: { isCbCR: true, isSEZ: true }
  },
  {
    id: 'CLI-005',
    name: 'GlobalRetail India WOS',
    entityType: 'WOS',
    sector: 'Retail Tech',
    riskStatus: 'Amber',
    tpMethod: 'TNMM',
    parentCountry: 'USA',
    incorporationDate: '2018-05-14',
    complianceScore: 68,
    activeExpats: 3,
    flags: { isCbCR: true, isSEZ: false }
  },
  {
    id: 'CLI-006',
    name: 'NovaPharma R&D Centre',
    entityType: 'WOS',
    sector: 'Contract R&D',
    riskStatus: 'Red',
    tpMethod: 'APA Pending',
    parentCountry: 'Switzerland',
    incorporationDate: '2022-09-01',
    complianceScore: 52,
    activeExpats: 4,
    flags: { isCbCR: true, isSEZ: true }
  },
  {
    id: 'CLI-007',
    name: 'MediaTech IFSC Unit',
    entityType: 'GIFT City IFSC',
    sector: 'Fintech',
    riskStatus: 'Green',
    tpMethod: 'IFSC Exempt',
    parentCountry: 'UAE',
    incorporationDate: '2024-02-15',
    complianceScore: 96,
    activeExpats: 1,
    flags: { isCbCR: false, isSEZ: false } // GIFT City has its own rules
  },
  {
    id: 'CLI-008',
    name: 'EngineerCo Branch Office',
    entityType: 'Branch',
    sector: 'Engineering',
    riskStatus: 'Amber',
    tpMethod: 'TNMM',
    parentCountry: 'Japan',
    incorporationDate: '2017-06-30',
    complianceScore: 61,
    activeExpats: 7,
    flags: { isCbCR: true, isSEZ: false }
  }
];