// src/lib/data/comparables.js

export const comparables = [
    {
      cin: 'U72200KA2000PTC027364',
      name: 'Apex IT Solutions Pvt Ltd',
      functionalProfile: 'IT Services',
      turnoverRange: '100-250', // ₹ Crores
      margins: {
        fy22: 14.5,
        fy23: 15.2,
        fy24: 14.8
      },
      threeYearMedian: 14.83,
      rejected: false,
      rejectionReason: null
    },
    {
      cin: 'U72900MH2015PTC265812',
      name: 'Quantum Tech Ops Ltd',
      functionalProfile: 'IT Services',
      turnoverRange: '50-100',
      margins: {
        fy22: 11.2,
        fy23: 12.0,
        fy24: 12.5
      },
      threeYearMedian: 12.00,
      rejected: false,
      rejectionReason: null
    },
    {
      cin: 'U74140DL2008PTC184599',
      name: 'Synergy BPO India Pvt Ltd',
      functionalProfile: 'ITeS - BPO',
      turnoverRange: '250-500',
      margins: {
        fy22: 16.1,
        fy23: 15.8,
        fy24: 17.0
      },
      threeYearMedian: 16.10,
      rejected: false,
      rejectionReason: null
    },
    {
      cin: 'U73100TG2012PTC081234',
      name: 'BioData R&D Labs Pvt Ltd',
      functionalProfile: 'Contract R&D',
      turnoverRange: '50-100',
      margins: {
        fy22: 18.5,
        fy23: 19.2,
        fy24: 18.8
      },
      threeYearMedian: 18.80,
      rejected: false,
      rejectionReason: null
    },
    {
      cin: 'L72200TN1995PLC032111',
      name: 'MegaCorp Global Solutions Ltd',
      functionalProfile: 'IT Services',
      turnoverRange: '1000+',
      margins: {
        fy22: 24.5,
        fy23: 22.1,
        fy24: 25.0
      },
      threeYearMedian: 24.50,
      rejected: true, // Example of a rejected comparable
      rejectionReason: 'Turnover > ₹1000 Cr fails quantitative filter'
    }
  ];