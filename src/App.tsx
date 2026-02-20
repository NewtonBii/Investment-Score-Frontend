import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
export type Page = 'login' | 'register' | 'upload' | 'processing' | 'dashboard';
function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };
  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>);

  }
  // If not authenticated, only allow login/register
  const effectivePage = isAuthenticated ?
  currentPage :
  currentPage === 'register' ?
  'register' :
  'login';
  return (
    <div className="min-h-screen bg-background text-gray-300 selection:bg-primary/30 selection:text-white">
      {effectivePage === 'dashboard' && <Navbar onLogout={handleLogout} />}

      {effectivePage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {effectivePage === 'register' &&
      <RegisterPage onNavigate={handleNavigate} />
      }
      {effectivePage === 'upload' && <UploadPage onNavigate={handleNavigate} />}
      {effectivePage === 'processing' &&
      <ProcessingPage onNavigate={handleNavigate} />
      }
      {effectivePage === 'dashboard' &&
      <Dashboard onNavigate={handleNavigate} />
      }
    </div>);

}
export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>);

}