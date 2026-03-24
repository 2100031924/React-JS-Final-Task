import { Component } from 'react';
import Icon from './Icon';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    if (import.meta.env.PROD) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <Icon name="alert" />
            </div>
            <h2>Something went wrong</h2>
            <p>We encountered an unexpected error. Please try again.</p>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo?.componentStack && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <div className="error-boundary-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleRetry}
                aria-label="Retry loading"
              >
                <Icon name="arrowRight" />
                Try Again
              </button>
              <button
                className="btn btn-outline"
                onClick={() => window.location.href = '/'}
                aria-label="Go to home page"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
