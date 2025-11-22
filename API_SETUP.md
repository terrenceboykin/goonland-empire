# API Key Setup Guide for O'Danny Boy Estimator

## Quick Setup for Google Gemini API

### Step 1: Get Your API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

### Step 2: Create Environment File

In the project root (`/Users/terrenceboykin/.gemini/antigravity/scratch/odanny-boy-xactimate-killer/`):

```bash
# Copy the example file
cp .env.local.example .env.local

# Then edit .env.local and add your key:
GOOGLE_GEMINI_API_KEY=paste_your_key_here
```

### Step 3: Verify It Works

The `.env.local` file is already in `.gitignore`, so it won't be committed to git.

**Important Notes:**
- ✅ `.env.local` is gitignored (safe to put keys here)
- ❌ Never commit `.env.local` to git
- ✅ Use `process.env.GOOGLE_GEMINI_API_KEY` in server-side code
- ❌ Don't use API keys directly in client-side code (use API routes instead)

### Step 4: Using the API Key in Code

**Server-side (API routes, server components):**
```typescript
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
```

**Client-side (needs API route wrapper):**
Create an API route at `src/app/api/analyze/route.ts` that uses the key server-side, then call that route from the client.

### Troubleshooting

**"API key not found" error:**
- Make sure `.env.local` exists in the project root
- Make sure the variable name is exactly: `GOOGLE_GEMINI_API_KEY`
- Restart your dev server after creating/modifying `.env.local`
- Check that there are no spaces around the `=` sign

**"Invalid API key" error:**
- Verify the key is correct (no extra spaces)
- Check that the key is active in Google Cloud Console
- Make sure you're using the right API (Gemini, not Vertex AI)

### For AI Assistants

If you're an AI assistant working on this project:
1. Check if `.env.local` exists
2. If not, guide the user to create it using the steps above
3. Never hardcode API keys in source files
4. Always use environment variables
5. See `src/lib/gemini-api.ts` for example usage


