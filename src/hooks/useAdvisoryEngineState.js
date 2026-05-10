import { useCallback, useState } from 'react';

export function useAdvisoryEngineState() {
  const [revenue, setRevenue] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);
  const [globalRevenue, setGlobalRevenue] = useState('');
  const [indianProfit, setIndianProfit] = useState('');
  const [indianTax, setIndianTax] = useState('');
  const [etrResult, setEtrResult] = useState(null);
  const [headcount, setHeadcount] = useState('');
  const [opCost, setOpCost] = useState('');
  const [showEntityResults, setShowEntityResults] = useState(false);

  const [dtaaCountry, setDtaaCountry] = useState('US');
  const [dtaaAmount, setDtaaAmount] = useState('');
  const [dtaaResult, setDtaaResult] = useState(null);

  const [sezRevenue, setSezRevenue] = useState('');
  const [sezMargin, setSezMargin] = useState('15.5');
  const [sezHeadcount, setSezHeadcount] = useState('');
  const [sezResult, setSezResult] = useState(null);

  const handleCalculateTP = useCallback(() => {
    const revNumber = parseFloat(revenue);
    if (!Number.isNaN(revNumber)) setCalculatedProfit(revNumber * 0.155);
  }, [revenue]);

  const handleCalculateETR = useCallback(() => {
    const rev = parseFloat(globalRevenue);
    const profit = parseFloat(indianProfit);
    const tax = parseFloat(indianTax);
    if (Number.isNaN(rev) || Number.isNaN(profit) || Number.isNaN(tax) || profit <= 0) return;
    const isSubjectToPillarTwo = rev >= 750000000;
    const etr = (tax / profit) * 100;
    let topUpTax = 0;
    if (isSubjectToPillarTwo && etr < 15) {
      topUpTax = (0.15 - tax / profit) * profit;
    }
    setEtrResult({
      isSubject: isSubjectToPillarTwo,
      etr: etr.toFixed(2),
      topUpTax: topUpTax > 0 ? topUpTax : 0,
    });
  }, [globalRevenue, indianProfit, indianTax]);

  const handleCalculateDTAA = useCallback(() => {
    const amount = parseFloat(dtaaAmount);
    if (Number.isNaN(amount)) return;
    let rate = 0.2;
    if (dtaaCountry === 'US') rate = 0.15;
    if (['UK', 'UAE', 'Singapore', 'Netherlands'].includes(dtaaCountry)) rate = 0.1;
    const tax = amount * rate;
    const net = amount - tax;
    setDtaaResult({ rate: rate * 100, tax, net });
  }, [dtaaAmount, dtaaCountry]);

  const handleCalculateSEZ = useCallback(() => {
    const rev = parseFloat(sezRevenue);
    const margin = parseFloat(sezMargin) / 100;
    const hc = parseInt(sezHeadcount, 10) || 0;
    if (Number.isNaN(rev) || Number.isNaN(margin)) return;

    const annualProfit = rev * margin;
    const standardTaxAnnual = annualProfit * 0.2517;
    const tenYearStandard = standardTaxAnnual * 10;
    const tenYearSez = 0;
    const annualSubsidies = hc * 180;
    const fiveYearSubsidies = annualSubsidies * 5;

    setSezResult({
      annualProfit,
      standard: tenYearStandard,
      sez: tenYearSez,
      subsidies: fiveYearSubsidies,
      savings: tenYearStandard - tenYearSez + fiveYearSubsidies,
    });
  }, [sezRevenue, sezMargin, sezHeadcount]);

  return {
    revenue,
    setRevenue,
    calculatedProfit,
    setCalculatedProfit,
    globalRevenue,
    setGlobalRevenue,
    indianProfit,
    setIndianProfit,
    indianTax,
    setIndianTax,
    etrResult,
    setEtrResult,
    headcount,
    setHeadcount,
    opCost,
    setOpCost,
    showEntityResults,
    setShowEntityResults,
    dtaaCountry,
    setDtaaCountry,
    dtaaAmount,
    setDtaaAmount,
    dtaaResult,
    setDtaaResult,
    sezRevenue,
    setSezRevenue,
    sezMargin,
    setSezMargin,
    sezHeadcount,
    setSezHeadcount,
    sezResult,
    setSezResult,
    handleCalculateTP,
    handleCalculateETR,
    handleCalculateDTAA,
    handleCalculateSEZ,
  };
}
