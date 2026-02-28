<h1 align="center">🩺 MedScan</h1>

<p align="center">
  <strong>Defeating Predatory Medical Pricing in Malaysia through AI and Crowdsourced Transparency</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-Black?logo=next.js&style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?logo=google-cloud&logoColor=white&style=for-the-badge" alt="Google Cloud" />
  <img src="https://img.shields.io/badge/Vertex_AI_Gemini_2.0-8E75B2?logo=google-gemini&logoColor=white&style=for-the-badge" alt="Gemini" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firebase" />
</p>

---

> **Submission for Google Developer Group KitaHack 2026**
>  
> **Built by Team W Gaming (Universiti Malaya):** Ooi Yong Zhe, Lim Kai Hern, Chong Sing Kiat, and Nicholas Tan Hong Junn.
>
> **🎥 Demo Video:** [Insert YouTube Link Here]

## 🚨 The Problem: A Free-Market Failure in Healthcare

In Malaysia, the Private Healthcare Facilities and Services Act 1998 (Act 586) strictly caps consultation and procedural fees, but it **does not regulate drug prices or price marking**. This regulatory loophole allows private hospitals and clinics to operate in a "free-market system" for medicines, legally imposing hidden, predatory markups. 

* **The Reality:** The markup for generic medicines in Malaysian private healthcare ranges from 31% to 402%. 
* **The Extreme:** Common generic medicines, like Paracetamol, are frequently sold at profit margins between 2,400% and 4,900% in private clinics. 
* **The Impact:** Malaysia's medical inflation is projected to hit 16% in 2026, vastly overshadowing the Asia-Pacific average. Malaysia's Out-of-Pocket (OOP) health spending is dangerously high at 38%, pushing families toward Catastrophic Health Expenditure (CHE).

## 💡 The Solution: MedScan

MedScan is an AI-powered financial protection platform that restores agency to the patient. By taking a photo of a hospital bill, MedScan instantly audits the charges, calculates the exact overcharge, routes the user to a fair-priced community pharmacy, and generates the legal paperwork needed to transfer their prescription.

## 🌱 UN Sustainable Development Goals (SDGs)

MedScan was built to directly align with two core United Nations SDGs:

* **Goal 3: Good Health and Well-Being**
  * **Target 3.8 (Achieve Universal Health Coverage):** Malaysia's Out-of-Pocket (OOP) health spending is dangerously high at 38%, pushing families toward Catastrophic Health Expenditure (CHE). MedScan mitigates this financial shock by exposing price gouging.
  * **Target 3.b (Access to Affordable Essential Medicines):** Patients currently lack the agency or knowledge to find an alternative when they realize they are being overcharged. MedScan restores this agency by routing them to fair-priced local pharmacies.

* **Goal 12: Responsible Consumption and Production**
  * **Target 12.6 (Corporate Sustainability Reporting and Practices):** Large private healthcare facilities currently operate as businesses with zero public accountability for pharmaceutical pricing. MedScan enforces accountability through crowdsourced transparency.

### ✨ Core Features

* **AI-Powered Bill Simplification:** Scans, extracts, and translates complex, messy hospital receipts into a clean, easy-to-read itemized digital dashboard using contextual multimodal understanding.
* **Fair Price Benchmarking:** Compares hospital billed prices against official government fair-price targets to instantly calculate overcharges.
* **Hyper-Local Pharmacy Routing:** Dynamically routes patients from overpriced hospitals to affordable, local SME community pharmacies within a 5km radius, complete with real-time driving ETAs and directions.
* **Legal Agency Export:** Generates a legally valid Prescription Request Letter citing the Malaysian Medical Council (MMC) Code of Professional Conduct (Section 4.2), giving patients the leverage to safely port their controlled medicines.

## ⚙️ Implementation Details & System Flow

MedScan’s architecture is designed to handle unpredictable scaling and secure data integration by leveraging the Google Cloud and Firebase ecosystem. Here is a breakdown of how the system executes a user request:

### 1. The Frontend (Next.js & Tailwind CSS)
* **Performance Optimization:** Built with Next.js and Tailwind CSS for a lightning-fast, responsive UI. Edge caching ensures the interface loads in milliseconds, providing an app-like experience even in areas with unstable connectivity.
* **Perceived Performance Routing:** We implemented sequenced skeleton loaders to mask the AI's processing time, ensuring the app feels instantaneous and keeps the user engaged during the OCR extraction phase.
* **Frictionless Onboarding:** Utilizes Firebase Anonymous Authentication to transition users from awareness to action without the friction of a sign-up wall.

### 2. The Backend (FastAPI on Google Cloud Run)
* **The "Super-Extractor" API:** A Python-based FastAPI service deployed on Cloud Run. It handles heavy data extraction and offloads geographic math from the client side. 
* **Server-Side Geolocation:** To prevent missing data and UI fallback errors, the backend chains the Google Places API with the Distance Matrix API entirely server-side, serving clean, flattened data to the frontend to locate pharmacies within a 5km radius.
* **The Hallucination Guardrail:** Acts as a deterministic layer that executes the fuzzy price audit. It strictly executes mathematical cross-referencing against the official database before presenting any financial data to the user.

### 3. AI & Data Extraction (Vertex AI & Gemini 2.0 Flash)
* **Multimodal OCR:** Uses Gemini 2.0 Flash deployed via Vertex AI to process uploaded receipt images. 
* **Contextual Understanding:** The model is tuned to accurately distinguish a "Consultation Fee" from a "Medicine," successfully extracting data even from faded thermal receipts.
* **JSON Enforcement:** We apply strict JSON output enforcement on the model's responses to guarantee structured data and prevent backend crashes.

