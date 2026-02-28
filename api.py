import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Get the JSON string from the environment
cred_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

if not cred_json:
    print("❌ ERROR: FIREBASE_SERVICE_ACCOUNT_JSON is missing from Render Environment Variables!")
else:
    try:
        # Some platforms add extra escaped characters; this cleans them up
        if cred_json.startswith("'") or cred_json.startswith('"'):
            cred_json = cred_json[1:-1]
            
        cred_dict = json.loads(cred_json)
        firebase_cred = credentials.Certificate(cred_dict)
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app(firebase_cred)
        
        db = firestore.client()
        print("✅ Firebase initialized successfully on Render!")
    except Exception as e:
        print(f"❌ ERROR: Failed to parse Firebase JSON: {e}")

from google import genai
from google.genai.types import HttpOptions, Part
from google.genai import types
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import json
import shutil
import requests

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

#from audit_logic import load_csv_db, compare_receipt_with_db
from audit_logic import compare_receipt_with_db

client = genai.Client(http_options=HttpOptions(api_version="v1beta"))
app = FastAPI()

# Enable CORS (Allows your frontend at localhost:3000 to talk to this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#MED_DATABASE = load_csv_db("med_db.csv")

@app.get("/")
async def root():
    return {"status": "online", "message": "MedScan API is running"}

@app.post("/analyse-receipt")
async def analyse_receipt(file: UploadFile = File(...)):

    temp_filename = f"temp_{file.filename}"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"1. Sending '{temp_filename}' to Gemini...")
        image = Image.open(temp_filename)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                """
                You are an expert medical billing assistant operating in Malaysia. 
                Extract data from this medical receipt.
                Identify the hospital name, date, and a list of all line items.
                
                CRITICAL TRANSLATION RULE:
                Hospitals use messy abbreviations. If an item is a medicine, you MUST translate its name into its standard, full, lowercase brand or generic name so it perfectly matches our database. 
                Use these exact mappings as a guide for formatting:
                - "AUG 625" -> "augmentin 625mg tablet"
                - "PNDL ACTI" -> "panadol actifast"
                - "LIP 20" -> "lipitor 20mg"
                - "GAVISCON DA" -> "gaviscon double action"

                For each item, identify:
                - Item Name (This MUST be the translated clean name)
                - The Quantity of the Item
                - Price (Numeric only)
                - Category (Classify as one of: "Medicine", "Consultation", "Lab Test", "Service")
                
                Return the result as a valid JSON object.
                """,
                image
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        # Clean response
        clean_text = response.text.strip()
        if clean_text.startswith("```json"): clean_text = clean_text[7:-3]
        receipt_data = json.loads(clean_text)

        # 3. RUN AUDIT LOGIC (Imported from audit_logic.py)
        # This part is exactly the same!
        #audit_report = compare_receipt_with_db(receipt_data, MED_DATABASE)
        audit_report = compare_receipt_with_db(receipt_data, db)

        # OPTIONAL: Save to file for debugging
        with open("debug_receipt.json", "w") as f:
            json.dump(receipt_data, f, indent=4)
        print("💾 Debug file saved to 'debug_receipt.json'")

        return {
            "hospital": receipt_data.get("hospital_name", "Unknown"),
            "data": audit_report
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.get("/pharmacies")
async def get_pharmacies(lat: float, lng: float):
    # ⚠️ REMINDER: Please delete this key from Google Cloud and generate a new one soon!
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    
    # --- 1. GET NEARBY PHARMACIES (PLACES API) ---
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": 5000,
        "type": "pharmacy",
        "key": GOOGLE_API_KEY
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    # --- DEBUG: IF GOOGLE FAILS, SHOW WHY ---
    if data.get("status") != "OK":
        return {
            "error": "Google API Failed",
            "status": data.get("status"),
            "message": data.get("error_message", "No error message provided")
        }
    # ----------------------------------------

    # --- 🆕 FILTERING LOGIC ---
    all_google_results = data.get("results", [])
    
    # Define words that mean it is NOT a retail pharmacy
    bad_keywords = [
    "testing", "lab", "laboratory", "consult", "hq", "office", 
    "klinik", "clinic", "pinnikle", "sdn bhd", 
    "beauty", "regulatory", "services", "hall", "enterprise" # <-- Added new ones here!
]
    
    clean_places = []
    for place in all_google_results:
        name_lower = place.get("name", "").lower()
        
        # If none of the bad words are in the name, keep it!
        if not any(bad_word in name_lower for bad_word in bad_keywords):
            clean_places.append(place)

    # NOW grab the top 5 from the cleaned list
    raw_places = clean_places[:5] 
    # --------------------------
    
    # If no pharmacies found, return empty right away
    if not raw_places:
        return {"data": []}

    # --- 2. GET DRIVING ROUTES (DISTANCE MATRIX API) ---
    # Format the destinations string like: "place_id:ABC|place_id:DEF"
    destinations = "|".join([f"place_id:{place.get('place_id')}" for place in raw_places])
    
    dm_url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    dm_params = {
        "origins": f"{lat},{lng}",
        "destinations": destinations,
        "key": GOOGLE_API_KEY
    }
    
    dm_response = requests.get(dm_url, params=dm_params)
    dm_data = dm_response.json()

    print("🚨 GOOGLE DISTANCE MATRIX RESPONSE:", dm_data)
    
    # Extract the distances array. Google returns this inside rows[0].elements
    distances = []
    if dm_data.get("status") == "OK" and dm_data.get("rows"):
        distances = dm_data["rows"][0].get("elements", [])

    # --- 3. MERGE THE DATA TOGETHER ---
    results = []
    for i, place in enumerate(raw_places):
        # Match the distance data to the pharmacy (if it successfully calculated)
        dist_data = distances[i] if i < len(distances) else {}
        
        # Grab the beautiful text Google provides (e.g., "5.2 km" and "12 mins")
        driving_distance = dist_data.get("distance", {}).get("text", "Unknown")
        driving_duration = dist_data.get("duration", {}).get("text", "")

        results.append({
            "id": place.get("place_id"),
            "name": place.get("name"),
            "address": place.get("vicinity"),
            "rating": place.get("rating", 0),
            "isOpen": place.get("opening_hours", {}).get("open_now", True),
            "placeId": place.get("place_id"),
            "phone": "03-5555 1234",
            "lat": place.get("geometry", {}).get("location", {}).get("lat"),
            "lng": place.get("geometry", {}).get("location", {}).get("lng"),
            # 🔥 NEW FIELDS WE JUST ADDED:
            "distance": driving_distance,
            "duration": driving_duration 
        })
            
    return {"data": results}

def is_controlled(mal_number):
    """
    Checks if a medicine is controlled based on its MAL Number suffix.
    Returns True if Controlled (A), False if OTC (X/N/T).
    """
    if not mal_number or not isinstance(mal_number, str):
        return False
        
    # Standard format is MAL12345678AZ or MAL12345678XRZ
    # We look for the letter 'A' in the suffix part
    
    # Simple check: If 'A' is in the last 4 characters, it's likely controlled
    # Example: ...AZ, ...ARZ, ...ACZ -> Controlled
    suffix = mal_number[-4:] 
    
    if "A" in suffix:
        return True  # 🔒 Controlled
    else:
        return False # ✅ Safe (X, N, T)            