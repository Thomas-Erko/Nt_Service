const axios = require('axios');
const path = require('path');
// Load .env from the server directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

async function getClergyFromSheet() {
  try {
    if (!APPS_SCRIPT_URL) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured in .env file');
    }

    // Use Google Apps Script endpoint to read data
    console.log('Fetching clergy data from Google Apps Script...');
    const response = await axios.get(APPS_SCRIPT_URL);
    
    console.log('Apps Script response status:', response.status);
    console.log('Apps Script response data:', JSON.stringify(response.data).substring(0, 200));
    
    if (response.data.success && response.data.data) {
      const clergy = response.data.data;
      console.log(`Fetched ${clergy.length} clergy members from Google Sheets via Apps Script`);
      return clergy;
    } else {
      throw new Error(response.data.message || 'Failed to fetch data from Apps Script');
    }
    
  } catch (error) {
    console.error('Error fetching from Google Apps Script:', error.message);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', JSON.stringify(error.response.data).substring(0, 300));
    }
    
    // Return fallback data if Apps Script fails
    console.log('Falling back to local JSON data');
    try {
      const fs = require('fs');
      const path = require('path');
      const fallbackData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/clergy.json'), 'utf-8')
      );
      return fallbackData;
    } catch (fallbackError) {
      console.error('Fallback data also failed:', fallbackError.message);
      return [];
    }
  }
}

module.exports = { getClergyFromSheet };
