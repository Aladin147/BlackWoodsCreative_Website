#!/usr/bin/env node

/**
 * Test the contact API route directly
 * This tests our API implementation with Formspree integration
 */

// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:3001';

const testFormData = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'Test Company',
  projectType: 'web-development',
  budget: '$5000-$10000',
  message: 'This is a test message to verify our API route works with Formspree.',
};

async function testContactAPI() {
  console.log('🧪 Testing Contact API Route...\n');

  try {
    // First, try to get CSRF token
    console.log('1. Attempting to get CSRF token...');
    try {
      const csrfResponse = await fetch(`${API_BASE}/api/contact/csrf`);
      if (csrfResponse.ok) {
        const { token } = await csrfResponse.json();
        console.log('✅ CSRF token obtained successfully');

        // Test with CSRF token
        console.log('\n2. Testing contact form with CSRF token...');
        const response = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          },
          body: JSON.stringify(testFormData),
        });

        const result = await response.json();
        console.log(`📊 Status: ${response.status}`);
        console.log('📨 Response:', JSON.stringify(result, null, 2));

        if (response.ok && result.success) {
          console.log('\n✅ SUCCESS: Contact API is working correctly!');
        } else {
          console.log('\n⚠️  API Response indicates an issue');
        }
      } else {
        console.log('❌ Could not get CSRF token, trying without...');
        throw new Error('CSRF token unavailable');
      }
    } catch (csrfError) {
      console.log('⚠️  CSRF token failed, testing without CSRF...');

      // Test without CSRF token (might be blocked by middleware)
      console.log('\n2. Testing contact form without CSRF token...');
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testFormData),
      });

      const result = await response.json();
      console.log(`📊 Status: ${response.status}`);
      console.log('📨 Response:', JSON.stringify(result, null, 2));

      if (response.status === 403) {
        console.log('\n🔒 CSRF protection is working (this is expected)');
        console.log('💡 The API route is properly secured');
      } else if (response.ok && result.success) {
        console.log('\n✅ SUCCESS: Contact API is working!');
      } else {
        console.log('\n❌ Unexpected response from API');
      }
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3001');
    console.log('💡 Check if there are any middleware issues (Redis configuration)');
  }
}

// Run the test
testContactAPI();
