import React, { Component, ErrorInfo, ReactNode } from 'react';
import { auth } from '../firebase';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
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

  private handleReset = async () => {
    try {
        await auth.signOut();
        localStorage.clear();
        window.location.href = '/';
    } catch (e) {
        console.error(e);
        window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nomad-black flex items-center justify-center p-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-nomad-black mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-2 text-sm">The application encountered an unexpected error.</p>
            <p className="text-red-500 bg-red-50 p-3 rounded-lg text-xs font-mono mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
                {this.state.error?.message}
            </p>
            
            <div className="flex gap-4 justify-center">
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-bold uppercase text-xs rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Reload Page
                </button>
                <button 
                    onClick={this.handleReset}
                    className="px-6 py-3 bg-nomad-black text-white font-bold uppercase text-xs rounded-xl hover:bg-nomad-gold transition-colors"
                >
                    Logout & Reset
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;