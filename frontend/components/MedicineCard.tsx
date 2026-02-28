import React from 'react';
import { AlertCircle, CheckCircle2, TrendingDown, MapPin, Lock, CheckSquare, Square } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  hospitalPrice: number;
  governmentPrice: number;
  category?: string;
  isControlled?: boolean;
}

interface MedicineCardProps {
  medicine: Medicine;
  onFindPharmacies: (id: string) => void;
  isSelectedForLetter?: boolean;
  onToggleLetterSelection?: (id: string) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine, 
  onFindPharmacies, 
  isSelectedForLetter,
  onToggleLetterSelection 
}) => {
  // 🧠 Logic: Calculate the markup and threshold
  const overchargeAmount = medicine.hospitalPrice - medicine.governmentPrice;
  const markupPercentage = Math.round((overchargeAmount / medicine.governmentPrice) * 100);
  
  // 🔥 Your custom threshold: Only turn red if markup is 15% or higher
  const MARKUP_THRESHOLD = 10;
  const isOvercharged = markupPercentage >= MARKUP_THRESHOLD;

  return (
    <div 
      className={`group relative w-full h-full flex flex-col rounded-[20px] p-6 transition-all duration-500 ease-out hover:-translate-y-1 ${
        isOvercharged 
          ? 'bg-[#fef8f7] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(220,50,40,0.06),0_16px_40px_rgba(220,50,40,0.04)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(220,50,40,0.08),0_24px_56px_rgba(220,50,40,0.06)]' 
          : 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03),0_16px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.05),0_24px_56px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* STATUS INDICATOR — thin ambient top bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] rounded-full ${
        isOvercharged ? 'bg-[#e8453c]/40' : 'bg-[#22c55e]/30'
      }`} />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-[-0.01em] capitalize leading-snug">
            {medicine.name}
          </h3>
          {medicine.isControlled && (
            <span className="w-fit inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold text-[#3b6bce] bg-[#3b6bce]/[0.07] uppercase tracking-[0.08em]">
              <Lock size={10} strokeWidth={2.5} />
              Controlled
            </span>
          )}
        </div>
        
        {isOvercharged ? (
          <span className="inline-flex items-center whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#e8453c]/[0.08] text-[#c0392b] tracking-[-0.01em]">
            <AlertCircle size={13} strokeWidth={2.5} />
            +{markupPercentage}%
          </span>
        ) : (
          <span className="inline-flex items-center whitespace-nowrap gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#22c55e]/[0.08] text-[#16a34a] tracking-[-0.01em]">
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Fair
          </span>
        )}
      </div>

      {/* BODY: Price Comparison — dramatic number hierarchy */}
      <div className="flex gap-6 mb-6">
        {/* Billed Price */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em]">Billed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] font-medium text-slate-400">RM</span>
            <span className={`text-[28px] font-bold tracking-[-0.03em] leading-none ${
              isOvercharged 
                ? 'text-slate-900/40 line-through decoration-[#e8453c]/50 decoration-[1.5px]' 
                : 'text-slate-900'
            }`}>
              {medicine.hospitalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="flex items-center">
          <div className={`w-px h-10 ${isOvercharged ? 'bg-[#e8453c]/10' : 'bg-slate-100'}`} />
        </div>

        {/* Fair Price */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em]">Fair Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] font-medium text-slate-400">RM</span>
            <span className={`text-[28px] font-bold tracking-[-0.03em] leading-none ${
              isOvercharged ? 'text-[#e8453c]' : 'text-slate-900'
            }`}>
              {medicine.governmentPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER: Insights & Action */}
      <div className="flex items-center justify-between mt-auto pt-4 gap-3">
        <div className="flex flex-col">
          {isOvercharged ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e8453c]/[0.07]">
                <TrendingDown size={14} strokeWidth={2.5} className="text-[#e8453c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.06em]">Potential savings</span>
                <span className="text-[15px] font-bold text-[#e8453c] tracking-[-0.02em] leading-tight">
                  RM {overchargeAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[13px] font-medium text-slate-400">Good deal!</span>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          
          {/* Checkbox for Letter Selection */}
          {medicine.isControlled && onToggleLetterSelection && (
            <button
              onClick={() => onToggleLetterSelection(medicine.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
                isSelectedForLetter 
                  ? 'bg-[#3b6bce]/[0.08] text-[#3b6bce] focus:ring-[#3b6bce]/30' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-300'
              }`}
            >
              {isSelectedForLetter ? (
                <CheckSquare size={14} className="text-[#3b6bce]" />
              ) : (
                <Square size={14} className="text-slate-400" />
              )}
              <span className="hidden sm:inline">
                {isSelectedForLetter ? 'Selected' : 'Select'}
              </span>
            </button>
          )}

          {/* Find Nearby Button */}
          {medicine.category !== "Service" && (
            <button
              onClick={() => onFindPharmacies(medicine.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-[12px] font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/30 focus:ring-offset-2 whitespace-nowrap"
            >
              <MapPin size={14} />
              Nearby
            </button>
          )}
        </div>
      </div>
    </div>
  );
};