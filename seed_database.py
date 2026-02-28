import csv
import firebase_admin
from firebase_admin import credentials, firestore

# Connect to your friend's Firebase
cred = credentials.Certificate("firebase-credentials.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def is_controlled(mal_number):
    """Checks if a medicine is controlled based on MAL Number suffix."""
    if not mal_number or not isinstance(mal_number, str):
        return False
    suffix = mal_number[-4:].upper()
    return "A" in suffix

def seed_from_csv(file_path):
    print(f"🚀 Reading medicines from {file_path}...")
    batch = db.batch()
    count = 0

    try:
        with open(file_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                product_name = row['product_name'].strip()
                # Create a clean ID for the database (e.g., "augmentin_625mg_tablet")
                doc_id = product_name.lower().replace(" ", "_").replace("/", "_")
                
                med_data = {
                    "mal_number": row['mal_number'].strip(),
                    "name": product_name.lower(), # Store lowercase for easier searching
                    "generic_name": row['generic_name'].strip().lower(),
                    "fair_price_myr": float(row['fair_price_myr']),
                    "is_controlled": is_controlled(row['mal_number'].strip())
                }
                
                doc_ref = db.collection("medicines").document(doc_id)
                batch.set(doc_ref, med_data)
                count += 1
                
                if count % 500 == 0:
                    batch.commit()
                    batch = db.batch()

            if count % 500 != 0:
                batch.commit()
                
            print(f"🎉 Done! Successfully seeded {count} medicines to Firebase.")
            
    except Exception as e:
        print(f"❌ Error reading CSV or uploading: {e}")

if __name__ == "__main__":
    # Make sure your CSV is named med_db.csv and is in the same folder!
    seed_from_csv("med_db.csv")