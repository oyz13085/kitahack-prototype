export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  quantity: number;
  unit: string;
  hospitalPrice: number;
  governmentPrice: number;
  overpricePercentage: number;
  isFlagged: boolean;
  isControlled: boolean;
  category: string;
}

export interface PharmacyRecommendation {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  savings: number;
  phone: string;
  rating: number;
  isOpen: boolean;
}

export interface BillAnalysis {
  hospitalName: string;
  billDate: string;
  billNumber: string;
  totalBilled: number;
  totalGovernmentPrice: number;
  totalOvercharge: number;
  medicines: MedicineItem[];
  flaggedCount: number;
  totalItems: number;
}

export const mockBillAnalysis: BillAnalysis = {
  hospitalName: "Bangkok General Hospital",
  billDate: "2026-02-05",
  billNumber: "BG-2026-004821",
  totalBilled: 12850,
  totalGovernmentPrice: 4320,
  totalOvercharge: 8530,
  flaggedCount: 4,
  totalItems: 7,
  medicines: [
    {
      id: "med-1",
      name: "Augmentin 625mg",
      genericName: "Amoxicillin/Clavulanate",
      quantity: 21,
      unit: "tablets",
      hospitalPrice: 2100,
      governmentPrice: 420,
      overpricePercentage: 400,
      isFlagged: true,
      isControlled: false,
      category: "Antibiotic",
    },
    {
      id: "med-2",
      name: "Nexium 40mg",
      genericName: "Esomeprazole",
      quantity: 30,
      unit: "capsules",
      hospitalPrice: 3600,
      governmentPrice: 750,
      overpricePercentage: 380,
      isFlagged: true,
      isControlled: false,
      category: "Gastrointestinal",
    },
    {
      id: "med-3",
      name: "Lipitor 20mg",
      genericName: "Atorvastatin",
      quantity: 30,
      unit: "tablets",
      hospitalPrice: 2850,
      governmentPrice: 900,
      overpricePercentage: 216,
      isFlagged: true,
      isControlled: false,
      category: "Cardiovascular",
    },
    {
      id: "med-4",
      name: "Tramadol 50mg",
      genericName: "Tramadol Hydrochloride",
      quantity: 20,
      unit: "tablets",
      hospitalPrice: 1200,
      governmentPrice: 300,
      overpricePercentage: 300,
      isFlagged: true,
      isControlled: true,
      category: "Pain Relief",
    },
    {
      id: "med-5",
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      quantity: 30,
      unit: "tablets",
      hospitalPrice: 150,
      governmentPrice: 90,
      overpricePercentage: 66,
      isFlagged: false,
      isControlled: false,
      category: "Pain Relief",
    },
    {
      id: "med-6",
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      quantity: 14,
      unit: "capsules",
      hospitalPrice: 1400,
      governmentPrice: 560,
      overpricePercentage: 150,
      isFlagged: false,
      isControlled: false,
      category: "Gastrointestinal",
    },
    {
      id: "med-7",
      name: "Loratadine 10mg",
      genericName: "Loratadine",
      quantity: 10,
      unit: "tablets",
      hospitalPrice: 1550,
      governmentPrice: 300,
      overpricePercentage: 416,
      isFlagged: true,
      isControlled: false,
      category: "Allergy",
    },
  ],
};

export const mockPharmacies: Record<string, PharmacyRecommendation[]> = {
  "med-1": [
    {
      id: "ph-1",
      name: "Fascino Pharmacy Silom",
      address: "234 Silom Road, Bang Rak, Bangkok",
      distance: "1.2 km",
      price: 450,
      savings: 1650,
      phone: "02-234-5678",
      rating: 4.5,
      isOpen: true,
    },
    {
      id: "ph-2",
      name: "Boots Pharmacy Central",
      address: "999 Rama 1 Road, Pathumwan, Bangkok",
      distance: "2.8 km",
      price: 480,
      savings: 1620,
      phone: "02-345-6789",
      rating: 4.3,
      isOpen: true,
    },
  ],
  "med-2": [
    {
      id: "ph-3",
      name: "Fascino Pharmacy Silom",
      address: "234 Silom Road, Bang Rak, Bangkok",
      distance: "1.2 km",
      price: 800,
      savings: 2800,
      phone: "02-234-5678",
      rating: 4.5,
      isOpen: true,
    },
    {
      id: "ph-4",
      name: "Pure Pharmacy Sukhumvit",
      address: "123 Sukhumvit Soi 21, Wattana, Bangkok",
      distance: "3.5 km",
      price: 850,
      savings: 2750,
      phone: "02-456-7890",
      rating: 4.7,
      isOpen: false,
    },
  ],
  "med-3": [
    {
      id: "ph-5",
      name: "Boots Pharmacy Central",
      address: "999 Rama 1 Road, Pathumwan, Bangkok",
      distance: "2.8 km",
      price: 950,
      savings: 1900,
      phone: "02-345-6789",
      rating: 4.3,
      isOpen: true,
    },
  ],
  "med-4": [
    {
      id: "ph-6",
      name: "Fascino Pharmacy Silom",
      address: "234 Silom Road, Bang Rak, Bangkok",
      distance: "1.2 km",
      price: 350,
      savings: 850,
      phone: "02-234-5678",
      rating: 4.5,
      isOpen: true,
    },
  ],
  "med-7": [
    {
      id: "ph-7",
      name: "Pure Pharmacy Sukhumvit",
      address: "123 Sukhumvit Soi 21, Wattana, Bangkok",
      distance: "3.5 km",
      price: 320,
      savings: 1230,
      phone: "02-456-7890",
      rating: 4.7,
      isOpen: false,
    },
    {
      id: "ph-8",
      name: "Boots Pharmacy Central",
      address: "999 Rama 1 Road, Pathumwan, Bangkok",
      distance: "2.8 km",
      price: 350,
      savings: 1200,
      phone: "02-345-6789",
      rating: 4.3,
      isOpen: true,
    },
  ],
};
