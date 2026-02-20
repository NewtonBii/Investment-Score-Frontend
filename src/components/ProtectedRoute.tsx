import React from 'react';
import { useAuth } from '../context/AuthContext';
// This component is kept for compatibility but the auth gating
// is handled directly in App.tsx via the page-state pattern.
interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>);

  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}