import React, { useState, useEffect } from 'react';
import { Shield, Lock, Server } from 'lucide-react';

export default function LoadingPage() {
  const [loadingStep, setLoadingStep] = useState(0);

  // Enterprise-style loading steps to simulate deep system checks
  const steps = [
    { text: "Validating credentials...", icon: <Lock className="w-4 h-4 text-slate-400" /> },
    { text: "Verifying role permissions...", icon: <Shield className="w-4 h-4 text-slate-400" /> },
    { text: "Establishing secure session...", icon: <Server className="w-4 h-4 text-slate-400" /> },
    { text: "Loading unified dashboard...", icon: <Server className="w-4 h-4 text-slate-400" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200); // Change text every 1.2 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  // We inject a small style tag to handle the custom infinite sliding animation 
  // without needing to touch tailwind.config.js for this specific UI element.
  const customStyles = `
    @keyframes indeterminate-slide {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(30%); }
      100% { transform: translateX(200%); }
    }
    .animate-progress-slide {
      animation: indeterminate-slide 1.5s infinite ease-in-out;
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-100">
      <style>{customStyles}</style>

      {/* Main Content Container with a subtle fade-in */}
      <div className="flex flex-col items-center animate-in fade-in duration-700">
        
        <div className="relative mb-8">
          {/* Subtle glowing backdrop for the logo to give it depth */}
          <div className="absolute inset-0 bg-blue-100 blur-xl rounded-full opacity-50 animate-pulse"></div>
          
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            <rect x="8" y="8" width="14" height="32" rx="2" fill="#2563EB" /> {/* blue-600 */}
            <rect x="26" y="8" width="14" height="14" rx="2" fill="#1E3A5F" /> {/* deep blue accent */}
            <rect x="26" y="26" width="14" height="14" rx="2" fill="#94A3B8" /> {/* slate-400 */}
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Supermax
        </h2>
        
        <div className="flex items-center space-x-2 h-6 mt-1 transition-all duration-300">
          {steps[loadingStep].icon}
          <p className="text-sm font-medium text-slate-500 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {steps[loadingStep].text}
          </p>
        </div>

        <div className="w-64 sm:w-80 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-8 shadow-inner">
          <div className="h-full w-1/2 bg-blue-600 rounded-full animate-progress-slide relative">
            {/* Glossy overlay on the progress bar for a premium feel */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          </div>
        </div>

        <div className="absolute bottom-8 text-center w-full">
          <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            End-to-end encrypted connection
          </p>
        </div>

      </div>
    </div>
  );
}