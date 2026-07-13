"use client";

import * as React from "react";
import { Button } from "../button";
import { AlertCircle } from "lucide-react";

interface Props { children: React.ReactNode; fallback?: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
          <p className="mt-2 text-sm text-stone-500">{this.state.error?.message}</p>
          <Button className="mt-4" variant="outline" onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
