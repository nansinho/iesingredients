import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally no console logging (avoid noisy consoles in production/preview).
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md text-center">
              <h1 className="font-serif text-2xl text-foreground">Une erreur est survenue</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Rechargez la page. Si le problème persiste, contactez-nous.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
