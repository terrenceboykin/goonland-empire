# Google Analytics Events - Track Key Actions

**Purpose:** Track what users do in Chieftamate for investor metrics

---

## 🎯 Events to Track

### **1. Estimate Generation**
```typescript
gtag('event', 'estimate_generated', {
  value: estimateTotal,
  currency: 'USD',
  estimate_id: jobId,
  line_items: lineItemsCount
});
```

### **2. Photo Upload**
```typescript
gtag('event', 'photo_uploaded', {
  photo_count: files.length,
  method: 'upload' // or 'satellite'
});
```

### **3. Satellite View Used**
```typescript
gtag('event', 'satellite_view', {
  address: address,
  action: 'viewed'
});
```

### **4. Lead Claimed**
```typescript
gtag('event', 'lead_claimed', {
  lead_id: leadId,
  estimated_value: leadValue,
  damage_score: damageScore
});
```

### **5. PDF Downloaded**
```typescript
gtag('event', 'pdf_downloaded', {
  estimate_id: jobId,
  estimate_value: total
});
```

### **6. AI Chat Used**
```typescript
gtag('event', 'ai_chat', {
  message_count: messageCount,
  chat_duration: durationSeconds
});
```

### **7. Route Optimized**
```typescript
gtag('event', 'route_optimized', {
  lead_count: leads.length,
  estimated_savings: timeSavedMinutes
});
```

---

## 📊 Key Metrics for Investors

### **Daily/Weekly:**
- Estimates generated
- Leads claimed
- PDFs downloaded
- Active users
- New users

### **Engagement:**
- Average session duration
- Pages per session
- Return user rate
- Feature adoption rate

### **Business:**
- Total estimate value
- Average estimate value
- Leads generated
- Conversion rate (lead → estimate)

---

**Status:** Ready to implement  
**Add these events to key actions in the app**

