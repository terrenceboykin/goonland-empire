# How to Deploy - Super Simple Steps

**No technical jargon - just follow these steps:**

---

## Step 1: Deploy to Vercel

### **Open Terminal (on your Mac):**
1. Press `Command + Space` (opens Spotlight)
2. Type: `Terminal`
3. Press Enter

### **Copy and paste these commands (one at a time):**

```bash
cd ~/.gemini/antigravity/scratch/odanny-boy-xactimate-killer
```

Press Enter, then:

```bash
npx vercel --prod
```

Press Enter.

**It will ask you questions - just press Enter for each one.**

**When it's done, it will give you a URL like:**
`https://your-app-name.vercel.app`

**Copy that URL - you'll need it!**

---

## Step 2: Add Environment Variables in Vercel

### **Go to Vercel Website:**
1. Open your web browser
2. Go to: https://vercel.com
3. Sign in (if not already signed in)

### **Find Your Project:**
1. Click on your project name (probably "odanny-boy-xactimate-killer" or "goonland-empire-v1")
2. Click **"Settings"** (top menu)
3. Click **"Environment Variables"** (left sidebar)

### **Add First Variable:**
1. Click **"Add New"** button
2. In **"Key"** box, type: `GOOGLE_GEMINI_API_KEY`
3. In **"Value"** box, type: `AIzaSyCle6ZaYaHP9joJhk0AHOOTVBN6hwRluBc`
4. Make sure **"Production"** is checked
5. Click **"Save"**

### **Add Second Variable:**
1. Click **"Add New"** button again
2. In **"Key"** box, type: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. In **"Value"** box, type: `AIzaSyCle6ZaYaHP9joJhk0AHOOTVBN6hwRluBc`
4. Make sure **"Production"** is checked
5. Click **"Save"**

---

## Step 3: Redeploy (Make It Live)

### **After adding variables, redeploy:**
1. Still in Vercel website
2. Click **"Deployments"** (top menu)
3. Find the latest deployment
4. Click the **three dots** (...) next to it
5. Click **"Redeploy"**
6. Click **"Redeploy"** again to confirm

**Wait 1-2 minutes for it to finish.**

---

## Step 4: Test It

1. Go to your app URL (the one from Step 1)
2. Try the chat - should work now!
3. Try the satellite view - should work now!

---

## That's It!

**If you get stuck:**
- Screenshot what you see
- Tell me what step you're on
- I'll help you through it

**No technical stuff - just follow the steps!**

