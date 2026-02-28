"use client";

import React from "react";
import { ArrowLeft, MapPin, Navigation, Phone, Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  vicinity?: string;
  rating?: number;
  distance?: number;
  isOpen?: boolean;
}

interface PharmacyPanelProps {
  medicine: any;
  pharmacies: Pharmacy[];
  onBack: () => void;
}

export const PharmacyPanel: React.FC<PharmacyPanelProps> = ({ medicine, pharmacies, onBack }) => {
  const sortedPharmacies = [...pharmacies].sort((a, b) => 
    (parseFloat(String(a.distance)) || 0) - (parseFloat(String(b.distance)) || 0)
  );

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. THEMED HEADER NAVIGATION */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-3 transition-all duration-300 mb-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-premium group-hover:bg-slate-50 group-hover:shadow-premium-hover transition-all duration-300">
            <ArrowLeft className="h-4 w-4 text-slate-600" strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-[0.15em]">
            Back to Audit Report
          </span>
        </button>

        {/* Selected Medicine Hero Card */}
        <div className="relative bg-white rounded-[32px] p-8 shadow-premium overflow-hidden border border-slate-100/50">
          {/* Ambient Accent Bar - Matches Medicine Cards */}
          <div className="absolute top-0 left-12 right-12 h-[3px] rounded-full bg-teal-500/20" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Finding alternatives for</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize leading-none">
                {medicine.name}
              </h2>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                   <ShieldCheck size={14} strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-semibold text-slate-500">
                  Target Fair Price: <strong className="text-slate-900 font-black ml-1">RM {medicine.governmentPrice.toFixed(2)}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Billed</p>
              <div className="flex items-baseline gap-1.5 text-[#e8453c] opacity-40">
                <span className="text-[11px] font-bold">RM</span>
                <span className="text-3xl font-black line-through tracking-tighter decoration-[2px]">
                  {medicine.hospitalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION TITLE */}
      <div className="flex flex-col gap-1 mb-8 px-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nearby Pharmacies</h3>
        <p className="text-sm font-medium text-slate-400">Showing {pharmacies.length} verified locations within your area.</p>
      </div>

      {/* 3. PHARMACY CARDS GRID */}
      {pharmacies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] shadow-premium">
          <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
          <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No results found</h4>
          <p className="text-slate-400 font-medium mt-1">Try expanding your search radius.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPharmacies.map((pharmacy, index) => {
            const isClosest = index === 0 && pharmacy.distance;
            
            return (
              <div 
                key={pharmacy.id || index} 
                className="group relative flex flex-col bg-white rounded-[28px] p-7 shadow-premium hover:shadow-premium-hover transition-all duration-500 ease-out border-t-[3px] border-t-transparent hover:border-t-teal-500/30"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors">
                      {pharmacy.name}
                    </h4>
                    {isClosest && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-widest">
                        Closest To You
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="flex items-start gap-2.5 text-[14px] font-medium text-slate-500 leading-relaxed min-h-[44px]">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    {pharmacy.address || pharmacy.vicinity || "Address not available"}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {pharmacy.distance && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-full border border-slate-100 shadow-sm">
                        <Navigation className="w-3.5 h-3.5 text-teal-500" />
                        {parseFloat(String(pharmacy.distance)).toFixed(1)} km away
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-full border shadow-sm ${
                      pharmacy.isOpen 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {pharmacy.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Unified Footer Actions */}
                <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-50">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.name + ' ' + (pharmacy.vicinity || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-full text-[13px] font-bold shadow-premium transition-all active:scale-[0.97]"
                  >
                    <Navigation className="w-4 h-4" strokeWidth={2.5} />
                    Get Directions
                  </a>
                  <button className="inline-flex items-center justify-center w-12 h-12 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-full shadow-premium transition-all active:scale-[0.97]">
                    <Phone className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};