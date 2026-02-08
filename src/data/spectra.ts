// Sample spectroscopy data
export interface SpectrumDataPoint {
  wavelength: number; // Angstroms
  flux: number;
  error?: number;
}

export interface SpectrumDataset {
  id: string;
  name: string;
  objectName: string;
  objectType: string;
  wavelengthRange: string;
  resolution: string;
  data: SpectrumDataPoint[];
}

// Common spectral lines in Angstroms
export const spectralLines = {
  hydrogen: {
    "H-alpha": 6562.8,
    "H-beta": 4861.3,
    "H-gamma": 4340.5,
    "H-delta": 4101.7,
    "Lyman-alpha": 1215.7,
  },
  oxygen: {
    "[O II]": 3727.0,
    "[O III] 4959": 4958.9,
    "[O III] 5007": 5006.8,
  },
  nitrogen: {
    "[N II] 6548": 6548.1,
    "[N II] 6583": 6583.5,
  },
  calcium: {
    "Ca II K": 3933.7,
    "Ca II H": 3968.5,
  },
  sodium: {
    "Na D1": 5895.9,
    "Na D2": 5889.9,
  },
  magnesium: {
    "Mg I b": 5183.6,
  },
};

function generateGaussianLine(center: number, width: number, amplitude: number, wavelengths: number[]): number[] {
  return wavelengths.map(w => amplitude * Math.exp(-Math.pow(w - center, 2) / (2 * width * width)));
}

function generateStellarSpectrum(): SpectrumDataPoint[] {
  const data: SpectrumDataPoint[] = [];
  const minWavelength = 3800;
  const maxWavelength = 7200;
  const step = 1;
  
  for (let w = minWavelength; w <= maxWavelength; w += step) {
    // Base continuum (blackbody approximation)
    const temp = 5800; // Sun-like
    const bbFlux = Math.pow(w, -5) / (Math.exp(14388 / (w * temp / 1000)) - 1);
    let flux = bbFlux * 1e15;
    
    // Add absorption lines
    flux -= generateGaussianLine(spectralLines.hydrogen["H-alpha"], 5, 0.2 * flux, [w])[0];
    flux -= generateGaussianLine(spectralLines.hydrogen["H-beta"], 4, 0.25 * flux, [w])[0];
    flux -= generateGaussianLine(spectralLines.calcium["Ca II K"], 3, 0.15 * flux, [w])[0];
    flux -= generateGaussianLine(spectralLines.calcium["Ca II H"], 3, 0.12 * flux, [w])[0];
    flux -= generateGaussianLine(spectralLines.sodium["Na D1"], 2, 0.1 * flux, [w])[0];
    flux -= generateGaussianLine(spectralLines.magnesium["Mg I b"], 3, 0.08 * flux, [w])[0];
    
    // Add noise
    flux += (Math.random() - 0.5) * 0.02 * flux;
    flux = Math.max(flux, 0);
    
    data.push({ wavelength: w, flux, error: 0.02 * flux });
  }
  
  return data;
}

function generateQuasarSpectrum(redshift: number): SpectrumDataPoint[] {
  const data: SpectrumDataPoint[] = [];
  const minWavelength = 3800;
  const maxWavelength = 9000;
  const step = 2;
  
  for (let w = minWavelength; w <= maxWavelength; w += step) {
    // Power-law continuum
    let flux = 100 * Math.pow(w / 5000, -1.5);
    
    // Redshifted emission lines
    const z1 = 1 + redshift;
    flux += generateGaussianLine(spectralLines.hydrogen["Lyman-alpha"] * z1, 15, 80, [w])[0];
    flux += generateGaussianLine(spectralLines.hydrogen["H-beta"] * z1, 20, 40, [w])[0];
    flux += generateGaussianLine(spectralLines.oxygen["[O III] 5007"] * z1, 8, 30, [w])[0];
    flux += generateGaussianLine(spectralLines.hydrogen["H-alpha"] * z1, 25, 60, [w])[0];
    
    flux += (Math.random() - 0.5) * 0.05 * flux;
    flux = Math.max(flux, 0);
    
    data.push({ wavelength: w, flux, error: 0.03 * flux });
  }
  
  return data;
}

