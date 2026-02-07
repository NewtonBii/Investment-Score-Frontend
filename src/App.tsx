import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
type Page = 'login' | 'register' | 'upload' | 'processing' | 'dashboard';
export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };
  const handleLogout = () => {
    setCurrentPage('login');
  };
  return (
    <div className="min-h-screen bg-background text-gray-300 selection:bg-primary/30 selection:text-white">
      {currentPage === 'dashboard' && <Navbar onLogout={handleLogout} />}

      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'register' &&
      <RegisterPage onNavigate={handleNavigate} />
      }
      {currentPage === 'upload' && <UploadPage onNavigate={handleNavigate} />}
      {currentPage === 'processing' &&
      <ProcessingPage onNavigate={handleNavigate} />
      }
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
    </div>);

}