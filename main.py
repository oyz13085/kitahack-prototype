from dotenv import load_dotenv

load_dotenv()

from google import genai
from google.genai.types import HttpOptions, Part
from google.genai import types
from PIL import Image
import json

from audit_logic import load_csv_db, compare_receipt_with_db

client = genai.Client(http_options=HttpOptions(api_version="v1"))

def scan_and_audit(image_path):

    print(f"1. Sending '{image_path}' to Gemini...")

    image = Image.open(image_path)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            """
            Extract data from this medical receipt.s
            Identify the hospital name, date, and a list of all line items.
            For each item, identify:
            - Item Name
            - The Quantity of the Item
            - Price (Numeric only)
            - Category (Classify as one of: "Medicine", "Consultation", "Lab Test", "Service")
            Return the result as a valid JSON object.

            """,
            image
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json" # Forces Gemini to return pure JSON
        )
    )

    try:
        data = json.loads(response.text)
        
        # 2. Save it to a file
        with open("receipt_data.json", "w") as f:
            json.dump(data, f, indent=4)  # indent=4 makes it pretty and readable
            
        print("✅ Success! Data saved to 'receipt_data.json'")
        
    except json.JSONDecodeError:
        print("❌ Error: Gemini didn't return valid JSON. Here is what it returned:")
        print(response.text)

    print("2. Comparing prices against MOH Database...")

    # Load the database
    med_database = load_csv_db("med_db.csv")

    with open("receipt_data.json", "r") as f:
        receipt_data = json.load(f)
    
    # Run the comparison
    final_report = compare_receipt_with_db(receipt_data, med_database)
    
    # 3. PRINT THE RESULTS
    print("\n" + "="*40)
    print(f"🏥 HOSPITAL: {receipt_data.get('hospital_name', 'Unknown')}")
    print("="*40)
    
    for item in final_report:
        status_icon = "🔴" if "OVERPRICED" in item['status'] else "🟢"
        print(f"{status_icon} {item['item_name']}")
        print(f"   Qty: {item['quantity']} | Paid: RM {item['hospital_unit_price']:.2f}/unit")
        
        if "OVERPRICED" in item['status']:
             print(f"   ⚠️  FAIR PRICE: RM {item['fair_unit_price']:.2f}/unit")
        else:
             print(f"   ✅  Price is fair.")
        print("-" * 20)        

if __name__ == "__main__":
    scan_and_audit("bill_round10_316.jpg")