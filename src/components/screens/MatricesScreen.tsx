import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  FileText, 
  History, 
  Trash2, 
  Settings2, 
  Info, 
  HelpCircle, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  Sigma, 
  Variable, 
  Layers,
  Zap,
  Activity,
  ArrowRightLeft,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { math } from '../../lib/math';
import { TactileButton } from '../TactileButton';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { Matrix as MLMatrix, LuDecomposition, QrDecomposition, SingularValueDecomposition, CholeskyDecomposition } from 'ml-matrix';
import { exportToPDF } from '../../lib/pdfExport';
import { Printer } from 'lucide-react';
import { Latex } from '../Latex';

interface MatricesScreenProps {
  isAdvanced: boolean;
}

export const MatricesScreen = ({ isAdvanced }: MatricesScreenProps) => {
  const { t } = useI18n();
  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [matrixA, setMatrixA] = useState<string[][]>(Array(3).fill(0).map(() => Array(3).fill('0')));
  
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);
  const [matrixB, setMatrixB] = useState<string[][]>(Array(3).fill(0).map(() => Array(3).fill('0')));
  
  const [activeMatrix, setActiveMatrix] = useState<'A' | 'B'>('A');
  const [activeCell, setActiveCell] = useState<{r: number, c: number}>({r: 0, c: 0});
  const [result, setResult] = useState<any>(null);
  const [activeSheet, setActiveSheet] = useState<'EDITOR' | 'WORKSHEET'>('EDITOR');
  const [worksheetData, setWorksheetData] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const handleKeyPress = (key: string) => {
    const currentMatrix = activeMatrix === 'A' ? matrixA : matrixB;
    const setMatrix = activeMatrix === 'A' ? setMatrixA : setMatrixB;
    const rows = activeMatrix === 'A' ? rowsA : rowsB;
    const cols = activeMatrix === 'A' ? colsA : colsB;

    if (key === 'DEL') {
      const newMatrix = [...currentMatrix];
      newMatrix[activeCell.r][activeCell.c] = newMatrix[activeCell.r][activeCell.c].slice(0, -1) || '0';
      setMatrix(newMatrix);
    } else if (key === 'AC') {
      const newMatrix = [...currentMatrix];
      newMatrix[activeCell.r][activeCell.c] = '0';
      setMatrix(newMatrix);
    } else if (key === 'ArrowUp') {
      setActiveCell(prev => ({ ...prev, r: Math.max(0, prev.r - 1) }));
    } else if (key === 'ArrowDown') {
      setActiveCell(prev => ({ ...prev, r: Math.min(rows - 1, prev.r + 1) }));
    } else if (key === 'ArrowLeft') {
      setActiveCell(prev => ({ ...prev, c: Math.max(0, prev.c - 1) }));
    } else if (key === 'ArrowRight') {
      setActiveCell(prev => ({ ...prev, c: Math.min(cols - 1, prev.c + 1) }));
    } else if (key === 'Enter' || key === 'Tab') {
      setActiveCell(prev => {
        if (prev.c < cols - 1) return { ...prev, c: prev.c + 1 };
        if (prev.r < rows - 1) return { r: prev.r + 1, c: 0 };
        return prev;
      });
    } else if (/[0-9.-]/.test(key)) {
      const newMatrix = [...currentMatrix];
      const currentVal = newMatrix[activeCell.r][activeCell.c];
      newMatrix[activeCell.r][activeCell.c] = currentVal === '0' ? key : currentVal + key;
      setMatrix(newMatrix);
    }
  };

  useKeyboardInput(handleKeyPress);

  const formatMatrix = (m: any) => {
    const f = (v: any) => typeof v === 'number' ? parseFloat(v.toFixed(4)).toString() : v;
    if (!Array.isArray(m)) return f(m);
    if (!Array.isArray(m[0])) return `\\begin{bmatrix} ${m.map(f).join(' & ')} \\end{bmatrix}`;
    return `\\begin{bmatrix} ${m.map(row => row.map(f).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
  };

  const calculate = (op: string) => {
    const matA = matrixA.map(r => r.map(c => parseFloat(c)));
    const matB = matrixB.map(r => r.map(c => parseFloat(c)));
    let steps = [];
    try {
      let res;
      if (op === 'det') {
        res = math.det(matA);
        steps.push({ description: "Calcular determinante de A", formula: `det(A) = ${res.toFixed(4)}` });
      } else if (op === 'detB') {
        res = math.det(matB);
        steps.push({ description: "Calcular determinante de B", formula: `det(B) = ${res.toFixed(4)}` });
      } else if (op === 'inv') {
        res = math.inv(matA);
        steps.push({ 
          description: "Calcular inversa de A", 
          formula: "A⁻¹",
          result: formatMatrix(res)
        });
      } else if (op === 'invB') {
        res = math.inv(matB);
        steps.push({ 
          description: "Calcular inversa de B", 
          formula: "B⁻¹",
          result: formatMatrix(res)
        });
      } else if (op === 'trans') {
        res = math.transpose(matA);
        steps.push({ 
          description: "Calcular transpuesta de A", 
          formula: `Aᵀ (${colsA}x${rowsA})`,
          result: formatMatrix(res)
        });
      } else if (op === 'transB') {
        res = math.transpose(matB);
        steps.push({ 
          description: "Calcular transpuesta de B", 
          formula: `Bᵀ (${colsB}x${rowsB})`,
          result: formatMatrix(res)
        });
      } else if (op === 'trace') {
        res = math.trace(matA);
        steps.push({ description: "Calcular traza de A", formula: `tr(A) = ${res.toFixed(4)}` });
      } else if (op === 'mul') {
        if (colsA !== rowsB) {
          throw new Error("Dimension mismatch: Cols of A must equal Rows of B");
        }
        res = math.multiply(matA, matB);
        steps.push({ 
          description: "Multiplicar Matriz A por Matriz B", 
          formula: `${formatMatrix(matA)}\n\n×\n\n${formatMatrix(matB)}`,
          result: formatMatrix(res)
        });
      } else if (op === 'add') {
        if (rowsA !== rowsB || colsA !== colsB) {
          throw new Error("Dimension mismatch: Matrices must have the same dimensions for addition");
        }
        res = math.add(matA, matB);
        steps.push({ 
          description: "Sumar Matriz A y Matriz B", 
          formula: `${formatMatrix(matA)}\n\n+\n\n${formatMatrix(matB)}`,
          result: formatMatrix(res)
        });
      } else if (op === 'sub') {
        if (rowsA !== rowsB || colsA !== colsB) {
          throw new Error("Dimension mismatch: Matrices must have the same dimensions for subtraction");
        }
        res = math.subtract(matA, matB);
        steps.push({ 
          description: "Restar Matriz B de Matriz A", 
          formula: `${formatMatrix(matA)}\n\n-\n\n${formatMatrix(matB)}`,
          result: formatMatrix(res)
        });
      } else if (op === 'lu_simple') {
        const n = matA.length;
        if (n !== matA[0].length) {
          throw new Error("La matriz debe ser cuadrada para la descomposición LU.");
        }
        const a = matA;
        const L: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
        const U: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => 0));

        for (let i = 0; i < n; i++) {
          for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
            U[i][k] = a[i][k] - sum;
          }
          for (let k = i + 1; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
            if (Math.abs(U[i][i]) < 1e-12) {
              throw new Error("Pivote cero detectado. La descomposición A=LU simple no es posible sin reordenar filas (usa LUP).");
            }
            L[k][i] = (a[k][i] - sum) / U[i][i];
          }
        }
        res = { L, U };
        const verification = math.multiply(L, U);
        steps.push({ 
          description: "Descomposición LU Simple (A = LU)", 
          formula: "A = L · U",
          result: `L (Triangular Inferior):\n${formatMatrix(L)}\n\nU (Triangular Superior):\n${formatMatrix(U)}\n\nVerificación (L · U):\n${formatMatrix(verification)}`
        });
      } else if (op === 'lu') {
        const mlMat = new MLMatrix(matA.valueOf() as number[][]);
        const lu = new LuDecomposition(mlMat);
        const L = lu.lowerTriangularMatrix;
        const U = lu.upperTriangularMatrix;
        const pivot = (lu as any).pivot;
        const m = mlMat.rows;
        const P = MLMatrix.zeros(m, m);
        if (pivot && Array.isArray(pivot)) {
          for (let i = 0; i < m; i++) {
            P.set(i, pivot[i], 1);
          }
        } else {
          // Fallback to identity if pivot is not available
          for (let i = 0; i < m; i++) {
            P.set(i, i, 1);
          }
        }
        res = { L, U, P };
        const LU = math.multiply(L.to2DArray(), U.to2DArray());
        steps.push({ 
          description: "Descomposición LU con pivoteo parcial (PA = LU)", 
          formula: "P · A = L · U",
          result: `P (Matriz de Permutación):\n${formatMatrix(P.to2DArray())}\n\nL (Triangular Inferior):\n${formatMatrix(L.to2DArray())}\n\nU (Triangular Superior):\n${formatMatrix(U.to2DArray())}\n\nVerificación (L · U):\n${formatMatrix(LU)}\n\nNota: El producto L·U es igual a la matriz A con las filas reordenadas según P.`
        });
      } else if (op === 'qr') {
        const mlMat = new MLMatrix(matA.valueOf() as number[][]);
        const qr = new QrDecomposition(mlMat);
        const Q = qr.orthogonalMatrix;
        const R = qr.upperTriangularMatrix;
        res = { Q, R };
        steps.push({ 
          description: "Descomposición QR (A = QR)", 
          formula: "A = Q · R",
          result: `Q:\n${formatMatrix(Q.to2DArray())}\n\nR:\n${formatMatrix(R.to2DArray())}`
        });
      } else if (op === 'svd') {
        const mlMat = new MLMatrix(matA.valueOf() as number[][]);
        const svd = new SingularValueDecomposition(mlMat);
        const U = svd.leftSingularVectors;
        const S = svd.diagonalMatrix;
        const V = svd.rightSingularVectors;
        res = { U, S, V };
        steps.push({ 
          description: "Descomposición SVD (A = UΣVᵀ)", 
          formula: "A = U · Σ · Vᵀ",
          result: `U:\n${formatMatrix(U.to2DArray())}\n\nΣ (valores singulares):\n${formatMatrix(S.to2DArray())}\n\nV:\n${formatMatrix(V.to2DArray())}`
        });
      } else if (op === 'cholesky') {
        const mlMat = new MLMatrix(matA.valueOf() as number[][]);
        const cholesky = new CholeskyDecomposition(mlMat);
        const L = cholesky.lowerTriangularMatrix;
        res = L;
        steps.push({ 
          description: "Descomposición Cholesky (A = LLᵀ)", 
          formula: "A = L · Lᵀ",
          result: `L:\n${formatMatrix(L.to2DArray())}`
        });
      }
      setResult(res);
      setWorksheetData({ title: `Operación: ${op.toUpperCase()}`, steps });
      setActiveSheet('WORKSHEET');
    } catch (e: any) {
      setResult('Error');
      setWorksheetData({ 
        title: "Error en Operación", 
        steps: [{ description: "Error", formula: e.message || "Operación inválida" }] 
      });
      setActiveSheet('WORKSHEET');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-end items-end">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
            <button 
              onClick={() => setActiveSheet('EDITOR')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'EDITOR' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              aria-label="Switch to Matrix Editor"
            >
              Editor
            </button>
            <button 
              onClick={() => setActiveSheet('WORKSHEET')}
              disabled={!worksheetData}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSheet === 'WORKSHEET' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30'}`}
              aria-label="Switch to Matrix Worksheet"
            >
              Worksheet
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSheet === 'EDITOR' ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0"
          >
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Select Matrix</span>
                </div>
                <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                  <button 
                    onClick={() => {
                      setActiveMatrix('A');
                      setActiveCell({r: 0, c: 0});
                    }}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMatrix === 'A' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    aria-label={`Select Matrix A, current dimensions: ${rowsA} by ${colsA}`}
                  >
                    Matrix A ({rowsA}x{colsA})
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMatrix('B');
                      setActiveCell({r: 0, c: 0});
                    }}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMatrix === 'B' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                    aria-label={`Select Matrix B, current dimensions: ${rowsB} by ${colsB}`}
                  >
                    Matrix B ({rowsB}x{colsB})
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Matrix Dimensions</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Rows:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="6" 
                      value={activeMatrix === 'A' ? rowsA : rowsB} 
                      onChange={(e) => {
                        const r = parseInt(e.target.value);
                        if (activeMatrix === 'A') {
                          setRowsA(r);
                          setMatrixA(Array(r).fill(0).map(() => Array(colsA).fill('0')));
                        } else {
                          setRowsB(r);
                          setMatrixB(Array(r).fill(0).map(() => Array(colsB).fill('0')));
                        }
                        setActiveCell({r: 0, c: 0});
                      }}
                      className="w-16 bg-surface-container-low border border-outline-variant/15 p-2 rounded-lg text-center font-mono focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Cols:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="6" 
                      value={activeMatrix === 'A' ? colsA : colsB} 
                      onChange={(e) => {
                        const c = parseInt(e.target.value);
                        if (activeMatrix === 'A') {
                          setColsA(c);
                          setMatrixA(Array(rowsA).fill(0).map(() => Array(c).fill('0')));
                        } else {
                          setColsB(c);
                          setMatrixB(Array(rowsB).fill(0).map(() => Array(c).fill('0')));
                        }
                        setActiveCell({r: 0, c: 0});
                      }}
                      className="w-16 bg-surface-container-low border border-outline-variant/15 p-2 rounded-lg text-center font-mono focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Operations</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'inv', name: 'Inverse (A)' },
                    { id: 'det', name: 'Determinant (A)' },
                    { id: 'invB', name: 'Inverse (B)' },
                    { id: 'detB', name: 'Determinant (B)' },
                    { id: 'trans', name: 'Transpose (A)' },
                    { id: 'transB', name: 'Transpose (B)' },
                    { id: 'trace', name: 'Trace (A)' },
                    { id: 'add', name: 'A + B' },
                    { id: 'sub', name: 'A - B' },
                    { id: 'mul', name: 'A × B' },
                    { id: 'lu_simple', name: 'LU (A=LU)' },
                    { id: 'lu', name: 'LUP (PA=LU)' },
                    { id: 'qr', name: 'QR (A)' },
                    { id: 'svd', name: 'SVD (A)' },
                    { id: 'cholesky', name: 'Cholesky (A)' },
                  ].map(op => (
                    <button
                      key={op.id}
                      onClick={() => calculate(op.id)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high hover:border-primary/40 transition-all group"
                      aria-label={`Perform operation: ${op.name}`}
                    >
                      <span className="text-xs font-bold tracking-wide">{op.name}</span>
                      <CornerDownRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-8">
              <section className="bg-surface-container-high border border-outline-variant/15 rounded-3xl p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex justify-center overflow-x-auto p-4 scrollbar-hide">
                  <div 
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${activeMatrix === 'A' ? colsA : colsB}, minmax(60px, 1fr))` }}
                  >
                    {(activeMatrix === 'A' ? matrixA : matrixB).map((row, r) => row.map((val, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => setActiveCell({r, c})}
                        className={`h-12 lg:h-16 rounded-xl border transition-all flex items-center justify-center font-mono text-sm lg:text-base ${
                          activeCell.r === r && activeCell.c === c ? 'bg-primary/10 border-primary text-primary scale-105 shadow-lg' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        aria-label={`Matrix ${activeMatrix} cell at row ${r + 1}, column ${c + 1}. Current value: ${val}`}
                      >
                        {val}
                      </button>
                    )))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {['7', '8', '9', 'DEL'].map((k, i) => (
                    <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={k === 'DEL' ? 'Delete last character' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  {['4', '5', '6', 'AC'].map((k, i) => (
                    <TactileButton key={k} variant={i === 3 ? 'error' : 'default'} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={k === 'AC' ? 'Clear cell' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  {['1', '2', '3', '-'].map((k) => (
                    <TactileButton key={k} className="h-12 text-lg" onClick={() => handleKeyPress(k)} ariaLabel={k === '-' ? 'Negative sign' : `Number ${k}`}>{k}</TactileButton>
                  ))}
                  <TactileButton className="h-12 text-lg" onClick={() => handleKeyPress('0')} ariaLabel="Number 0">0</TactileButton>
                  <TactileButton className="h-12 text-lg" onClick={() => handleKeyPress('.')} ariaLabel="Decimal point">.</TactileButton>
                  <TactileButton 
                    variant="ghost" 
                    className="col-span-2 h-12 text-[10px] font-bold tracking-widest uppercase" 
                    onClick={() => {
                      if (activeMatrix === 'A') {
                        setMatrixA(Array(rowsA).fill(0).map(() => Array(colsA).fill('0')));
                      } else {
                        setMatrixB(Array(rowsB).fill(0).map(() => Array(colsB).fill('0')));
                      }
                    }}
                    ariaLabel={`Reset all cells in Matrix ${activeMatrix} to zero`}
                  >
                    Reset Matrix {activeMatrix}
                  </TactileButton>
                </div>
              </section>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="worksheet"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-headline font-bold text-lg text-primary uppercase tracking-widest">{worksheetData?.title}</h3>
                <button 
                  onClick={() => {
                    if (worksheetData) {
                      const content = worksheetData.steps.flatMap((s: any) => [
                        s.description,
                        s.formula,
                        s.result ? `Result:\n${s.result}` : '',
                        '-------------------'
                      ]);
                      exportToPDF({
                        title: worksheetData.title,
                        subtitle: `Generated by TRESDTRES LAB - ${new Date().toLocaleString()}`,
                        content,
                        filename: `matrices_${worksheetData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`
                      });
                    }
                  }}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                  title="Export to PDF"
                  aria-label="Export worksheet to PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => setActiveSheet('EDITOR')}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                aria-label="Close worksheet and return to editor"
              >
                <X className="w-4 h-4" /> Cerrar
              </button>
            </div>

            <div className="space-y-4">
              {worksheetData?.steps.map((step: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-2xl space-y-4"
                >
                  <p className="text-sm font-bold text-on-surface">{step.description}</p>
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 font-mono text-primary text-sm overflow-x-auto flex justify-center">
                    <Latex formula={step.formula} displayMode={true} className="text-primary" />
                  </div>
                  {step.result && (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 font-mono text-primary text-sm overflow-x-auto flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">Result:</span>
                      <Latex formula={step.result} displayMode={true} className="text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
