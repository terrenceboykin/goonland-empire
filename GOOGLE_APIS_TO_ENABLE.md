# Google Cloud APIs - What to Enable

**For:** Chieftamate App + General Use  
**Credits:** $1,300 available  
**Billing:** Free tier first, then pay-as-you-go (you have credits!)

---

## 🎯 FOR CHIEFTAMATE APP (Enable These NOW)

### **ESSENTIAL (Must Have):**

1. **✅ Maps JavaScript API** 
   - **Why:** Satellite view, address lookup, map display
   - **Cost:** $7 per 1,000 requests (free tier: $200 credit covers ~28,000 requests)
   - **Status:** ENABLE THIS FIRST

2. **✅ Geocoding API**
   - **Why:** Convert addresses to coordinates (lat/lng)
   - **Cost:** $5 per 1,000 requests (free tier covers ~40,000 requests)
   - **Status:** ENABLE THIS

3. **✅ Cloud Vision API**
   - **Why:** Image analysis, damage detection (backup to Gemini)
   - **Cost:** $1.50 per 1,000 images (free tier: 1,000/month free)
   - **Status:** ENABLE THIS - Great for roof damage detection

4. **✅ Places API**
   - **Why:** Get property details, business info, contact data
   - **Cost:** $17 per 1,000 requests (free tier: $200 credit)
   - **Status:** ENABLE THIS - For lead generation (get contact info)

### **HIGHLY RECOMMENDED:**

5. **✅ Maps Static API**
   - **Why:** Generate static map images (faster, cheaper)
   - **Cost:** $2 per 1,000 requests
   - **Status:** ENABLE - Use for lead cards/thumbnails

6. **✅ Cloud Natural Language API**
   - **Why:** Extract info from insurance claims, documents
   - **Cost:** $1 per 1,000 requests (free tier: 5,000/month free)
   - **Status:** ENABLE - Parse claim documents

---

## 🚀 FOR GENERAL USE / FUTURE FEATURES

### **Productivity & Automation:**

7. **✅ Google Sheets API**
   - **Why:** Export estimates to spreadsheets, data management
   - **Cost:** Free (within quota)
   - **Status:** ENABLE - Super useful

8. **✅ Google Drive API**
   - **Why:** Store PDFs, backup estimates, file management
   - **Cost:** Free (storage costs separate)
   - **Status:** ENABLE - Great for file storage

9. **✅ Gmail API**
   - **Why:** Send estimates via email, automated notifications
   - **Cost:** Free
   - **Status:** ENABLE - Email integration

10. **✅ Google Calendar API**
    - **Why:** Schedule inspections, job tracking
    - **Cost:** Free
    - **Status:** ENABLE - Job scheduling

### **AI & Machine Learning:**

11. **✅ Cloud Speech-to-Text API**
    - **Why:** Voice notes, dictation for estimates
    - **Cost:** $0.006 per 15 seconds (free tier: 60 min/month)
    - **Status:** ENABLE - Voice features

12. **✅ Dialogflow API**
    - **Why:** Advanced chatbot, voice assistants
    - **Cost:** Free tier available
    - **Status:** CONSIDER - If you want advanced chat

### **Analytics & Data:**

13. **✅ Google Analytics API**
    - **Why:** Track app usage, user behavior
    - **Cost:** Free
    - **Status:** ENABLE - Understand users

---

## ❌ SKIP THESE (Not Needed for Chieftamate)

- **Maps SDK for Android/iOS** - We're using web (JavaScript API)
- **YouTube APIs** - Not relevant
- **Google+ APIs** - Deprecated
- **AdSense APIs** - Not needed
- **Campaign Manager** - Not needed
- **Compute Engine API** - We're using Next.js/Vercel
- **Cloud Datastore** - We're using Prisma/SQLite

---

## 💰 Cost Breakdown (With $1,300 Credits)

### **Monthly Estimate for Chieftamate:**

