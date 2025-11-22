# Lead Generation Engine - Technical Specification

**Priority:** HIGHEST - This is the competitive differentiator  
**Timeline:** 2-3 weeks  
**Impact:** Transforms Chieftamate from tool to platform

---

## 🎯 Core Concept

**Proactive Lead Generation:**
- Monitor storms/weather events
- Auto-scan affected areas via satellite
- AI detects roof damage
- Generate leads BEFORE competitors know
- Notify contractors immediately

---

## 🏗️ Architecture

### **1. Storm Monitoring Service**
```typescript
// Monitor weather APIs
- National Weather Service API
- Weather.com API
- Storm tracking services
- Real-time alerts for:
  * Hail events
  * High winds
  * Tornadoes
  * Severe storms
```

### **2. Satellite Scanning Service**
```typescript
// After storm detected:
1. Get affected area coordinates
2. Use Google Maps/Earth API
3. Scan for residential roofs
4. AI analyzes for damage
5. Generate lead list
```

### **3. Damage Detection AI**
```typescript
// Enhanced Gemini prompt:
- Compare pre/post storm imagery
- Identify damage patterns:
  * Missing shingles
  * Hail damage
  * Wind damage
  * Structural issues
- Score damage severity (1-10)
- Estimate repair cost range
```

### **4. Lead Database**
```typescript
interface Lead {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  damageType: string[];
  damageScore: number;
  estimatedCost: { min: number; max: number };
  stormEvent: string;
  detectedAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  contractorId?: string;
  notes?: string;
}
```

### **5. Notification System**
```typescript
// Real-time alerts:
- Email to contractors
- SMS notifications
- In-app notifications
- Dashboard updates
- Lead assignment
```

---

## 🔧 Implementation Plan

### **Week 1: Storm Monitoring**
1. **Weather API Integration**
   - Set up National Weather Service API
   - Create monitoring service
   - Real-time storm detection
   - Alert system

2. **Database Setup**
   - Lead table
   - Storm events table
   - Contractor assignments

### **Week 2: Satellite Scanning**
1. **Google Maps/Earth API**
   - Area scanning service
   - Batch satellite image requests
   - Image processing pipeline

2. **Damage Detection**
   - Enhanced AI prompt
   - Pre/post comparison (if available)
   - Damage scoring system

### **Week 3: Lead Management**
1. **Lead Dashboard**
   - View all leads
   - Filter by area/damage/status
   - Assign to contractors
   - Export lead lists

2. **Notification System**
   - Email templates
   - SMS integration (Twilio)
   - In-app notifications
   - Contractor alerts

---

## 📊 Features

### **For Contractors:**
1. **Lead Feed**
   - Real-time new leads
   - Filter by location/radius
   - Damage type filters
   - Estimated value filters

2. **Lead Details**
   - Address + map
   - Damage photos (satellite)
   - Estimated repair cost
   - Contact information
   - Claim status (if available)

3. **Lead Management**
   - Claim leads
   - Add notes
   - Track status
   - Export to CRM

### **For Platform:**
1. **Storm Dashboard**
   - Active storms
   - Affected areas
   - Leads generated
   - Conversion rates

2. **Analytics**
   - Lead quality scores
   - Conversion rates
   - Revenue per lead
   - Contractor performance

---

## 💰 Revenue Model

### **Per Lead Pricing:**
- **Basic Lead:** $25 (address + damage estimate)
- **Premium Lead:** $50 (includes contact info + claim data)
- **Storm Package:** $2,000 (unlimited leads for storm event)

### **Subscription:**
- **Lead Gen Basic:** $500/month (50 leads)
- **Lead Gen Pro:** $1,500/month (unlimited leads in area)
- **Enterprise:** Custom pricing

---

## 🚀 Competitive Advantage

**Xactimate:** Reactive (estimates after you get lead)  
**Chieftamate:** Proactive (finds leads before competitors)

**Example Scenario:**
1. Storm hits Chicago at 2pm
2. Chieftamate detects storm at 2:05pm
3. Scans affected area at 2:30pm
4. Generates 200 leads by 3pm
5. Contractors notified at 3:01pm
6. Contractors contact homeowners at 3:30pm
7. Competitors find out at 5pm (too late)

**Result:** Chieftamate contractors get there FIRST.

---

## 🔐 Technical Requirements

### **APIs Needed:**
1. **Weather APIs:**
   - National Weather Service
   - Weather.com
   - OpenWeatherMap

2. **Satellite/Maps:**
   - Google Maps API
   - Google Earth Engine (for historical)
   - Nearmap (alternative)

3. **Contact Data:**
   - Property records APIs
   - WhitePages API
   - Real estate APIs

4. **Notifications:**
   - SendGrid (email)
   - Twilio (SMS)
   - Push notifications

### **Infrastructure:**
- Background job processing (Bull/BullMQ)
- Queue system for scanning
- Database for leads
- Caching layer (Redis)

---

## 📈 Success Metrics

1. **Lead Generation:**
   - Leads per storm event
   - Time to generate leads
   - Lead quality score

2. **Conversion:**
   - Lead to estimate conversion
   - Estimate to job conversion
   - Revenue per lead

3. **Competitive Edge:**
   - Time advantage over competitors
   - Market share growth
   - Contractor retention

---

## 🎯 MVP Features (Launch)

1. ✅ Storm monitoring (basic)
2. ✅ Satellite scanning (manual trigger)
3. ✅ Damage detection AI
4. ✅ Lead database
5. ✅ Contractor notifications
6. ✅ Basic dashboard

**Advanced Features (Later):**
- Automated scanning
- Historical comparison
- Contact information lookup
- CRM integration
- Advanced analytics

---

**Status:** Ready to build  
**Priority:** HIGHEST  
**Impact:** Game-changing competitive advantage

