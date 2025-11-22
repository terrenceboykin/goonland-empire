# GitHub Repository Setup for Manus

**Goal:** Give Manus access to help debug

---

## 🔍 Check if Repo Exists

**Run this to check:**
```bash
cd ~/.gemini/antigravity/scratch/odanny-boy-xactimate-killer
git remote -v
```

**If you see a URL like `https://github.com/yourusername/repo-name.git`:**
- ✅ Repo exists!
- Copy that URL and give it to Manus

**If you see nothing:**
- Need to create repo and push code

---

## 📋 Option 1: If Repo Already Exists

### **Get the URL:**
```bash
git remote get-url origin
```

**This gives you the GitHub URL like:**
`https://github.com/yourusername/your-repo-name.git`

**Give this URL to Manus!**

---

## 📋 Option 2: Create New Repo and Push

### **Step 1: Create Repo on GitHub**
1. Go to: https://github.com/new
2. Repository name: `chieftamate` (or whatever you want)
3. Make it **Private** or **Public** (your choice)
4. **Don't** initialize with README
5. Click **"Create repository"**

### **Step 2: Push Your Code**
**Copy and paste these commands:**

```bash
cd ~/.gemini/antigravity/scratch/odanny-boy-xactimate-killer
git add .
git commit -m "Initial commit - Chieftamate app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

**Replace:**
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO-NAME` with the repo name you created

### **Step 3: Give URL to Manus**
**The URL will be:**
`https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`

---

## ✅ Quick Check

**Run this to see if repo exists:**
```bash
git remote -v
```

**If you see a URL, that's your repo!**
**If not, follow Option 2 above.**

---

**Status:** Check if repo exists, then push code  
**Goal:** Get GitHub URL for Manus

