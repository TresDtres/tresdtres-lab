import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-surface-container-high p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-headline font-black mb-2 uppercase tracking-tight">Kernel Panic</h1>
            <p className="text-on-surface-variant/60 text-sm mb-8">
              Se ha detectado un error crítico en la ejecución. El sistema ha sido detenido para proteger la integridad de los datos.
            </p>
            
            <div className="bg-black/20 p-4 rounded-xl mb-8 text-left overflow-x-auto">
              <code className="text-[10px] font-mono text-error/80 block whitespace-pre">
                {this.state.error?.message || 'Unknown execution error'}
              </code>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-headline font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
