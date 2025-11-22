# How to Get the Google Maps Solar API Key (The "Satellite Eyes")

You have the **Gemini Key** (The Brain). Now we need the **Maps Key** (The Eyes).

## Step 1: Go to Google Cloud Console

1. Visit: [https://console.cloud.google.com/google/maps-apis/api-list](https://console.cloud.google.com/google/maps-apis/api-list)
2. Make sure you are in the same project where you got your Gemini key.

## Step 2: Enable the "Solar API"

1. Click **"Enable APIs and Services"** (or "+ ENABLE APIS").
2. Search for **"Solar API"**.
3. Click **"Solar API"** and then click **"ENABLE"**.
    * *Note: This is the specific API that analyzes roof geometry.*

## Step 3: Get the Key

1. Go to **"Credentials"** on the left menu.
2. Click **"+ CREATE CREDENTIALS"** -> **"API Key"**.
3. **Copy this key.**

## Step 4: Send it to Me

Paste the key in the chat, or add it to your `.env.local` file like this:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

## Why we need this?

* **Gemini Key:** Reads the photos and writes the estimate.
* **Maps Key:** Flies the satellite, measures the roof pitch, and finds the sun/shade data.

**Without this key, we can only do Photo Uploads.**
