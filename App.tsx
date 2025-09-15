
import React, { useState } from 'react';
import { User, Role } from './types';
import { LoginScreen } from './components/LoginScreen';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { JudgeDashboard } from './components/JudgeDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LogoutIcon, TrophyIcon } from './components/common/Icons';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';

type AppState = 'splash' | 'landing' | 'login' | 'dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('landing');
  };

  const renderDashboard = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case Role.Participant:
        return <ParticipantDashboard user={currentUser} />;
      case Role.Judge:
        return <JudgeDashboard user={currentUser} />;
      case Role.Admin:
        return <AdminDashboard user={currentUser} />;
      default:
        // Fallback in case of an unknown role
        handleLogout();
        return null;
    }
  };

  if (appState === 'splash') {
    return <SplashScreen onFinished={() => setAppState('landing')} />;
  }

  if (appState === 'landing') {
    return <LandingPage onNavigateToLogin={() => setAppState('login')} />;
  }

  if (appState === 'login') {
    return <LoginScreen onLogin={handleLogin} onBack={() => setAppState('landing')} />;
  }

  if (appState === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-brand-light font-sans text-gray-800">
        <nav className="bg-brand-primary shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-brand-accent"/>
                <span className="ml-3 text-white font-semibold text-xl">JMF 2026</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300 hidden sm:block">
                  Login sebagai <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-full text-gray-300 hover:bg-brand-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-white"
                  title="Logout"
                >
                  <LogoutIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          {renderDashboard()}
        </main>
      </div>
    );
  }

  // Fallback to landing if state is inconsistent
  return <LandingPage onNavigateToLogin={() => setAppState('login')} />;
};

export default App;