### 4. Database & Analytics (Firebase & GA4)
* **Live Database:** Firebase Firestore houses the dynamic fair-price index, allowing for instant, live price updates.
* **Behavioral Tracking:** Google Analytics 4 (GA4) is embedded directly into the Next.js frontend to move beyond vanity metrics. We track specific, high-value conversion events, such as the drop-off rate during receipt scanning and exact clicks on the "Find Nearby Pharmacies" routing button.

## 🛠️ Coding Challenge: Real-Time Geolocation & AI Extraction

Building a seamless bridge between heavy AI extraction and hyper-local mapping presented a significant technical hurdle during development.

* **The Challenge:** Integrating real-time geolocation between a Python AI backend and a Next.js frontend.
* **The Issue:** Attempting to parse deeply nested JSON coordinates from the Google Places API caused missing data and UI fallback errors.
* **The Solution:** We engineered a custom backend "Super-Extractor".
* **The Execution:** We shifted the architectural load by chaining the Google Places API with the Distance Matrix API entirely server-side, ensuring the frontend only received clean, flattened data. 

## 🌍 Future Roadmap: Crowdsourced Transparency

MedScan's ultimate impact lies in its B2B scalability. Our strategic phases for expansion include:

* 📊 **Crowdsourced Medical Price Index:** Scanned receipts passively build a dynamic, crowdsourced pricing database.
* 🤝 **B2B API Integration:** Our next phase involves opening a B2B API that empowers insurers to negotiate inflated Guarantee Letters, effectively stabilizing national insurance premiums.
* 🚀 **Rapid Regional Scaling:** Our modular architecture utilizes plug-and-play regional pricing datasets, allowing rapid expansion across Southeast Asia without rebuilding the app.

### 5. Hardware, Geographic & Demographic Scalability

* **Cloud-Powered Processing for Budget Devices:** To ensure maximum accessibility regardless of a user's income level, all heavy AI extraction and OCR tasks are strictly offloaded to the Google Cloud backend. This keeps the Next.js client lightweight and lightning-fast, allowing the application to scale seamlessly even on budget smartphones with low processing power.
* **Modular Data Architecture:** The system is built with plug-and-play regional pricing datasets. By decoupling the core application logic from the localized pricing data, we have engineered a system that allows for rapid, frictionless expansion across other Southeast Asian countries without ever needing to rebuild the core app.
* **Frictionless UI for Demographic Scaling:** A one-click "snap-and-generate" workflow ensures total accessibility for all users, regardless of their tech literacy. This frictionless design allows the platform to scale easily across older demographics who are often the most vulnerable to medical price gouging.

---

## 🧑‍⚖️ Judge's Testing Guide (Live Demo)

Want to test MedScan right now without setting up a local environment? We have deployed a live instance for the KitaHack judges!

**🌐 Live Platform Link:** [Insert Vercel/Live Link Here]

### How to test the AI Extraction:
Since you might not have a Malaysian hospital bill handy, we have provided test receipts that highlight exactly how our Gemini 2.0 Flash integration decodes complex medical jargon.

1. **Download a Test Receipt:** * [Sample A: Severe Overcharge (Paracetamol & Augmentin)](/docs/samples/sample-a.jpg) *(Note: Add the actual image file to a `/docs/samples/` folder in your repo)*
   * [Sample B: Cryptic Abbreviations (LIP20 & Panadol)](/docs/samples/sample-b.jpg) *(Note: Add the actual image file to a `/docs/samples/` folder in your repo)*
2. **Upload to MedScan:** Click "Scan Bill" on our web app and upload the downloaded image.
3. **Watch the AI Work:** See how the system parses the unstructured text, cross-references the MOH database, and flags the overcharges in red.
4. **Trigger the Action:** Click "Find Nearby Pharmacies" to see the server-side geolocation in action.

---

## 💻 Quick Start (Local Development)

To get MedScan running locally on your machine, you need to configure and run two separate environments: the Python FastAPI backend and the Next.js frontend. 

### Prerequisites
Before you begin, ensure your computer has the following installed:
* **Node.js** (v18 or higher) for the frontend.
* **Python** (v3.9 or higher) for the backend.
* **Google Cloud Project** with Vertex AI and Google Places/Distance Matrix APIs enabled.
* **Firebase Project** configured with Firestore and Anonymous Authentication.

---

### Step 1: Backend Setup (FastAPI & Google Cloud)
We start by setting up the backend, which acts as the deterministic "Hallucination Guardrail" and handles all the heavy Gemini AI data extraction.

First, open your terminal and navigate into the backend folder. You will need to create a Python "virtual environment" so that your installed packages don't interfere with other projects on your computer. After creating it, activate the environment and install the required dependencies.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment named 'venv'
python -m venv venv

# 3. Activate the virtual environment
# On Mac/Linux use:
source venv/bin/activate  
# On Windows use: 
# venv\Scripts\activate

# 4. Install the required Python packages
pip install -r requirements.txt
```

### Step 2: Configure Backend Environment Variables
MedScan requires a few API keys to function locally. 

```bash
1. In the `backend` folder, duplicate the `.env.example` file and rename it to `.env`.
2. Open the `.env` file and add your credentials:
   ```env
   # Google Gemini API Key (Get this from Google AI Studio)
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Google Maps / Places API Key (Needed for server-side Distance Matrix math)
   GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
   
   # Firebase Admin SDK path (Optional: if you are running the live database sync locally)
   FIREBASE_CREDENTIALS_PATH="./path-to-your-firebase-adminsdk.json"

