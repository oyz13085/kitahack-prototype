"use client";

import { Receipt, TrendingDown, AlertTriangle, Pill, Building2, Hash } from "lucide-react";

interface BillSummaryProps {
  analysis: any;
}

export function BillSummary({ analysis }: BillSummaryProps) {
  const overchargePercent = Math.round(
    ((analysis.totalBilled - analysis.totalGovernmentPrice) / analysis.totalGovernmentPrice) * 100
  );

  const stats = [
    { label: "Hospital Total", value: analysis.totalBilled, color: "text-slate-900", bar: "bg-slate-200", icon: Receipt, unit: "RM" },
    { label: "Government Price", value: analysis.totalGovernmentPrice, color: "text-teal-600", bar: "bg-teal-500/30", icon: TrendingDown, unit: "RM" },
    { label: "Overcharged", value: analysis.totalOvercharge, color: "text-[#e8453c]", bar: "bg-[#e8453c]/40", icon: AlertTriangle, sub: `+${overchargePercent}% above fair price`, unit: "RM" },
    // 🔥 Removed 'unit' from here so the logic knows this is a count, not a price
    { label: "Flagged Items", value: analysis.flaggedCount, total: analysis.totalItems, color: "text-slate-900", bar: "bg-amber-400/40", icon: Pill },
  ];

  return (
    <div className="mb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2 gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bill Analysis Report</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{analysis.hospitalName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-slate-400" />
              <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest">{analysis.billNumber}</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-full">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified: Today</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="group relative bg-white rounded-[24px] p-6 shadow-premium hover:shadow-premium-hover transition-all duration-500">
            <div className={`absolute top-0 left-8 right-8 h-[2px] rounded-full ${stat.bar}`} />
            
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.12em]">{stat.label}</p>
              <stat.icon size={14} className="text-slate-300" />
            </div>

            <div className="flex items-baseline gap-1.5">
              {/* 🔥 FIX 1: Only show RM if the stat has a unit */}
              {stat.unit === "RM" && (
                <span className="font-mono text-xs font-bold text-slate-400">RM</span>
              )}
              
              <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>
                {/* 🔥 FIX 2: Format as currency ONLY if unit is RM */}
                {stat.unit === "RM" 
                  ? stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 }) 
                  : stat.value
                }
              </span>

              {/* 🔥 FIX 3: Show "/ total" specifically for the Flagged Items box */}
              {stat.total && (
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  / {stat.total}
                </span>
              )}
            </div>
            {stat.sub && (
              <p className="mt-2 text-[11px] font-bold text-[#e8453c] tracking-tight">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}