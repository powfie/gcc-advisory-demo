/**
 * Pillar Two / GloBE Calculation Engine
 * Calculates Effective Tax Rate (ETR), Substance-Based Income Exclusion (SBIE), 
 * and Qualified Domestic Minimum Top-up Tax (QDMTT) exposure.
 * * @param {Object} params - The financial inputs for the GloBE model.
 * @param {number} params.globalRevenue - Total consolidated group revenue in EUR.
 * @param {number} params.indianProfit - GloBE income/profit for the Indian jurisdiction in INR.
 * @param {number} params.indianTaxes - Covered taxes paid in the Indian jurisdiction in INR.
 * @param {boolean} params.enableSBIE - Flag to apply Substance-Based Income Exclusion.
 * @param {number} [params.sbiePayroll=0] - Eligible payroll costs in INR.
 * @param {number} [params.sbieTangibleAssets=0] - Eligible tangible asset carrying value in INR.
 * @returns {Object} Comprehensive calculation results, intermediate steps, and advisory recommendation.
 */
export const calculateGloBEETR = ({
    globalRevenue,
    indianProfit,
    indianTaxes,
    enableSBIE,
    sbiePayroll = 0,
    sbieTangibleAssets = 0
  }) => {
    // 1. Scope Check (Threshold: €750M)
    const inScope = globalRevenue >= 750000000;
  
    if (!inScope) {
      return {
        inScope,
        recommendation: "Out of scope: Group revenue < €750M. No Pillar Two impact.",
        sbieApplied: 0,
        etrBefore: 0,
        etrAfter: 0,
        qdmttExposure: 0
      };
    }
  
    // Handle edge case: No profit or loss-making
    if (indianProfit <= 0) {
      return {
        inScope,
        recommendation: "No top-up tax exposure: Entity is operating at a loss or zero profit.",
        sbieApplied: 0,
        etrBefore: 0,
        etrAfter: 0,
        qdmttExposure: 0
      };
    }
  
    // 2. SBIE Calculation (8% Payroll + 10% Tangible Assets)
    const sbiePayrollCarveout = sbiePayroll * 0.08;
    const sbieAssetCarveout = sbieTangibleAssets * 0.10;
    const totalSBIE = enableSBIE ? (sbiePayrollCarveout + sbieAssetCarveout) : 0;
  
    // Ensure SBIE does not exceed total profit
    const adjustedProfit = Math.max(0, indianProfit - totalSBIE);
  
    // 3. ETR Calculations
    const etrBefore = (indianTaxes / indianProfit) * 100;
    
    // Prevent division by zero if SBIE wipes out all profit
    const etrAfter = adjustedProfit > 0 ? (indianTaxes / adjustedProfit) * 100 : 100;
  
    // 4. QDMTT Calculation
    let qdmttExposure = 0;
    let recommendation = "";
  
    if (etrAfter >= 15) {
      recommendation = "No QDMTT exposure: ETR exceeds 15% Safe Harbour threshold.";
    } else {
      // Top-up tax calculation based on adjusted profit
      qdmttExposure = Math.max(0, (adjustedProfit * 0.15) - indianTaxes);
      
      if (qdmttExposure > 0) {
        recommendation = `QDMTT of ₹${qdmttExposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} may apply. Optimize SBIE.`;
      } else {
        recommendation = "No QDMTT exposure: Covered taxes offset top-up requirements.";
      }
    }
  
    return {
      inScope,
      sbieApplied: totalSBIE,
      sbiePayrollCarveout,
      sbieAssetCarveout,
      adjustedProfit,
      etrBefore,
      etrAfter,
      qdmttExposure,
      recommendation
    };
  };