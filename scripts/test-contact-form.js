#!/usr/bin/env node

/**
 * Manual test script for the contact form Formspree integration
 * This script tests the contact form API endpoint to ensure it works correctly
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/contact';

const testFormData = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'Test Company',
  projectType: 'web-development',
  budget: '$5000-$10000',
  message: 'This is a test message to verify the Formspree integration is working correctly.',
};

async function testContactForm() {
  console.log('🧪 Testing Contact Form Formspree Integration...\n');

  try {
    // First, get a CSRF token
    console.log('1. Fetching CSRF token...');
    const csrfResponse = await fetch(`${API_URL}/csrf`);

    if (!csrfResponse.ok) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status}`);
    }

    const { token } = await csrfResponse.json();
    console.log('✅ CSRF token obtained successfully\n');

    // Test the contact form submission
    console.log('2. Testing contact form submission...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      },
      body: JSON.stringify(testFormData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Contact form submission successful!');
      console.log(`📧 Message: ${result.message}`);
      console.log('\n🎉 Formspree integration is working correctly!');
    } else {
      console.log('❌ Contact form submission failed:');
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, result);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure the development server is running on http://localhost:3001');
  }
}

// Run the test
testContactForm();
