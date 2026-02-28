import React from 'react';
import { Upload, FileText, Camera, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroUpload = ({ onFileUpload }: { onFileUpload: (file: File) => void }) => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-[oklch(0.98_0.002_75)]">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Ambient Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-white border border-slate-100 rounded-full shadow-premium animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
            <ShieldCheck className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            100% Private & Government-Verified
          </span>
        </div>

        <h1 className="max-w-4xl mx-auto mb-6 text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05]">
          Stop overpaying for your <span className="text-teal-600">prescription.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium text-slate-400 leading-relaxed">
          Upload your hospital bill to instantly detect markups and find pharmacies offering fair government prices nearby.
        </p>

        {/* THE SURFACED UPLOAD CARD */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative bg-white rounded-[40px] p-2 shadow-premium hover:shadow-premium-hover transition-all duration-500 ease-out">
            <div className="relative rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 transition-all group-hover:bg-white group-hover:border-teal-500/20">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
              />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-premium mb-6 group-hover:scale-110 transition-transform duration-500">
                  <FileText className="h-10 w-10 text-teal-600" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  Drop your bill here
                </h3>
                <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">
                  PDF, JPG, or PNG up to 10MB
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="h-12 px-8 rounded-full bg-slate-900 text-white font-black text-[13px] shadow-premium hover:bg-slate-800 transition-all">
                    <Upload className="mr-2 h-4 w-4" strokeWidth={2.5} />
                    Browse Files
                  </Button>
                  <Button variant="outline" className="h-12 px-8 rounded-full border-slate-200 text-slate-600 font-black text-[13px] hover:bg-white hover:shadow-premium transition-all">
                    <Camera className="mr-2 h-4 w-4" strokeWidth={2.5} />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Mini-Stats */}
          <div className="mt-8 flex items-center justify-center gap-8">
             <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors">
               Try with sample bill <ArrowRight className="h-3 w-3" />
             </button>
             <div className="w-px h-4 bg-slate-200" />
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
               No sign-up required
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};