function generateNebulaSpectrum(): SpectrumDataPoint[] {
  const data: SpectrumDataPoint[] = [];
  const minWavelength = 3600;
  const maxWavelength = 7000;
  const step = 1;
  
  for (let w = minWavelength; w <= maxWavelength; w += step) {
    // Weak continuum
    let flux = 5 + (Math.random() - 0.5) * 2;
    
    // Strong emission lines
    flux += generateGaussianLine(spectralLines.oxygen["[O II]"], 3, 50, [w])[0];
    flux += generateGaussianLine(spectralLines.hydrogen["H-beta"], 3, 80, [w])[0];
    flux += generateGaussianLine(spectralLines.oxygen["[O III] 4959"], 3, 60, [w])[0];
    flux += generateGaussianLine(spectralLines.oxygen["[O III] 5007"], 3, 180, [w])[0];
    flux += generateGaussianLine(spectralLines.hydrogen["H-alpha"], 4, 250, [w])[0];
    flux += generateGaussianLine(spectralLines.nitrogen["[N II] 6548"], 3, 30, [w])[0];
    flux += generateGaussianLine(spectralLines.nitrogen["[N II] 6583"], 3, 90, [w])[0];
    
    flux = Math.max(flux, 0);
    data.push({ wavelength: w, flux, error: 0.05 * Math.sqrt(flux) });
  }
  
  return data;
}

export const sampleSpectra: SpectrumDataset[] = [
  {
    id: "solar-type",
    name: "G-type Star",
    objectName: "HD 186427 (16 Cyg B)",
    objectType: "Solar Analog",
    wavelengthRange: "3800 - 7200 Å",
    resolution: "R ~ 5000",
    data: generateStellarSpectrum(),
  },
  {
    id: "quasar-z02",
    name: "Quasar (z=0.2)",
    objectName: "SDSS J1234+5678",
    objectType: "Type 1 AGN",
    wavelengthRange: "3800 - 9000 Å",
    resolution: "R ~ 2000",
    data: generateQuasarSpectrum(0.2),
  },
  {
    id: "orion-nebula",
    name: "HII Region",
    objectName: "M42 (Orion Nebula)",
    objectType: "Emission Nebula",
    wavelengthRange: "3600 - 7000 Å",
    resolution: "R ~ 3000",
    data: generateNebulaSpectrum(),
  },
];

// Spectrum analysis functions
export function normalizeSpectrum(data: SpectrumDataPoint[]): SpectrumDataPoint[] {
  const maxFlux = Math.max(...data.map(d => d.flux));
  return data.map(d => ({
    wavelength: d.wavelength,
    flux: d.flux / maxFlux,
    error: d.error ? d.error / maxFlux : undefined,
  }));
}

export function detectPeaks(data: SpectrumDataPoint[], threshold: number = 0.3): { wavelength: number; flux: number }[] {
  const normalized = normalizeSpectrum(data);
  const peaks: { wavelength: number; flux: number }[] = [];
  
  for (let i = 2; i < normalized.length - 2; i++) {
    const current = normalized[i].flux;
    const neighbors = [
      normalized[i - 2].flux,
      normalized[i - 1].flux,
      normalized[i + 1].flux,
      normalized[i + 2].flux,
    ];
    
    if (current > threshold && neighbors.every(n => current > n)) {
      peaks.push({ wavelength: data[i].wavelength, flux: data[i].flux });
    }
  }
  
  return peaks;
}

export function estimateRedshift(detectedWavelength: number, restWavelength: number): number {
  return (detectedWavelength - restWavelength) / restWavelength;
}

export function identifyLine(wavelength: number, tolerance: number = 10): string | null {
  for (const [element, lines] of Object.entries(spectralLines)) {
    for (const [lineName, restWavelength] of Object.entries(lines)) {
      if (Math.abs(wavelength - restWavelength) < tolerance) {
        return `${lineName} (${element})`;
      }
    }
  }
  return null;
}
