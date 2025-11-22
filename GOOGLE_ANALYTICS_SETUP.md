# Google Analytics Setup for Chieftamate

**Goal:** Track app usage, user behavior, and investor metrics

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Create Property**
1. Go to: https://analytics.google.com/
2. Click **"Admin"** (gear icon, bottom left)
3. Under **"Property"** column, click **"Create Property"**
4. Property name: **"Chieftamate"**
5. Time zone: Your timezone
6. Currency: USD
7. Click **"Next"** → **"Create"**

### **Step 2: Get Tracking ID**
1. After creating property, you'll see **"Measurement ID"**
2. Format: `G-XXXXXXXXXX`
3. Copy this ID

### **Step 3: Add to Chieftamate**
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
2. Replace `G-XXXXXXXXXX` with your actual ID

---

## 📊 What to Track

### **Key Metrics for Investors:**
1. **User Engagement:**
   - Page views
   - Session duration
   - Bounce rate
   - Pages per session

2. **Feature Usage:**
   - Photo uploads
   - Address lookups
   - Estimates generated
   - PDF downloads
   - Lead views
   - Chat interactions

3. **Conversion Funnel:**
   - Homepage → Upload → Analysis → Results → PDF Download
   - Track drop-off points

4. **User Behavior:**
   - Most used features
   - Time spent on each page
   - Return users vs new users

---

## 🔧 Implementation

### **Add to Chieftamate:**

1. **Install Google Analytics:**
   ```bash
   npm install @next/third-parties
   ```

2. **Add to layout.tsx:**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
         </body>
       </html>
     )
   }
   ```

3. **Track Custom Events:**
   ```typescript
   // Track estimate generation
   gtag('event', 'estimate_generated', {
     value: estimateTotal,
     currency: 'USD'
   });
   
   // Track lead claimed
   gtag('event', 'lead_claimed', {
     lead_id: leadId,
     estimated_value: leadValue
   });
   ```

---

## 📈 Key Reports to Show Investors

### **1. User Growth:**
- New users per day/week/month
- User retention rate
- Active users

### **2. Feature Adoption:**
- % of users who upload photos
- % of users who use satellite view
- % of users who chat with AI
- % of users who view leads

### **3. Business Metrics:**
- Estimates generated per day
- Average estimate value
- Leads generated
- PDF downloads

### **4. Engagement:**
- Average session duration
- Pages per session
- Return user rate

---

## ✅ Quick Checklist

- [ ] Created Google Analytics property
- [ ] Got Measurement ID (G-XXXXXXXXXX)
- [ ] Added to .env.local
- [ ] Installed @next/third-parties
- [ ] Added to layout.tsx
- [ ] Set up custom events
- [ ] Verified tracking works

---

## 🎯 For Investor Demo

**Show them:**
- Real-time user activity
- Feature usage stats
- Estimate generation metrics
- Lead generation stats

**This proves:**
- People are using it
- Features are valuable
- Business model works

---

**Status:** Ready to implement  
**Cost:** FREE  
**Time:** 5 minutes setup + implementation

