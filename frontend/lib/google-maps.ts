export interface PharmacyResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  isOpen: boolean;
  placeId: string;
  distance: string;
  duration?: string; // We added the driving time!
  phone: string;
  price: number;
  savings: number;
}

export async function findNearbyPharmacies(
  lat: number,
  lng: number,
  hospitalPrice: number
): Promise<PharmacyResult[]> {

  // Use the Vercel environment variable, but fallback to localhost if you are testing on your laptop
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = `${apiUrl}/pharmacies?lat=${lat}&lng=${lng}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const json = await response.json();
    const places = json.data || [];

    return places.map((place: any) => {
      // Dynamic Pricing Logic
      const variance = (Math.random() * 0.2) - 0.1;
      const discount = 0.6 + variance;
      const estimatedPrice = hospitalPrice * discount;

      return {
        ...place,
        price: estimatedPrice,
        savings: hospitalPrice - estimatedPrice,
        // Accept the exact driving distance and time sent by Python
        distance: place.distance || "Unknown",
        duration: place.duration || ""
      };
    });

  } catch (error) {
    console.error("Backend Error:", error);
    return [];
  }
}