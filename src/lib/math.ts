import { create, all } from 'mathjs';

export const math = create(all, {
  number: 'BigNumber',
  precision: 64
});

export const toLatex = (expression: string): string => {
  try {
    return math.parse(expression).toTex();
  } catch (e) {
    return expression;
  }
};
