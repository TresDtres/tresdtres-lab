export enum Mode {
  Scientific = 'SCIENTIFIC',
  Matrices = 'MATRICES',
  Vectors = 'VECTORS',
  Statistics = 'STATISTICS',
  Equations = 'EQUATIONS',
  Units = 'UNITS',
  Complex = 'COMPLEX',
  LabAI = 'LAB_AI',
  Programmer = 'PROGRAMMER',
  Graphing = 'GRAPHING',
  Constants = 'CONSTANTS',
  More = 'MORE'
}

export interface FormulaVariable {
  id: string;
  label: string;
  symbol: string;
  unit?: string;
}

export interface Formula {
  id: string;
  name: string;
  category: string;
  equation: string;
  principle: string;
  variables: FormulaVariable[];
}
