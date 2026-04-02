import { Formula } from './types';

export const FORMULAS: Formula[] = [
  {
    id: 'snell',
    name: "Ley de Snell",
    category: "Óptica",
    equation: "n₁ · sin(θ₁) = n₂ · sin(θ₂)",
    principle: "Refracción de la luz al pasar entre medios de diferente índice.",
    variables: [
      { id: 'n1', label: 'Índice medio 1', symbol: 'n₁' },
      { id: 'theta1', label: 'Ángulo incidencia', symbol: 'θ₁', unit: '°' },
      { id: 'n2', label: 'Índice medio 2', symbol: 'n₂' },
      { id: 'theta2', label: 'Ángulo refracción', symbol: 'θ₂', unit: '°' },
    ]
  },
  {
    id: 'gravitation',
    name: "Gravitación Universal",
    category: "Mecánica",
    equation: "F = G · (m₁ · m₂) / r²",
    principle: "Fuerza de atracción entre dos masas separadas por una distancia.",
    variables: [
      { id: 'F', label: 'Fuerza', symbol: 'F', unit: 'N' },
      { id: 'm1', label: 'Masa 1', symbol: 'm₁', unit: 'kg' },
      { id: 'm2', label: 'Masa 2', symbol: 'm₂', unit: 'kg' },
      { id: 'r', label: 'Distancia', symbol: 'r', unit: 'm' },
    ]
  },
  {
    id: 'idealgas',
    name: "Ley de Gases Ideales",
    category: "Termodinámica",
    equation: "P · V = n · R · T",
    principle: "Relación entre presión, volumen, moles y temperatura de un gas.",
    variables: [
      { id: 'P', label: 'Presión', symbol: 'P', unit: 'atm' },
      { id: 'V', label: 'Volumen', symbol: 'V', unit: 'L' },
      { id: 'n', label: 'Moles', symbol: 'n', unit: 'mol' },
      { id: 'T', label: 'Temperatura', symbol: 'T', unit: 'K' },
    ]
  },
  {
    id: 'first_law',
    name: "Primera Ley Termo",
    category: "Termodinámica",
    equation: "ΔU = Q - W",
    principle: "Conservación de la energía en sistemas térmicos.",
    variables: [
      { id: 'dU', label: 'Energía Interna', symbol: 'ΔU', unit: 'J' },
      { id: 'Q', label: 'Calor Añadido', symbol: 'Q', unit: 'J' },
      { id: 'W', label: 'Trabajo Realizado', symbol: 'W', unit: 'J' },
    ]
  },
  {
    id: 'entropy',
    name: "Cambio de Entropía",
    category: "Termodinámica",
    equation: "ΔS = Q / T",
    principle: "Medida del desorden en un proceso reversible.",
    variables: [
      { id: 'dS', label: 'Entropía', symbol: 'ΔS', unit: 'J/K' },
      { id: 'Q', label: 'Calor Transferido', symbol: 'Q', unit: 'J' },
      { id: 'T', label: 'Temperatura', symbol: 'T', unit: 'K' },
    ]
  },
  {
    id: 'ohm',
    name: "Ley de Ohm",
    category: "Electromagnetismo",
    equation: "V = I · R",
    principle: "Relación entre voltaje, corriente y resistencia eléctrica.",
    variables: [
      { id: 'V', label: 'Voltaje', symbol: 'V', unit: 'V' },
      { id: 'I', label: 'Corriente', symbol: 'I', unit: 'A' },
      { id: 'R', label: 'Resistencia', symbol: 'R', unit: 'Ω' },
    ]
  },
  {
    id: 'gauss_e',
    name: "Ley de Gauss (E)",
    category: "Electromagnetismo",
    equation: "ΦE = Q / ε₀",
    principle: "Flujo eléctrico a través de una superficie cerrada.",
    variables: [
      { id: 'PhiE', label: 'Flujo Eléctrico', symbol: 'ΦE', unit: 'V·m' },
      { id: 'Q', label: 'Carga Total', symbol: 'Q', unit: 'C' },
      { id: 'eps0', label: 'Permitividad', symbol: 'ε₀', unit: 'F/m' },
    ]
  },
  {
    id: 'lorentz',
    name: "Fuerza de Lorentz",
    category: "Electromagnetismo",
    equation: "F = q · v · B",
    principle: "Fuerza sobre una carga en movimiento en un campo magnético (v ⊥ B).",
    variables: [
      { id: 'F', label: 'Fuerza', symbol: 'F', unit: 'N' },
      { id: 'q', label: 'Carga', symbol: 'q', unit: 'C' },
      { id: 'v', label: 'Velocidad', symbol: 'v', unit: 'm/s' },
      { id: 'B', label: 'Campo Magnético', symbol: 'B', unit: 'T' },
    ]
  },
  {
    id: 'kinetic',
    name: "Energía Cinética",
    category: "Mecánica",
    equation: "Ec = ½ · m · v²",
    principle: "Energía de un objeto en movimiento.",
    variables: [
      { id: 'Ec', label: 'Energía', symbol: 'Ec', unit: 'J' },
      { id: 'm', label: 'Masa', symbol: 'm', unit: 'kg' },
      { id: 'v', label: 'Velocidad', symbol: 'v', unit: 'm/s' },
    ]
  },
  {
    id: 'einstein',
    name: "Equivalencia Masa-Energía",
    category: "Física Moderna",
    equation: "E = m · c²",
    principle: "Relación fundamental entre masa y energía.",
    variables: [
      { id: 'E', label: 'Energía', symbol: 'E', unit: 'J' },
      { id: 'm', label: 'Masa', symbol: 'm', unit: 'kg' },
      { id: 'c', label: 'Vel. Luz', symbol: 'c', unit: 'm/s' },
    ]
  },
  {
    id: 'density',
    name: "Densidad",
    category: "Mecánica de Fluidos",
    equation: "ρ = m / V",
    principle: "Relación entre la masa de un cuerpo y su volumen.",
    variables: [
      { id: 'rho', label: 'Densidad', symbol: 'ρ', unit: 'kg/m³' },
      { id: 'm', label: 'Masa', symbol: 'm', unit: 'kg' },
      { id: 'V', label: 'Volumen', symbol: 'V', unit: 'm³' },
    ]
  },
  {
    id: 'reynolds',
    name: "Número de Reynolds",
    category: "Mecánica de Fluidos",
    equation: "Re = (ρ · v · D) / μ",
    principle: "Predice patrones de flujo en diferentes situaciones de fluido.",
    variables: [
      { id: 'Re', label: 'Num. Reynolds', symbol: 'Re' },
      { id: 'rho', label: 'Densidad', symbol: 'ρ', unit: 'kg/m³' },
      { id: 'v', label: 'Velocidad', symbol: 'v', unit: 'm/s' },
      { id: 'D', label: 'Diámetro', symbol: 'D', unit: 'm' },
      { id: 'mu', label: 'Viscosidad', symbol: 'μ', unit: 'Pa·s' },
    ]
  },
  {
    id: 'continuity',
    name: "Ec. Continuidad",
    category: "Mecánica de Fluidos",
    equation: "A₁ · v₁ = A₂ · v₂",
    principle: "Conservación de la masa en un flujo incompresible.",
    variables: [
      { id: 'A1', label: 'Área 1', symbol: 'A₁', unit: 'm²' },
      { id: 'v1', label: 'Velocidad 1', symbol: 'v₁', unit: 'm/s' },
      { id: 'A2', label: 'Área 2', symbol: 'A₂', unit: 'm²' },
      { id: 'v2', label: 'Velocidad 2', symbol: 'v₂', unit: 'm/s' },
    ]
  },
  {
    id: 'carnot',
    name: "Eficiencia de Carnot",
    category: "Termodinámica",
    equation: "η = 1 - (Tc / Th)",
    principle: "Eficiencia máxima teórica de una máquina térmica.",
    variables: [
      { id: 'eta', label: 'Eficiencia', symbol: 'η' },
      { id: 'Tc', label: 'Temp. Fría', symbol: 'Tc', unit: 'K' },
      { id: 'Th', label: 'Temp. Caliente', symbol: 'Th', unit: 'K' },
    ]
  },
  {
    id: 'specific_heat',
    name: "Calor Específico",
    category: "Termodinámica",
    equation: "Q = m · c · ΔT",
    principle: "Energía necesaria para cambiar la temperatura de una masa.",
    variables: [
      { id: 'Q', label: 'Calor', symbol: 'Q', unit: 'J' },
      { id: 'm', label: 'Masa', symbol: 'm', unit: 'kg' },
      { id: 'c', label: 'Calor Esp.', symbol: 'c', unit: 'J/kg·K' },
      { id: 'dT', label: 'Var. Temp.', symbol: 'ΔT', unit: 'K' },
    ]
  },
  {
    id: 'coulomb',
    name: "Ley de Coulomb",
    category: "Electromagnetismo",
    equation: "F = k · (q₁ · q₂) / r²",
    principle: "Fuerza eléctrica entre dos cargas puntuales.",
    variables: [
      { id: 'F', label: 'Fuerza', symbol: 'F', unit: 'N' },
      { id: 'q1', label: 'Carga 1', symbol: 'q₁', unit: 'C' },
      { id: 'q2', label: 'Carga 2', symbol: 'q₂', unit: 'C' },
      { id: 'r', label: 'Distancia', symbol: 'r', unit: 'm' },
    ]
  },
  {
    id: 'capacitance',
    name: "Capacitancia",
    category: "Electromagnetismo",
    equation: "C = Q / V",
    principle: "Capacidad de un componente para almacenar carga eléctrica.",
    variables: [
      { id: 'C', label: 'Capacitancia', symbol: 'C', unit: 'F' },
      { id: 'Q', label: 'Carga', symbol: 'Q', unit: 'C' },
      { id: 'V', label: 'Voltaje', symbol: 'V', unit: 'V' },
    ]
  },
  {
    id: 'hydrostatic',
    name: "Presión Hidrostática",
    category: "Mecánica de Fluidos",
    equation: "P = ρ · g · h",
    principle: "Presión ejercida por un fluido en reposo a una profundidad.",
    variables: [
      { id: 'P', label: 'Presión', symbol: 'P', unit: 'Pa' },
      { id: 'rho', label: 'Densidad', symbol: 'ρ', unit: 'kg/m³' },
      { id: 'h', label: 'Profundidad', symbol: 'h', unit: 'm' },
    ]
  }
];
