/**
 * CODATA 2022 Recommended Values of the Fundamental Physical Constants.
 * These values are the most precise available for scientific calculations.
 */
export interface ConstantData {
  value: number;
  unit: string;
  name: string;
}

export const CODATA_2022: Record<string, ConstantData> = {
  // Speed of light in vacuum (exact)
  c: { value: 299792458, unit: 'm/s', name: 'Speed of Light' },
  // Planck constant (exact)
  h: { value: 6.62607015e-34, unit: 'J·s', name: 'Planck Constant' },
  // Reduced Planck constant
  hbar: { value: 1.054571817e-34, unit: 'J·s', name: 'Reduced Planck Constant' },
  // Elementary charge (exact)
  e: { value: 1.602176634e-19, unit: 'C', name: 'Elementary Charge' },
  // Boltzmann constant (exact)
  k: { value: 1.380649e-23, unit: 'J/K', name: 'Boltzmann Constant' },
  // Avogadro constant (exact)
  NA: { value: 6.02214076e23, unit: 'mol⁻¹', name: 'Avogadro Constant' },
  // Universal gas constant (exact)
  R: { value: 8.314462618, unit: 'J/(mol·K)', name: 'Universal Gas Constant' },
  // Gravitational constant
  G: { value: 6.67430e-11, unit: 'm³/(kg·s²)', name: 'Gravitational Constant' },
  // Fine-structure constant
  alpha: { value: 7.2973525643e-3, unit: '', name: 'Fine-structure Constant' },
  // Electron mass
  me: { value: 9.1093837139e-31, unit: 'kg', name: 'Electron Mass' },
  // Proton mass
  mp: { value: 1.67262192595e-27, unit: 'kg', name: 'Proton Mass' },
  // Neutron mass
  mn: { value: 1.67492750056e-27, unit: 'kg', name: 'Neutron Mass' },
  // Stefan-Boltzmann constant (exact)
  sigma: { value: 5.670374419e-8, unit: 'W/(m²·K⁴)', name: 'Stefan-Boltzmann Constant' },
  // Permittivity of free space (exact)
  epsilon0: { value: 8.8541878188e-12, unit: 'F/m', name: 'Permittivity of Free Space' },
  // Permeability of free space
  mu0: { value: 1.25663706127e-6, unit: 'N/A²', name: 'Permeability of Free Space' },
  // Standard gravity (exact)
  gn: { value: 9.80665, unit: 'm/s²', name: 'Standard Gravity' },
  // Rydberg constant
  Rinf: { value: 10973731.568076, unit: 'm⁻¹', name: 'Rydberg Constant' },
  // Bohr radius
  a0: { value: 5.29177210544e-11, unit: 'm', name: 'Bohr Radius' },
  // Magnetic flux quantum (exact)
  Phi0: { value: 2.067833848e-15, unit: 'Wb', name: 'Magnetic Flux Quantum' },
  // Josephson constant (exact)
  KJ: { value: 483597.8484e9, unit: 'Hz/V', name: 'Josephson Constant' },
  // von Klitzing constant (exact)
  RK: { value: 25812.80745, unit: 'Ω', name: 'von Klitzing Constant' },
  // Conductance quantum (exact)
  G0: { value: 7.748091729e-5, unit: 'S', name: 'Conductance Quantum' },
  // Faraday constant (exact)
  F: { value: 96485.33212, unit: 'C/mol', name: 'Faraday Constant' },
  // Electron volt (exact)
  eV: { value: 1.602176634e-19, unit: 'J', name: 'Electron Volt' },
  // Unified atomic mass unit
  u: { value: 1.66053906892e-27, unit: 'kg', name: 'Unified Atomic Mass Unit' },
};
