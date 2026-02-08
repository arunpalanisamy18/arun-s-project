// Mock astronomical catalog data
export interface AstronomicalObject {
  id: string;
  name: string;
  alternateNames: string[];
  type: "star" | "galaxy" | "nebula" | "quasar" | "cluster" | "planet" | "asteroid" | "comet";
  constellation: string;
  coordinates: {
    ra: string; // Right Ascension (HH:MM:SS)
    dec: string; // Declination (DD:MM:SS)
    raDecimal: number;
    decDecimal: number;
  };
  magnitude: number | null;
  distance: string | null;
  redshift: number | null;
  spectralType: string | null;
  discoveredBy: string | null;
  discoveryYear: number | null;
  description: string;
  catalog: "SIMBAD" | "NED" | "SDSS" | "NGC" | "Messier";
}

export const mockCatalogObjects: AstronomicalObject[] = [
  {
    id: "m31",
    name: "Andromeda Galaxy",
    alternateNames: ["M31", "NGC 224", "UGC 454"],
    type: "galaxy",
    constellation: "Andromeda",
    coordinates: {
      ra: "00h 42m 44.3s",
      dec: "+41° 16′ 09″",
      raDecimal: 10.6847,
      decDecimal: 41.2692,
    },
    magnitude: 3.44,
    distance: "2.537 Mly",
    redshift: -0.001001,
    spectralType: "SA(s)b",
    discoveredBy: "Persian astronomers",
    discoveryYear: 964,
    description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest large galaxy to the Milky Way. It is on a collision course with our galaxy.",
    catalog: "Messier",
  },
  {
    id: "m42",
    name: "Orion Nebula",
    alternateNames: ["M42", "NGC 1976", "Sharpless 281"],
    type: "nebula",
    constellation: "Orion",
    coordinates: {
      ra: "05h 35m 17.3s",
      dec: "-05° 23′ 28″",
      raDecimal: 83.8208,
      decDecimal: -5.3911,
    },
    magnitude: 4.0,
    distance: "1,344 ly",
    redshift: null,
    spectralType: "HII region",
    discoveredBy: "Nicolas-Claude Fabri de Peiresc",
    discoveryYear: 1610,
    description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, being south of Orion's Belt in the constellation of Orion.",
    catalog: "Messier",
  },
  {
    id: "3c273",
    name: "3C 273",
    alternateNames: ["PGC 41121", "QSO B1226+023"],
    type: "quasar",
    constellation: "Virgo",
    coordinates: {
      ra: "12h 29m 06.7s",
      dec: "+02° 03′ 09″",
      raDecimal: 187.2779,
      decDecimal: 2.0525,
    },
    magnitude: 12.9,
    distance: "2.4 Gly",
    redshift: 0.158,
    spectralType: "QSO",
    discoveredBy: "Allan Sandage",
    discoveryYear: 1963,
    description: "3C 273 is a quasar located in the constellation Virgo. It was the first quasar ever to be identified and is the optically brightest quasar in the sky.",
    catalog: "SIMBAD",
  },
  {
    id: "ngc1300",
    name: "NGC 1300",
    alternateNames: ["PGC 12412", "ESO 547-31"],
    type: "galaxy",
    constellation: "Eridanus",
    coordinates: {
      ra: "03h 19m 41.1s",
      dec: "-19° 24′ 41″",
      raDecimal: 49.9212,
      decDecimal: -19.4114,
    },
    magnitude: 10.4,
    distance: "61.3 Mly",
    redshift: 0.00525,
    spectralType: "SB(rs)bc",
    discoveredBy: "John Herschel",
    discoveryYear: 1835,
    description: "NGC 1300 is a barred spiral galaxy about 61 million light-years away in the constellation Eridanus. It is considered to be prototypical of barred spiral galaxies.",
    catalog: "NGC",
  },
  {
    id: "sirius",
    name: "Sirius",
    alternateNames: ["α Canis Majoris", "Dog Star", "HD 48915"],
    type: "star",
    constellation: "Canis Major",
    coordinates: {
      ra: "06h 45m 08.9s",
      dec: "-16° 42′ 58″",
      raDecimal: 101.2875,
      decDecimal: -16.7161,
    },
    magnitude: -1.46,
    distance: "8.6 ly",
    redshift: null,
    spectralType: "A1V",
    discoveredBy: null,
    discoveryYear: null,
    description: "Sirius is the brightest star in the night sky. It is a binary star system consisting of Sirius A and a faint white dwarf companion Sirius B.",
    catalog: "SIMBAD",
  },
  {
    id: "m1",
    name: "Crab Nebula",
    alternateNames: ["M1", "NGC 1952", "Taurus A"],
    type: "nebula",
    constellation: "Taurus",
    coordinates: {
      ra: "05h 34m 31.9s",
      dec: "+22° 00′ 52″",
      raDecimal: 83.6329,
      decDecimal: 22.0144,
    },
    magnitude: 8.4,
    distance: "6,500 ly",
    redshift: null,
    spectralType: "Supernova remnant",
    discoveredBy: "John Bevis",
    discoveryYear: 1731,
    description: "The Crab Nebula is a supernova remnant and pulsar wind nebula. It is the remnant of a supernova that was recorded by Chinese astronomers in 1054 AD.",
    catalog: "Messier",
  },
  {
    id: "m87",
    name: "Virgo A",
    alternateNames: ["M87", "NGC 4486", "Virgo A"],
    type: "galaxy",
    constellation: "Virgo",
    coordinates: {
      ra: "12h 30m 49.4s",
      dec: "+12° 23′ 28″",
      raDecimal: 187.7058,
      decDecimal: 12.3911,
    },
    magnitude: 8.6,
    distance: "53.5 Mly",
    redshift: 0.00428,
    spectralType: "E0-1 pec",
    discoveredBy: "Charles Messier",
    discoveryYear: 1781,
    description: "M87 is a supergiant elliptical galaxy in the constellation Virgo. It hosts a supermassive black hole, the first to be directly imaged by the Event Horizon Telescope in 2019.",
    catalog: "Messier",
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    alternateNames: ["α Orionis", "HD 39801", "58 Ori"],
    type: "star",
    constellation: "Orion",
    coordinates: {
      ra: "05h 55m 10.3s",
      dec: "+07° 24′ 25″",
      raDecimal: 88.7929,
      decDecimal: 7.4069,
    },
    magnitude: 0.42,
    distance: "700 ly",
    redshift: null,
    spectralType: "M1-M2 Ia-ab",
    discoveredBy: null,
    discoveryYear: null,
    description: "Betelgeuse is a red supergiant star in the constellation Orion. It is one of the largest stars visible to the naked eye and may explode as a supernova within the next 100,000 years.",
    catalog: "SIMBAD",
  },
];

export function searchCatalog(query: string): AstronomicalObject[] {
  const lowerQuery = query.toLowerCase();
  return mockCatalogObjects.filter(
    (obj) =>
      obj.name.toLowerCase().includes(lowerQuery) ||
      obj.alternateNames.some((n) => n.toLowerCase().includes(lowerQuery)) ||
      obj.constellation.toLowerCase().includes(lowerQuery) ||
      obj.type.toLowerCase().includes(lowerQuery)
  );
}

export function getObjectById(id: string): AstronomicalObject | undefined {
  return mockCatalogObjects.find((obj) => obj.id === id);
}
