// Sample survey data (SDSS-like)
export interface SurveyObject {
  id: string;
  ra: number;
  dec: number;
  objType: "STAR" | "GALAXY" | "QSO" | "UNKNOWN";
  magnitude_u: number;
  magnitude_g: number;
  magnitude_r: number;
  magnitude_i: number;
  magnitude_z: number;
  redshift: number | null;
  redshiftErr: number | null;
  petroRad_r: number;
  extinction_r: number;
  field: string;
}

function generateSurveyData(count: number): SurveyObject[] {
  const data: SurveyObject[] = [];
  const types: SurveyObject["objType"][] = ["STAR", "GALAXY", "GALAXY", "GALAXY", "QSO"];
  const fields = ["COSMOS", "GOODS-N", "GOODS-S", "AEGIS", "UDS", "STRIPE82"];
  
  for (let i = 0; i < count; i++) {
    const objType = types[Math.floor(Math.random() * types.length)];
    const ra = Math.random() * 360;
    const dec = -30 + Math.random() * 90;
    
    // Base magnitudes
    const baseMag = objType === "STAR" ? 15 + Math.random() * 5 : 18 + Math.random() * 4;
    
    // Color offsets based on type
    let colorOffset = { u: 0, g: 0, r: 0, i: 0, z: 0 };
    if (objType === "STAR") {
      colorOffset = { u: 0.5, g: 0.2, r: 0, i: -0.1, z: -0.2 };
    } else if (objType === "GALAXY") {
      colorOffset = { u: 1.0, g: 0.5, r: 0, i: -0.3, z: -0.5 };
    } else if (objType === "QSO") {
      colorOffset = { u: -0.3, g: 0, r: 0, i: 0.1, z: 0.2 };
    }
    
    const redshift = objType === "STAR" ? null : 
      objType === "QSO" ? 0.5 + Math.random() * 2.5 : 
      Math.random() * 0.8;
    
    data.push({
      id: `SDSS-${String(i + 1).padStart(6, "0")}`,
      ra: parseFloat(ra.toFixed(6)),
      dec: parseFloat(dec.toFixed(6)),
      objType,
      magnitude_u: parseFloat((baseMag + colorOffset.u + (Math.random() - 0.5) * 0.3).toFixed(3)),
      magnitude_g: parseFloat((baseMag + colorOffset.g + (Math.random() - 0.5) * 0.2).toFixed(3)),
      magnitude_r: parseFloat((baseMag + colorOffset.r + (Math.random() - 0.5) * 0.2).toFixed(3)),
      magnitude_i: parseFloat((baseMag + colorOffset.i + (Math.random() - 0.5) * 0.2).toFixed(3)),
      magnitude_z: parseFloat((baseMag + colorOffset.z + (Math.random() - 0.5) * 0.3).toFixed(3)),
      redshift: redshift ? parseFloat(redshift.toFixed(4)) : null,
      redshiftErr: redshift ? parseFloat((0.001 + Math.random() * 0.01).toFixed(5)) : null,
      petroRad_r: parseFloat((0.5 + Math.random() * 5).toFixed(2)),
      extinction_r: parseFloat((Math.random() * 0.2).toFixed(4)),
      field: fields[Math.floor(Math.random() * fields.length)],
    });
  }
  
  return data;
}

export const surveyData: SurveyObject[] = generateSurveyData(500);

export interface SurveyFilters {
  objTypes?: SurveyObject["objType"][];
  minRedshift?: number;
  maxRedshift?: number;
  minMagnitude?: number;
  maxMagnitude?: number;
  fields?: string[];
  raMin?: number;
  raMax?: number;
  decMin?: number;
  decMax?: number;
}

export function querySurvey(filters: SurveyFilters): SurveyObject[] {
  return surveyData.filter(obj => {
    if (filters.objTypes && filters.objTypes.length > 0) {
      if (!filters.objTypes.includes(obj.objType)) return false;
    }
    
    if (filters.minRedshift !== undefined && obj.redshift !== null) {
      if (obj.redshift < filters.minRedshift) return false;
    }
    
    if (filters.maxRedshift !== undefined && obj.redshift !== null) {
      if (obj.redshift > filters.maxRedshift) return false;
    }
    
    if (filters.minMagnitude !== undefined) {
      if (obj.magnitude_r < filters.minMagnitude) return false;
    }
    
    if (filters.maxMagnitude !== undefined) {
      if (obj.magnitude_r > filters.maxMagnitude) return false;
    }
    
    if (filters.fields && filters.fields.length > 0) {
      if (!filters.fields.includes(obj.field)) return false;
    }
    
    if (filters.raMin !== undefined && obj.ra < filters.raMin) return false;
    if (filters.raMax !== undefined && obj.ra > filters.raMax) return false;
    if (filters.decMin !== undefined && obj.dec < filters.decMin) return false;
    if (filters.decMax !== undefined && obj.dec > filters.decMax) return false;
    
    return true;
  });
}

export function exportToCSV(objects: SurveyObject[]): string {
  const headers = [
    "id", "ra", "dec", "objType", 
    "magnitude_u", "magnitude_g", "magnitude_r", "magnitude_i", "magnitude_z",
    "redshift", "redshiftErr", "petroRad_r", "extinction_r", "field"
  ];
  
  const rows = objects.map(obj => [
    obj.id, obj.ra, obj.dec, obj.objType,
    obj.magnitude_u, obj.magnitude_g, obj.magnitude_r, obj.magnitude_i, obj.magnitude_z,
    obj.redshift ?? "", obj.redshiftErr ?? "", obj.petroRad_r, obj.extinction_r, obj.field
  ].join(","));
  
  return [headers.join(","), ...rows].join("\n");
}
