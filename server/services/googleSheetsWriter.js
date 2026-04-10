const axios = require('axios');
require('dotenv').config();

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

async function appendClergyToSheet(clergyData) {
  console.log('\n--- Google Sheets Writer: START ---');
  
  try {
    if (!APPS_SCRIPT_URL) {
      console.error('FATAL: GOOGLE_APPS_SCRIPT_URL is not configured');
      throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured. Please see GOOGLE_APPS_SCRIPT_SETUP.md');
    }

    console.log('Apps Script URL configured:', APPS_SCRIPT_URL.substring(0, 50) + '...');

    const payload = {
      name: clergyData.name,
      title: clergyData.title,
      languages: clergyData.languages,
      deber: clergyData.deber,
      address: clergyData.address,
      city: clergyData.city,
      phoneNumber: clergyData.phoneNumber,
      email: clergyData.email,
      bio: clergyData.bio,
      imageData: clergyData.imageData,
      imageName: clergyData.imageName
    };

    console.log('Payload prepared:');
    console.log('  - Name:', payload.name);
    console.log('  - Has image data:', !!payload.imageData);
    console.log('  - Image name:', payload.imageName || 'N/A');
    console.log('  - Image data length:', payload.imageData ? payload.imageData.length : 0, 'characters');
    
    if (payload.imageData) {
      console.log('  - First 50 chars of base64:', payload.imageData.substring(0, 50) + '...');
    }

    console.log('Sending POST request to Apps Script...');
    const startTime = Date.now();
    
    const response = await axios.post(APPS_SCRIPT_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    const duration = Date.now() - startTime;
    console.log(`Apps Script responded in ${duration}ms`);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data));

    if (response.data.success) {
      console.log('✓ SUCCESS: Data appended to sheet');
      console.log('  - Picture URL:', response.data.pictureUrl || 'No URL returned');
      console.log('--- Google Sheets Writer: END (SUCCESS) ---\n');
      return { success: true, data: response.data };
    } else {
      console.error('✗ FAILED: Apps Script returned success=false');
      console.error('  - Message:', response.data.message);
      throw new Error(response.data.message || 'Failed to append to Google Sheets');
    }
  } catch (error) {
    console.error('\n✗✗✗ ERROR in Google Sheets Writer ✗✗✗');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('HTTP Response Error:');
      console.error('  - Status:', error.response.status);
      console.error('  - Status text:', error.response.statusText);
      console.error('  - Response data:', JSON.stringify(error.response.data).substring(0, 500));
      console.error('  - Response headers:', JSON.stringify(error.response.headers));
    } else if (error.request) {
      console.error('No response received from Apps Script');
      console.error('  - Request was made but no response');
      console.error('  - Possible network issue or timeout');
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    console.error('Full error stack:', error.stack);
    console.error('--- Google Sheets Writer: END (FAILED) ---\n');
    throw error;
  }
}

module.exports = { appendClergyToSheet };
