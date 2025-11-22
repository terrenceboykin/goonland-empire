# Google Maps API Key Setup

**Yes, it's part of Google Cloud Platform!**

Since you already have a Google Gemini API key, you can use the same Google account to get a Maps API key.

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Go to Google Cloud Console**
1. Visit: https://console.cloud.google.com/
2. Sign in with the **same Google account** you used for Gemini API
3. If you don't have a project yet, create one (or use existing)

### **Step 2: Enable Maps APIs**
1. Go to: https://console.cloud.google.com/google/maps-apis
2. Click **"APIs & Services"** → **"Library"**
3. Search for and enable these APIs:
   - ✅ **Maps JavaScript API** (for the map display)
   - ✅ **Geocoding API** (for address lookup)
   - ✅ **Maps Static API** (optional, for static images)

### **Step 3: Create API Key**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key

### **Step 4: Restrict the Key (Recommended)**
1. Click on the API key you just created
2. Under **"API restrictions"**, select **"Restrict key"**
3. Choose:
   - Maps JavaScript API
   - Geocoding API
   - Maps Static API (if enabled)
4. Under **"Application restrictions"**, you can restrict by:
   - HTTP referrers (for web)
   - IP addresses (for server-side)
5. Click **"Save"**

### **Step 5: Add to .env.local**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_maps_api_key_here
```

### **Step 6: Restart Dev Server**
```bash
npm run dev
```

---

## 💰 Pricing

**Free Tier:**
- $200 credit per month (covers most usage)
- Maps JavaScript API: $7 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

**For Demo/Testing:**
- Usually free (within $200 credit)
- Enough for hundreds of map views

**For Production:**
- Set up billing (but still get $200 free credit)
- Monitor usage in console

---

## 🔒 Security Note

**Important:** The Maps API key will be visible in the browser (it's in `NEXT_PUBLIC_`).

**Protection:**
1. ✅ Restrict by HTTP referrer (only your domain)
2. ✅ Restrict by API (only Maps APIs)
3. ✅ Monitor usage in Google Cloud Console
4. ✅ Set up usage quotas/alerts

---

## ✅ Quick Checklist

- [ ] Google Cloud account (same as Gemini)
- [ ] Project created
- [ ] Maps JavaScript API enabled
- [ ] Geocoding API enabled
- [ ] API key created
- [ ] Key restricted (recommended)
- [ ] Added to `.env.local`
- [ ] Restarted dev server

---

## 🆘 Troubleshooting

**"This page can't load Google Maps correctly"**
- Check API key is correct
- Verify APIs are enabled
- Check key restrictions (might be too restrictive)

**"Geocoding failed"**
- Verify Geocoding API is enabled
- Check API key has access to Geocoding API

**Billing Issues:**
- Set up billing account (even if using free tier)
- $200 credit covers most testing

---

## 📝 Current Status

**Your `.env.local` has:**
```
GOOGLE_GEMINI_API_KEY=AIzaSyCle6ZaYaHP9joJhk0AHOOTVBN6hwRluBc
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Just replace the placeholder with your actual Maps API key!**

---

**Time to Setup:** ~5 minutes  
**Cost:** Free for testing (within $200 credit)  
**Same Account:** Yes, use your Google account

