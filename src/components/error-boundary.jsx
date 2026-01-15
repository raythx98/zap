import React from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-500 font-medium text-lg max-w-[500px]">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Try refreshing the page or head back to the dashboard.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              onClick={() => window.location.reload()}
              className="font-bold flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Page</span>
            </Button>
            <Button 
              onClick={() => window.location.href = import.meta.env.BASE_URL}
              className="font-bold"
            >
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
