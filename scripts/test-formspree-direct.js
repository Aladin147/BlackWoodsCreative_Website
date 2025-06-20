#!/usr/bin/env node

/**
 * Direct test of Formspree endpoint to verify it's working correctly
 * This bypasses our API route to test Formspree directly
 */

const https = require('https');

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzzgagbb';

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  company: 'Test Company',
  projectType: 'web-development',
  budget: '$5000-$10000',
  message: 'This is a direct test of the Formspree endpoint to verify it works correctly with improved spam protection.',
  _subject: 'New Contact Form Submission from Test User',
  _replyto: 'test@example.com',
  _next: 'https://blackwoodscreative.com/thank-you',
  // Using JSON format (default) for better deliverability
};

function testFormspreeEndpoint() {
  console.log('🧪 Testing Formspree Endpoint Directly...\n');
  console.log(`📡 Endpoint: ${FORMSPREE_ENDPOINT}`);
  console.log('📝 Test Data:', JSON.stringify(testData, null, 2));
  console.log('\n⏳ Sending request...\n');

  const postData = JSON.stringify(testData);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'BlackWoods-Creative-Website-Test/1.0',
    },
  };

  const req = https.request(FORMSPREE_ENDPOINT, options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📨 Response Body:');
      try {
        const jsonResponse = JSON.parse(data);
        console.log(JSON.stringify(jsonResponse, null, 2));
        
        if (res.statusCode === 200 && jsonResponse.ok) {
          console.log('\n✅ SUCCESS: Formspree endpoint is working correctly!');
          console.log('🎉 Contact form integration is properly configured.');
        } else {
          console.log('\n❌ ISSUE: Unexpected response from Formspree');
          console.log('💡 Check the endpoint URL and form configuration');
        }
      } catch (error) {
        console.log('Raw response:', data);
        console.log('\n❌ ERROR: Could not parse JSON response');
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ REQUEST ERROR:', error.message);
    console.log('💡 Check your internet connection and the Formspree endpoint URL');
  });

  req.write(postData);
  req.end();
}

// Run the test
testFormspreeEndpoint();
