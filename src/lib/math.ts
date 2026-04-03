import { create, all } from 'mathjs';

export const math = create(all, {
  number: 'BigNumber',
  precision: 64
});

export const toLatex = (expression: string): string => {
  try {
    // Sanitize for mathjs parsing: replace display operators with standard ones
    const sanitized = expression.replace(/·/g, '*').replace(/÷/g, '/');
    let tex = math.parse(sanitized).toTex();
    
    // Fix spacing: remove space between number and variable (e.g., "2 x" -> "2x")
    // and also handle implicit multiplication like "2 \cdot x" -> "2x"
    // and "x y" -> "xy"
    // We handle optional braces and spaces around \cdot
    tex = tex.replace(/(\d)\s*([a-z])/g, '$1$2');
    tex = tex.replace(/(\d)\\cdot\s*\{?([a-z])\}?/g, '$1$2');
    tex = tex.replace(/([a-z])\s*([a-z])/g, '$1$2');
    tex = tex.replace(/([a-z])\\cdot\s*\{?([a-z])\}?/g, '$1$2');
    
    return tex;
  } catch (e) {
    return expression;
  }
};
