
import React, { useEffect } from 'react';
import { TrophyIcon } from './common/Icons';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2500); // Splash screen duration in milliseconds

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary animate-fadeIn">
      <div className="text-center animate-pulseAndScale">
        <TrophyIcon className="w-32 h-32 text-brand-accent mx-auto" />
        <h1 className="text-4xl font-bold text-white mt-4">Jember Marching Festival</h1>
        <h2 className="text-2xl font-semibold text-brand-accent">ke 9 tahun 2026</h2>
      </div>
      {/* Simple inline styles for animations to keep it self-contained */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out; }
        
        @keyframes pulseAndScale {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }
        .animate-pulseAndScale { animation: pulseAndScale 2.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
