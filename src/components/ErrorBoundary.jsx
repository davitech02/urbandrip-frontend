import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '', errorStack: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error);
        console.error('Error Info:', errorInfo);
        this.setState({
            errorMessage: error.toString(),
            errorStack: errorInfo.componentStack
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">We encountered an error. Please go back and try again.</p>
                        
                        {/* Show error details in development */}
                        {import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-left">
                                <p className="text-xs font-mono text-red-700 break-all">{this.state.errorMessage}</p>
                                {this.state.errorStack && (
                                    <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">{this.state.errorStack}</pre>
                                )}
                            </div>
                        )}
                        
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
