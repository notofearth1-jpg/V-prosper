import React, { ReactNode, ErrorInfo } from "react";
import { logApplicationError } from "./ErrorBoundaryController";

interface IErrorBoundaryProps {
  children: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to trigger fallback UI rendering
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorObject = {
      error: error,
      errorInfo: errorInfo,
    };
    // this console is for see error
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    logApplicationError(errorObject);
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
