"use client";

import { analytics, logEvent } from "@/lib/firebase";
import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroUpload } from "@/components/hero-upload";
import { HowItWorks } from "@/components/how-it-works";
import { ScanningLoader } from "@/components/scanning-loader";
import { BillSummary } from "@/components/bill-summary";
import { MedicineCard } from "@/components/MedicineCard";
import { PharmacyPanel } from "@/components/pharmacy-panel";
import { Footer } from "@/components/footer";
import { mockPharmacies } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2, FileText } from "lucide-react";
import { findNearbyPharmacies } from "@/lib/google-maps";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type AppView = "landing" | "scanning" | "results" | "pharmacies";

const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
          else resolve(file);
        }, "image/jpeg", 0.7);
      };
    };
  });
};

export default function Page() {
  const [view, setView] = useState<AppView>("landing");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [pharmaciesList, setPharmaciesList] = useState<any[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // 🔥 NEW: Track which medicines are selected for the letter
  const [selectedLetterIds, setSelectedLetterIds] = useState<Set<string>>(new Set());

  // Auto-select all controlled medicines by default when results load
  useEffect(() => {
    if (analysisResult && analysisResult.medicines) {
      const initialControlled = new Set<string>(
        analysisResult.medicines.filter((m: any) => m.isControlled).map((m: any) => m.id)
      );
      setSelectedLetterIds(initialControlled);
    }
  }, [analysisResult]);

  // Handle checking/unchecking a medicine for the letter
  const toggleLetterSelection = useCallback((id: string) => {
    setSelectedLetterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (analysisResult && isAnimationComplete) {
      setView("results");
    }
  }, [analysisResult, isAnimationComplete]);

  // 🔥 UPDATED PDF LOGIC: Creates ONE unified letter
  const handleExportPDF = () => {
    if (!analysisResult) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Cover Page --
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 166);
    doc.text("MedScan Audit Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Ref ID: ${analysisResult.billNumber}`, 14, 33);

    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 40, pageWidth - 28, 35, "FD");

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Hospital: ${analysisResult.hospitalName}`, 20, 52);

    doc.setFontSize(11);
    doc.text(`Total Bill: RM ${analysisResult.totalBilled.toFixed(2)}`, 20, 62);
    doc.text(`Fair Price (MOH): RM ${analysisResult.totalGovernmentPrice.toFixed(2)}`, 100, 62);

    doc.setTextColor(220, 53, 69);
    doc.setFont("helvetica", "bold");
    doc.text(`Potential Overcharge: RM ${analysisResult.totalOvercharge.toFixed(2)}`, 20, 70);

    const tableData = analysisResult.medicines.map((m: any) => [
      m.name,
      `${m.quantity} ${m.unit}`,
      `RM ${m.hospitalPrice.toFixed(2)}`,
      `RM ${m.governmentPrice.toFixed(2)}`,
      `${m.overpricePercentage}%`,
      m.isControlled ? "CONTROLLED" : (m.category === "Service" ? "Service" : "OTC")
    ]);

    autoTable(doc, {
      startY: 85,
      head: [['Medicine', 'Qty', 'Charged', 'Fair Price', 'Markup', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 116, 166] },
      styles: { fontSize: 10 },
      columnStyles: { 4: { textColor: [220, 53, 69], fontStyle: 'bold' } }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("Prices based on Ministry of Health (MOH) Consumer Price Guide. Controlled status based on Poisons Act 1952.", 14, finalY);

    // -- Unified Letter Appendix --
    const selectedMedsForLetter = analysisResult.medicines.filter((m: any) => selectedLetterIds.has(m.id));

    if (selectedMedsForLetter.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("APPENDIX: PRESCRIPTION REQUEST LETTER", 14, 20);
      doc.setFontSize(10);
      doc.text("The following is a legally cited request for prescription release.", 14, 28);

      let currentY = 40;
      doc.setDrawColor(0); doc.setLineWidth(0.5); doc.line(14, currentY, pageWidth - 14, currentY); currentY += 10;
      doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`REQUEST FOR PRESCRIPTION RELEASE`, 14, currentY); currentY += 10;
      doc.setFontSize(10); doc.setFont("helvetica", "normal");

      // Build a bulleted list of all selected medicines
      const medList = selectedMedsForLetter.map((m: any) => `• ${m.name} (${m.quantity} ${m.unit})`).join("\n");

      const letterBody = `To: The Medical Records / Pharmacy Department, ${analysisResult.hospitalName}\n\nSUBJECT: REQUEST FOR PRESCRIPTION RELEASE - PATIENT RIGHT TO CHOOSE\n\nDear Sir/Madam,\n\nI am writing regarding my treatment where I was prescribed the following medications:\n\n${medList}\n\nI have verified that the fair retail price for these medications is significantly lower than billed. Pursuant to the Malaysian Medical Council (MMC) Code of Professional Conduct (Section 4.2), patients have the right to choose where they obtain their medication.\n\nI respectfully request that you release a physical copy of the prescription for the above item(s) to me immediately.\n\nSincerely,\n[Patient Name]`;

      const splitText = doc.splitTextToSize(letterBody, pageWidth - 28);
      doc.text(splitText, 14, currentY);
    }

    doc.save(`MedScan_Audit_${analysisResult.billNumber}.pdf`);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (analytics) {
      logEvent(analytics, 'scan_started');
      console.log("📈 Event: scan_started");
    }

    setView("scanning");
    setIsAnalyzing(true);
    setIsAnimationComplete(false);

    const resizedFile = await resizeImage(file);
    const formData = new FormData();
    formData.append("file", resizedFile);

    try {
      // This tells the app: Use the Vercel URL if it exists, otherwise use localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/analyse-receipt`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const backendReport = data.data;

      if (analytics) {
        logEvent(analytics, 'scan_success', {
          hospital_name: data.hospital || "Unknown",
          items_found: backendReport.totalItems
        });
      }

      setAnalysisResult({
        hospitalName: data.hospital || "Unknown Hospital",
        billDate: backendReport.billDate,
        billNumber: backendReport.billNumber,
        totalBilled: backendReport.totalBilled,
        totalGovernmentPrice: backendReport.totalGovernmentPrice,
        totalOvercharge: backendReport.totalOvercharge,
        flaggedCount: backendReport.flaggedCount,
        totalItems: backendReport.totalItems,
        medicines: backendReport.medicines
      });

    } catch (error) {
      if (analytics) {
        logEvent(analytics, 'scan_failed', { error_message: String(error) });
      }
      alert("Something went wrong. Check console for details.");
      setView("landing");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleScanComplete = useCallback(() => {
    setIsAnimationComplete(true);
  }, []);

  const handleViewPharmacies = useCallback(async (medicineId: string) => {
    const selectedMed = analysisResult?.medicines.find((m: any) => m.id === medicineId);
    const priceToBeat = selectedMed ? selectedMed.hospitalPrice : 100;

    if (analytics) logEvent(analytics, 'find_pharmacies_clicked');

    setSelectedMedicineId(medicineId);
    setView("pharmacies");
    setLoadingPharmacies(true);

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const realPharmacies = await findNearbyPharmacies(position.coords.latitude, position.coords.longitude, priceToBeat);
        setPharmaciesList(realPharmacies.length > 0 ? realPharmacies : mockPharmacies["1"]);
      } catch (error) {
        alert("Please allow location access to find pharmacies near you.");
        setPharmaciesList(mockPharmacies["1"]);
      }
    } else {
      setPharmaciesList(mockPharmacies["1"]);
    }
    setLoadingPharmacies(false);
  }, [analysisResult]);

  const handleBackToResults = useCallback(() => { setSelectedMedicineId(null); setView("results"); }, []);
  const handleStartOver = useCallback(() => { setView("landing"); setSelectedMedicineId(null); setAnalysisResult(null); }, []);

  const selectedMedicine = selectedMedicineId && analysisResult ? analysisResult.medicines.find((m: any) => m.id === selectedMedicineId) : null;

  const prescribedMedicines = analysisResult?.medicines.filter((m: any) =>
    m.category?.toLowerCase() === "medicine" || m.category?.toLowerCase() === "otc" || m.isControlled
  ) || [];

  const hospitalServices = analysisResult?.medicines.filter((m: any) =>
    m.category?.toLowerCase() !== "medicine" && m.category?.toLowerCase() !== "otc" && !m.isControlled
  ) || [];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />
      <main className="flex-1">
        {view === "landing" && (
          <>
            <HeroUpload onFileUpload={handleFileUpload} />
            <div className="border-t border-border bg-card">
              <HowItWorks />
            </div>
          </>
        )}
        {view === "scanning" && (
          <ScanningLoader onComplete={handleScanComplete} />
        )}
        {view === "results" && analysisResult && (
          <section className="px-4 py-8 md:px-6 md:py-12 bg-slate-50/50">
            <div className="mx-auto max-w-6xl">

              <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Refined Back Navigation */}
                <button
                  onClick={handleStartOver}
                  className="group flex items-center gap-3 transition-all duration-300"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-premium group-hover:bg-slate-50 group-hover:shadow-premium-hover transition-all duration-300">
                    <ArrowLeft className="h-4 w-4 text-slate-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-bold text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">
                    Scan Another Bill
                  </span>
                </button>

                {/* Right: Integrated Action Group */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Letter Counter Pill */}
                  {selectedLetterIds.size > 0 && (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3b6bce]/[0.06] border border-[#3b6bce]/10 text-[12px] font-bold text-[#3b6bce] shadow-sm transition-all animate-in fade-in slide-in-from-right-3">
                      <FileText className="w-4 h-4" strokeWidth={2.5} />
                      <span className="tracking-tight">
                        {selectedLetterIds.size} {selectedLetterIds.size === 1 ? 'item' : 'items'} selected
                      </span>
                    </div>
                  )}

                  {/* 🔥 The "Linear-Style" Export Button */}
                  <Button
                    variant="default"
                    className="h-12 gap-2.5 rounded-full bg-slate-900 px-8 text-[13px] font-bold text-white shadow-premium hover:bg-slate-800 hover:shadow-premium-hover active:scale-[0.97] transition-all duration-300"
                    onClick={handleExportPDF}
                  >
                    <Download className="h-4 w-4" strokeWidth={3} />
                    <span className="tracking-wide">Export Report & Letter</span>
                  </Button>
                </div>
              </div>

              <BillSummary analysis={analysisResult} />

              <div className="mt-12 space-y-12">
                {prescribedMedicines.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Prescribed Medicines</h2>
                      <span className="text-sm font-medium text-slate-400">{prescribedMedicines.length} items found</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {prescribedMedicines.map((med: any) => (
                        <MedicineCard
                          key={med.id}
                          medicine={med}
                          onFindPharmacies={handleViewPharmacies}
                          isSelectedForLetter={selectedLetterIds.has(med.id)}
                          onToggleLetterSelection={toggleLetterSelection}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {hospitalServices.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hospital Services & Fees</h2>
                      <span className="text-sm font-medium text-slate-400">{hospitalServices.length} items found</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hospitalServices.map((med: any) => (
                        <MedicineCard
                          key={med.id}
                          medicine={med}
                          onFindPharmacies={handleViewPharmacies}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {view === "pharmacies" && selectedMedicine && (
          <section className="px-4 py-8 md:px-6 md:py-12 bg-slate-50/50">
            <div className="mx-auto max-w-6xl">
              {loadingPharmacies ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-800" />
                  <p className="text-slate-500 font-medium">Finding nearby pharmacies...</p>
                </div>
              ) : (
                <PharmacyPanel medicine={selectedMedicine} pharmacies={pharmaciesList} onBack={handleBackToResults} />
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}