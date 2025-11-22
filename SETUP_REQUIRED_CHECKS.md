# Setting Up Required Status Checks

**Goal:** Make PR requirements enforceable with GitHub status checks

---

## ✅ What I Created

1. **CONTRIBUTING.md** - PR requirements document
2. **.github/pull_request_template.md** - PR checklist template
3. **.github/workflows/pr-checks.yml** - GitHub Actions for automated checks
4. **.github/workflows/canary-deployment.yml** - Canary deployment workflow

---

## 🔧 How to Set Up Required Status Checks

### **Step 1: Enable GitHub Actions**

1. Go to your GitHub repository
2. **Settings** → **Actions** → **General**
3. Enable "Allow all actions and reusable workflows"
4. Save

### **Step 2: Add Secrets to GitHub**

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Any other API keys you need

### **Step 3: Set Up Branch Protection**

1. Go to: **Settings** → **Branches**
2. Click **"Add branch protection rule"**
3. Branch name pattern: `main` (or `master`)
4. Enable these settings:

   **Protect matching branches:**
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

5. **Required status checks** (add these):
   - `Unit Tests`
   - `Integration Tests`
   - `Smoke Tests`
   - `Security Scan`
   - `Build Check`

6. Click **"Create"**

---

## 📋 Status Checks in GitHub Actions

The workflow (`.github/workflows/pr-checks.yml`) creates these checks:

1. **Unit Tests** - Runs `npm test`
2. **Integration Tests** - Runs `npm run test:integration`
3. **Smoke Tests** - Runs `npm run test:smoke`
4. **Security Scan** - Checks for secrets, runs npm audit
5. **Build Check** - Runs `npm run build`

---

## 🚀 Canary Deployment

The canary workflow (`.github/workflows/canary-deployment.yml`):
- Deploys to canary environment
- Runs health checks for 10 minutes
- Only deploys to production if health checks pass

**To customize:**
- Update deployment commands
- Update health check URLs
- Adjust timing as needed

---

## ✅ Next Steps

### **1. Add Real Tests:**
Replace placeholder test commands in `package.json`:
```json
"test": "jest",
"test:integration": "jest --config jest.integration.config.js",
"test:smoke": "node scripts/smoke-tests.js"
```

### **2. Push to GitHub:**
```bash
git add .
git commit -m "Add PR requirements and status checks"
git push
```

### **3. Set Up Branch Protection:**
- Follow Step 3 above
- Add the required status checks

### **4. Test It:**
- Create a test PR
- Verify checks run
- Verify PR can't merge until checks pass

---

## 📝 PR Template Usage

When someone creates a PR, GitHub will automatically:
1. Show the PR template
2. Require checklist items to be checked
3. Block merge until all checks pass

---

## 🔒 Security Notes

**Never commit:**
- API keys
- Passwords
- Secrets

**Use GitHub Secrets instead:**
- Settings → Secrets and variables → Actions
- Add secrets there
- Reference in workflows: `${{ secrets.SECRET_NAME }}`

---

**Status:** Ready to set up  
**Next:** Push to GitHub, enable branch protection, add secrets

