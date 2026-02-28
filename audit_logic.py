def compare_receipt_with_db(receipt_data, db):
    """
    Takes the JSON from Gemini, checks Firebase for fair prices,
    and calculates the overcharges.
    """
    processed_medicines = []
    total_billed = 0
    total_fair_price = 0
    flagged_count = 0

    # Gemini should return a list of items inside the JSON
    items = receipt_data.get("items", [])
    
    for index, item in enumerate(items):
        # 1. Extract data from Gemini's output
        med_name = item.get("item_name", "Unknown Item")
        qty = float(item.get("quantity", 1))
        
        # Handle cases where Gemini calls it 'price' vs 'hospital_total'
        hospital_total = float(item.get("hospital_total", item.get("price", 0)))
        hospital_unit_price = hospital_total / qty if qty > 0 else hospital_total
        category = item.get("category", "Medicine")
        
        # 2. Default values (if not found in DB or not a medicine)
        fair_unit_price = hospital_unit_price 
        is_controlled = False
        generic_name = "Service/Other"
        
        # 3. Ask Firebase for the real price!
        if category.lower() == "medicine":
            # Search your friend's 'medicines' collection for an exact name match
            docs = db.collection("medicines").where("name", "==", med_name.lower()).limit(1).get()
            
            if docs:
                db_data = docs[0].to_dict()
                fair_unit_price = db_data.get("fair_price_myr", hospital_unit_price)
                is_controlled = db_data.get("is_controlled", False)
                generic_name = db_data.get("generic_name", med_name)
                print(f"✅ Found in Firebase: {med_name} @ RM {fair_unit_price}")
            else:
                # Fallback: If DB doesn't have it, assume a 30% standard markup
                fair_unit_price = hospital_unit_price * 0.7 
                generic_name = med_name
                print(f"⚠️ Not in Firebase: {med_name}. Using fallback price.")

        # 4. Calculate the Markup
        fair_total = fair_unit_price * qty
        diff = hospital_total - fair_total
        percent = (diff / fair_total) * 100 if fair_total > 0 else 0
        
        # Flag if hospital marked it up by more than 10%
        is_flagged = False
        if category.lower() == "medicine" and percent > 10:
            is_flagged = True
            flagged_count += 1
            
        total_billed += hospital_total
        total_fair_price += fair_total
        
        # 5. Add to the final report list
        processed_medicines.append({
            "id": str(index),
            "name": med_name.title(), # Capitalize nicely for the frontend
            "genericName": generic_name.title(),
            "category": category.title(),
            "quantity": qty,
            "unit": "unit",
            "hospitalPrice": hospital_total,
            "governmentPrice": fair_total,
            "overpricePercentage": round(percent),
            "isFlagged": is_flagged,
            "isControlled": is_controlled
        })

    # 6. Return the finalized summary to api.py
    return {
        "billDate": "Today",
        "billNumber": "REF-" + str(hash(receipt_data.get("hospital_name", "SYS")))[-5:],
        "totalBilled": round(total_billed, 2),
        "totalGovernmentPrice": round(total_fair_price, 2),
        "totalOvercharge": round(max(0, total_billed - total_fair_price), 2),
        "flaggedCount": flagged_count,
        "totalItems": len(processed_medicines),
        "medicines": processed_medicines
    }