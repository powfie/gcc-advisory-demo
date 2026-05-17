/**
 * Exact Percentile Calculation using Linear Interpolation
 * Matches Excel's PERCENTILE.INC and standard Big 4 TP methodologies.
 */
const calculatePercentile = (dataArray, percentile) => {
    if (!dataArray || dataArray.length === 0) return 0;
    
    const sorted = [...dataArray].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper >= sorted.length) return sorted[lower];
    return (sorted[lower] * (1 - weight) + sorted[upper] * weight);
  };
  
  /**
   * Calculate Arm's Length Range based on Regulatory Framework
   * @param {number} entityMargin - The client's tested margin
   * @param {Array} comparables - Array of accepted comparable companies
   * @param {string} framework - 'indian' (35-65) or 'oecd' (25-75)
   */
  export function calculateArmsLengthRange(entityMargin, comparables, framework = 'indian') {
    if (!comparables || comparables.length < 5) {
      return { error: 'A minimum of 5 comparables is required for statistical validity.' };
    }
  
    // Extract margins (accounting for your new data structure `median3Yr`)
    const margins = comparables
      .map(comp => comp.median3Yr || comp.margin)
      .filter(m => typeof m === 'number');
  
    // Determine regulatory percentiles
    const percentiles = framework === 'indian' 
      ? { lower: 35, median: 50, upper: 65, name: 'Sec 92C (35th-65th)' } 
      : { lower: 25, median: 50, upper: 75, name: 'OECD IQR (25th-75th)' };
  
    const lowerBound = calculatePercentile(margins, percentiles.lower);
    const median = calculatePercentile(margins, percentiles.median);
    const upperBound = calculatePercentile(margins, percentiles.upper);
  
    return {
      entityMargin,
      framework: percentiles.name,
      lowerBound: parseFloat(lowerBound.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      upperBound: parseFloat(upperBound.toFixed(2)),
      isCompliant: entityMargin >= lowerBound && entityMargin <= upperBound,
      
      // UI specific data for charting
      chartMin: Math.floor(Math.min(...margins)) - 2,
      chartMax: Math.ceil(Math.max(...margins)) + 2,
      
      documentationRequired: framework === 'indian' 
        ? ['Form 3CEB', 'FAR Analysis (Indian Context)', 'Sec 92D Master File']
        : ['OECD Action 13 Master File', 'Local File', 'CbCR']
    };
  }