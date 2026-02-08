// Sample light curve data for analysis
export interface LightCurveDataPoint {
  time: number; // Julian Date offset
  magnitude: number;
  error: number;
}

export interface LightCurveDataset {
  id: string;
  name: string;
  objectName: string;
  objectType: string;
  dateRange: string;
  points: number;
  data: LightCurveDataPoint[];
}

// Generate realistic light curve data
function generateVariableStar(baseTime: number, numPoints: number, period: number, amplitude: number): LightCurveDataPoint[] {
  const data: LightCurveDataPoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const time = baseTime + (i * 0.1) + (Math.random() * 0.05);
    const phase = (2 * Math.PI * time) / period;
    const magnitude = 12.5 + amplitude * Math.sin(phase) + (Math.random() * 0.05);
    const error = 0.02 + Math.random() * 0.03;
    data.push({ time, magnitude, error });
  }
  return data;
}

function generateEclipsingBinary(baseTime: number, numPoints: number): LightCurveDataPoint[] {
  const data: LightCurveDataPoint[] = [];
  const period = 2.87; // days
  for (let i = 0; i < numPoints; i++) {
    const time = baseTime + (i * 0.08) + (Math.random() * 0.02);
    const phase = ((time % period) / period);
    let magnitude = 10.2;
    
    // Primary eclipse
    if (phase > 0.48 && phase < 0.52) {
      magnitude += 0.8 * Math.exp(-Math.pow((phase - 0.5) * 50, 2));
    }
    // Secondary eclipse
    if (phase > 0.98 || phase < 0.02) {
      const adjustedPhase = phase > 0.5 ? phase - 1 : phase;
      magnitude += 0.3 * Math.exp(-Math.pow(adjustedPhase * 50, 2));
    }
    
    magnitude += (Math.random() - 0.5) * 0.03;
    const error = 0.015 + Math.random() * 0.02;
    data.push({ time, magnitude, error });
  }
  return data;
}

function generateTransient(baseTime: number, numPoints: number): LightCurveDataPoint[] {
  const data: LightCurveDataPoint[] = [];
  const peakTime = baseTime + 15;
  for (let i = 0; i < numPoints; i++) {
    const time = baseTime + (i * 0.5);
    let magnitude = 18.0;
    
    if (time < peakTime) {
      // Rise phase
      const riseProgress = (time - baseTime) / (peakTime - baseTime);
      magnitude = 18.0 - 5.0 * Math.pow(riseProgress, 2);
    } else {
      // Decay phase
      const decayTime = time - peakTime;
      magnitude = 13.0 + 0.1 * decayTime + 0.002 * Math.pow(decayTime, 2);
    }
    
    magnitude += (Math.random() - 0.5) * 0.1;
    magnitude = Math.min(magnitude, 19.0);
    const error = 0.05 + Math.random() * 0.08;
    data.push({ time, magnitude, error });
  }
  return data;
}

export const sampleLightCurves: LightCurveDataset[] = [
  {
    id: "rr-lyrae-sample",
    name: "RR Lyrae Variable",
    objectName: "RR Lyr",
    objectType: "Pulsating Variable",
    dateRange: "2024-01-01 to 2024-03-01",
    points: 150,
    data: generateVariableStar(2460310, 150, 0.567, 0.9),
  },
  {
    id: "algol-sample",
    name: "Algol-type Binary",
    objectName: "Beta Persei",
    objectType: "Eclipsing Binary",
    dateRange: "2024-02-01 to 2024-04-15",
    points: 200,
    data: generateEclipsingBinary(2460340, 200),
  },
  {
    id: "supernova-sample",
    name: "Type Ia Supernova",
    objectName: "SN 2024abc",
    objectType: "Supernova",
    dateRange: "2024-01-15 to 2024-05-01",
    points: 80,
    data: generateTransient(2460325, 80),
  },
  {
    id: "cepheid-sample",
    name: "Delta Cephei Variable",
    objectName: "Delta Cep",
    objectType: "Classical Cepheid",
    dateRange: "2023-10-01 to 2024-01-15",
    points: 180,
    data: generateVariableStar(2460220, 180, 5.366, 0.7),
  },
];

// Light curve analysis functions
export function smoothLightCurve(data: LightCurveDataPoint[], windowSize: number = 5): LightCurveDataPoint[] {
  const smoothed: LightCurveDataPoint[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const avgMag = window.reduce((sum, p) => sum + p.magnitude, 0) / window.length;
    const avgErr = window.reduce((sum, p) => sum + p.error, 0) / window.length / Math.sqrt(window.length);
    smoothed.push({ time: data[i].time, magnitude: avgMag, error: avgErr });
  }
  return smoothed;
}

export function detectPeriod(data: LightCurveDataPoint[]): { period: number; power: number } {
  // Simplified Lomb-Scargle periodogram
  const minPeriod = 0.1;
  const maxPeriod = 10;
  const numTrials = 1000;
  
  let bestPeriod = 0;
  let bestPower = 0;
  
  const times = data.map(d => d.time);
  const mags = data.map(d => d.magnitude);
  const meanMag = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((sum, m) => sum + Math.pow(m - meanMag, 2), 0) / mags.length;
  
  for (let i = 0; i < numTrials; i++) {
    const period = minPeriod + (maxPeriod - minPeriod) * (i / numTrials);
    const omega = (2 * Math.PI) / period;
    
    let sumCos = 0, sumSin = 0;
    let sumCos2 = 0, sumSin2 = 0;
    
    for (let j = 0; j < data.length; j++) {
      const phase = omega * times[j];
      const dev = mags[j] - meanMag;
      sumCos += dev * Math.cos(phase);
      sumSin += dev * Math.sin(phase);
      sumCos2 += Math.cos(2 * phase);
      sumSin2 += Math.sin(2 * phase);
    }
    
    const power = (sumCos * sumCos + sumSin * sumSin) / (2 * variance * data.length);
    
    if (power > bestPower) {
      bestPower = power;
      bestPeriod = period;
    }
  }
  
  return { period: bestPeriod, power: bestPower };
}

export function detectOutliers(data: LightCurveDataPoint[], sigmaThreshold: number = 3): number[] {
  const mags = data.map(d => d.magnitude);
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const std = Math.sqrt(mags.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / mags.length);
  
  const outlierIndices: number[] = [];
  data.forEach((point, index) => {
    if (Math.abs(point.magnitude - mean) > sigmaThreshold * std) {
      outlierIndices.push(index);
    }
  });
  
  return outlierIndices;
}

export function calculateVariability(data: LightCurveDataPoint[]): number {
  const mags = data.map(d => d.magnitude);
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const std = Math.sqrt(mags.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / mags.length);
  const meanError = data.reduce((sum, d) => sum + d.error, 0) / data.length;
  
  // Variability index: std divided by mean error
  return std / meanError;
}
