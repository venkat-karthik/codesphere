import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="glass-card p-12 rounded-[3rem] border-destructive/20 shadow-2xl shadow-destructive/5 max-w-md w-full space-y-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Component Error</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We encountered an issue rendering this section of the platform. Our monitoring system (Sentry) has been notified.
              </p>
              {this.state.error && (
                <pre className="mt-4 p-3 bg-destructive/5 border border-destructive/10 rounded-xl text-[10px] text-destructive font-mono text-left overflow-x-auto max-h-32 scrollbar-thin">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={this.reset} 
                className="w-full h-12 rounded-2xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recover Component
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.location.reload()} 
                className="w-full h-12 rounded-2xl font-medium text-muted-foreground hover:bg-destructive/5"
              >
                Hard Refresh App
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
