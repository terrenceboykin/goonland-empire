#!/usr/bin/env node

/**
 * Smoke Tests - Validates critical external integrations
 * Run: npm run smoke
 */

const https = require('https');
const http = require('http');

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let testsPassed = 0;
let testsFailed = 0;
const errors = [];

function test(name, fn) {
  return new Promise((resolve) => {
    fn()
      .then(() => {
        console.log(`✅ ${name}`);
        testsPassed++;
        resolve(true);
      })
      .catch((error) => {
        console.error(`❌ ${name}: ${error.message}`);
        errors.push({ test: name, error: error.message });
        testsFailed++;
        resolve(false);
      });
  });
}

async function checkEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, APP_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      if (res.statusCode === expectedStatus || res.statusCode < 400) {
        resolve(true);
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function checkEnvVar(name, required = true) {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  if (value && value.includes('your_') || value.includes('placeholder')) {
    throw new Error(`Env var ${name} contains placeholder value`);
  }
  return true;
}

async function runSmokeTests() {
  console.log('🔥 Running Smoke Tests...\n');

  // 1. Environment Variables
  await test('Environment: GOOGLE_GEMINI_API_KEY exists', () => checkEnvVar('GOOGLE_GEMINI_API_KEY'));
  await test('Environment: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY exists', () => checkEnvVar('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'));
  await test('Environment: GOOGLE_GEMINI_API_KEY is valid format', () => {
    if (!GEMINI_KEY || GEMINI_KEY.length < 20) {
      throw new Error('Invalid API key format');
    }
    return Promise.resolve();
  });
  await test('Environment: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is valid format', () => {
    if (!MAPS_KEY || MAPS_KEY.length < 20) {
      throw new Error('Invalid Maps API key format');
    }
    return Promise.resolve();
  });

  // 2. API Endpoints (if server is running)
  if (APP_URL.includes('localhost') || APP_URL.includes('127.0.0.1')) {
    await test('Endpoint: /api/analyze exists', () => checkEndpoint('/api/analyze', 405)); // 405 = method not allowed (endpoint exists)
    await test('Endpoint: /api/chat exists', () => checkEndpoint('/api/chat', 405));
    await test('Endpoint: /api/leads exists', () => checkEndpoint('/api/leads', 200));
    await test('Endpoint: Homepage loads', () => checkEndpoint('/', 200));
    await test('Endpoint: /storm page loads', () => checkEndpoint('/storm', 200));
    await test('Endpoint: /super-dashboard loads', () => checkEndpoint('/super-dashboard', 200));
  } else {
    console.log('⚠️  Skipping endpoint tests (not localhost)');
  }

  // 3. Google Maps API Key Validation
  await test('Google Maps: API key format valid', () => {
    if (!MAPS_KEY || !MAPS_KEY.startsWith('AIza')) {
      throw new Error('Maps API key should start with AIza');
    }
    return Promise.resolve();
  });

  // 4. Gemini API Key Validation
  await test('Gemini: API key format valid', () => {
    if (!GEMINI_KEY || !GEMINI_KEY.startsWith('AIza')) {
      throw new Error('Gemini API key should start with AIza');
    }
    return Promise.resolve();
  });

  console.log('\n📊 Results:');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);

  if (testsFailed > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`);
    });
    process.exit(1);
  }

  console.log('\n✅ All smoke tests passed!');
  process.exit(0);
}

runSmokeTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