| API | Usage | Cost/Month | Notes |
|-----|-------|------------|-------|
| Maps JavaScript | 5,000 requests | $35 | Heavy usage |
| Geocoding | 3,000 requests | $15 | Address lookups |
| Places API | 1,000 requests | $17 | Lead contact info |
| Address Validation | 2,000 requests | $10 | Validate addresses |
| Distance Matrix | 5,000 requests | $25 | Show distance to leads |
| Directions | 3,000 requests | $15 | Get directions |
| Routes | 1,000 requests | $5 | Advanced routing |
| Route Optimization | 500 requests | $10 | Optimize multiple stops |
| Roads | 2,000 requests | $10 | Traffic data |
| Timezone | 1,000 requests | $5 | Timezone handling |
| Places Aggregate | 1,000 requests | $10 | Enhanced property data |
| Cloud Vision | 2,000 images | $3 | Damage detection |
| Natural Language | 1,000 requests | $1 | Document parsing |
| **TOTAL** | | **~$161/month** | Still well within credits! |

**With $1,300 credits:** You have ~17 months of usage! 🎉

---

## 🎯 PRIORITY ORDER (Enable in This Order)

### **Phase 1: Essential for App (Do NOW)**
1. ✅ Maps JavaScript API
2. ✅ Geocoding API
3. ✅ Places API
4. ✅ Cloud Vision API
5. ✅ **Weather API Integration** (CRITICAL for lead gen!)
6. ✅ Maps Data Sets API (property data)
7. ✅ Address Validation API
8. ✅ Distance Matrix API
9. ✅ Directions API
10. ✅ Routes API
11. ✅ Route Optimization API
12. ✅ Roads API
13. ✅ Timezone API
14. ✅ Places Aggregate API

### **Phase 2: Nice to Have (Enable Soon)**
7. ✅ Cloud Natural Language API
8. ✅ Google Sheets API
9. ✅ Google Drive API

### **Phase 3: General Productivity (Enable When Needed)**
9. ✅ Gmail API
10. ✅ Google Calendar API
11. ✅ Cloud Speech-to-Text API
12. ✅ Google Analytics API

---

## 📝 Quick Enable Checklist

**For Chieftamate App (Essential):**
- [ ] Maps JavaScript API ⭐
- [ ] Geocoding API ⭐
- [ ] Places API ⭐
- [ ] Cloud Vision API ⭐
- [ ] Maps Data Sets API ⭐ (property data)
- [ ] Cloud Natural Language API

**For Lead Generation (CRITICAL):**
- [ ] National Weather Service API (FREE - not Google, but integrate!)
- [ ] OpenWeatherMap API (backup)
- [ ] Weather.com API (optional)

**Why Enable Everything Useful:**
- ✅ You have $1,300 credits
- ✅ Free tiers cover most usage
- ✅ Better to have and not need than need and not have
- ✅ Enables future features
- ✅ No downside (free tier first)

**For General Use:**
- [ ] Google Sheets API
- [ ] Google Drive API
- [ ] Gmail API
- [ ] Google Calendar API
- [ ] Google Analytics API

---

## 🔒 Security Notes

**After enabling:**
1. **Restrict API keys** - Don't use unrestricted keys
2. **Set quotas** - Limit usage to prevent overage
3. **Monitor usage** - Check console regularly
4. **Set up billing alerts** - Get notified at thresholds

---

## ✅ What Anti-gravity Should Know

**For Chieftamate specifically:**
- Maps JavaScript API = Satellite view
- Geocoding API = Address → coordinates
- Places API = Get contact info for leads
- Cloud Vision API = Enhanced damage detection

**These are the core APIs needed for the app to work at full capacity.**

---

**Last Updated:** November 22, 2024  
**Credits Available:** $1,300  
**Estimated Monthly Cost:** ~$75  
**Months Covered:** ~17 months 🎉

