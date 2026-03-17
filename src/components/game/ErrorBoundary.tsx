"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
}

export default class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: `${error.name}: ${error.message}` };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Bureau Rush crash:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-dark vignette p-4 text-center">
          <div className="text-4xl mb-4">💥</div>
          <h1 className="text-xl text-neon-pink text-glow-pink mb-4">CRASH DU SYSTÈME</h1>
          <p className="text-[9px] text-gray-400 mb-2">Le ministère a encore frappé...</p>
          <p className="text-[8px] text-red-400 mb-6 max-w-sm break-all font-mono">
            {this.state.error}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: "" });
              window.location.reload();
            }}
            className="btn-arcade bg-neon-green text-dark border-neon-green hover:bg-neon-yellow text-xs"
          >
            REDÉMARRER
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
