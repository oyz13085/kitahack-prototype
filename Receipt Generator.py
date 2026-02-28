import csv
import random
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
from faker import Faker

fake = Faker()

# 1. Load Medicines from CSV
def load_medicines(filename="med_db.csv"):
    medicines = []
    try:
        with open(filename, mode='r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                medicines.append(row)
    except FileNotFoundError:
        print(f"❌ Error: '{filename}' not found. Using backup data.")
        medicines = [
            {"product_name": "Augmentin 625mg", "fair_price_myr": "85.00"},
            {"product_name": "Panadol Actifast", "fair_price_myr": "18.00"},
            {"product_name": "Lipitor 20mg", "fair_price_myr": "120.00"},
            {"product_name": "Zyrtec 10mg", "fair_price_myr": "25.00"},
            {"product_name": "Crestor 10mg", "fair_price_myr": "110.00"},
            {"product_name": "Gaviscon Double Action", "fair_price_myr": "35.00"}
        ]
    return medicines

# HELPER: Round to nearest 10 (e.g., 144.50 -> 140, 146.20 -> 150)
def round_to_nearest_10(price):
    return int(round(price / 10.0) * 10)

def generate_random_bill():
    med_db = load_medicines()
    
    # --- SETUP CANVAS ---
    width, height = 600, 1000
    img = Image.new('RGB', (width, height), color='white')
    d = ImageDraw.Draw(img)
    
    # Fonts
    try:
        font_header = ImageFont.truetype("arial.ttf", 36)
        font_bold = ImageFont.truetype("arial.ttf", 20)
        font_reg = ImageFont.truetype("arial.ttf", 16)
    except:
        font_header = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_reg = ImageFont.load_default()

    # --- HEADER ---
    hospital_name = random.choice(["SUNWAY SPECIALIST", "GLENEAGLES KL", "PANTAI HOSPITAL", "PRINCE COURT MC"])
    d.text((50, 40), hospital_name, fill="darkblue", font=font_header)
    d.text((50, 90), fake.address().replace("\n", ", ")[:50], fill="gray", font=font_reg)
    d.text((50, 110), f"Date: {datetime.now().strftime('%d-%b-%Y')}", fill="black", font=font_reg)
    d.text((350, 110), f"Inv #: {random.randint(10000,99999)}", fill="black", font=font_reg)
    d.line((50, 150, 550, 150), fill="black", width=2)

    # --- GENERATE ITEMS ---
    items = []
    
    # 1. Consultation (Round random float to nearest 10)
    raw_consult = random.uniform(140.0, 310.0) # e.g., 234.50
    consult_fee = round_to_nearest_10(raw_consult) # e.g., 230
    items.append(("Consultation (Specialist)", 1, float(consult_fee)))
    
    # 2. Pick EXACTLY 5 Medicines
    target_count = 5
    if len(med_db) < target_count:
        selected_meds = med_db
    else:
        selected_meds = random.sample(med_db, target_count)
    
    for med in selected_meds:
        name = med["product_name"]
        fair_price = float(med["fair_price_myr"])
        qty = random.randint(1, 3)
        
        # LOGIC: 50% chance to be OVERPRICED
        is_overpriced = random.choice([True, False])
        if is_overpriced:
            # Random decimal markup (e.g. 1.73x)
            raw_unit_price = fair_price * random.uniform(1.5, 3.0)
        else:
            # Fair price small variation
            raw_unit_price = fair_price * random.uniform(1.0, 1.1) 
            
        # ROUND TO NEAREST 10 HERE
        unit_price = round_to_nearest_10(raw_unit_price)
        
        # Edge case: If rounding makes it 0, force it to 10
        if unit_price < 10: unit_price = 10
        
        total_price = float(unit_price * qty)
        items.append((name, qty, total_price))

    # 3. Add a service fee (Fixed)
    items.append(("Nursing / Admin Fee", 1, 40.00))

    # --- DRAW ITEMS ---
    y = 180
    d.text((50, y), "Description", font=font_bold, fill="black")
    d.text((350, y), "Qty", font=font_bold, fill="black")
    d.text((450, y), "Amount (RM)", font=font_bold, fill="black")
    y += 30
    d.line((50, y, 550, y), fill="lightgray", width=1)
    y += 20

    grand_total = 0.0
    for desc, qty, price in items:
        if len(desc) > 30:
            desc = desc[:27] + "..."
            
        d.text((50, y), desc, font=font_reg, fill="black")
        d.text((360, y), str(qty), font=font_reg, fill="black")
        
        # Display as .2f to look like currency (e.g., "150.00")
        d.text((450, y), f"{price:.2f}", font=font_reg, fill="black")
        
        grand_total += price
        y += 30

    # --- TOTALS ---
    y += 40
    d.line((50, y, 550, y), fill="black", width=2)
    y += 20
    d.text((300, y), "Grand Total:", font=font_bold, fill="black")
    d.text((450, y), f"RM {grand_total:.2f}", font=font_bold, fill="red")

    filename = f"bill_round10_{random.randint(100,999)}.jpg"
    img.save(filename)
    print(f"✅ Generated bill (Rounded to 10): {filename}")

if __name__ == "__main__":
    generate_random_bill()