"use client";

import React, { useState, useEffect } from "react";
import { FileText, Search, Database, CheckCircle2, Loader2 } from "lucide-react";

export const ScanningLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 🧠 Logic: Fake a sequence of complex tasks to keep the user engaged
    // while the Python backend does the heavy lifting in the background.
    const t1 = setTimeout(() => setCurrentStep(1), 1500);
    const t2 = setTimeout(() => setCurrentStep(2), 3000);
    const t3 = setTimeout(() => setCurrentStep(3), 4500);
    
    // Call the parent function to say "We are done animating!"
    const t4 = setTimeout(() => {
      setCurrentStep(4);
      onComplete(); 
    }, 5500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  const steps = [
    { id: 0, label: "Scanning receipt structure...", icon: FileText },
    { id: 1, label: "Extracting items with Gemini AI...", icon: Search },
    { id: 2, label: "Cross-referencing MOH prices...", icon: Database },
    { id: 3, label: "Finalizing audit report...", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center transition-all">
      
      {/* Top Scanner Animation */}
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-teal-50 rounded-full">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        {/* Outer rotating ring for a tech feel */}
        <div className="absolute inset-0 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin duration-1000"></div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">
        Analyzing Your Bill
      </h2>

      {/* Steps List */}
      <div className="space-y-5 text-left">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500
                ${isCompleted ? 'bg-emerald-100 text-emerald-600 scale-100' : ''}
                ${isActive ? 'bg-teal-100 text-teal-600 ring-4 ring-teal-50 animate-pulse scale-110' : ''}
                ${!isActive && !isCompleted ? 'bg-slate-50 text-slate-300 scale-95' : ''}
              `}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`
                text-sm font-medium transition-colors duration-500
                ${isCompleted ? 'text-slate-600' : ''}
                ${isActive ? 'text-teal-700 animate-pulse' : ''}
                ${!isActive && !isCompleted ? 'text-slate-400' : ''}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};