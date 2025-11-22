# Next Step: Add Environment Variables

**✅ Deployment Done!**
**Your app URL:** https://goonland-empire-v1-86vreia8l-terrenceboykins-projects.vercel.app

**Now add the keys so chat and maps work!**

---

## Step-by-Step: Add Environment Variables

### **1. Go to Vercel Website:**
- Open your browser
- Go to: https://vercel.com
- Sign in (if needed)

### **2. Find Your Project:**
- Click on **"goonland-empire-v1"** (or whatever project name you see)
- OR click the Inspect link from your terminal

### **3. Go to Settings:**
- Click **"Settings"** (top menu bar)
- Click **"Environment Variables"** (left sidebar)

### **4. Add First Key:**
1. Click **"Add New"** button
2. **Key:** Type exactly: `GOOGLE_GEMINI_API_KEY`
3. **Value:** Type exactly: `AIzaSyCle6ZaYaHP9joJhk0AHOOTVBN6hwRluBc`
4. Check the box for **"Production"**
5. Click **"Save"**

### **5. Add Second Key:**
1. Click **"Add New"** button again
2. **Key:** Type exactly: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. **Value:** Type exactly: `AIzaSyCle6ZaYaHP9joJhk0AHOOTVBN6hwRluBc`
4. Check the box for **"Production"**
5. Click **"Save"**

### **6. Redeploy:**
1. Click **"Deployments"** (top menu)
2. Find the latest deployment (should be the one that just finished)
3. Click the **three dots** (...) on the right
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm
6. Wait 1-2 minutes

---

## ✅ Then Test:

1. Go to: https://goonland-empire-v1-86vreia8l-terrenceboykins-projects.vercel.app
2. Try the chat - should work now!
3. Try satellite view - should work now!

---

**That's it! Just add those 2 keys and redeploy!**

