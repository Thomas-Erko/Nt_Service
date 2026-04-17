/**
 * YOUTH GROUPS APPS SCRIPT
 * 
 * This script manages youth group recommendations for the Ethiopian Orthodox Tewahedo Church.
 * It is completely separate from the clergy, blog, and book systems.
 * 
 * SETUP:
 * 1. Create a Google Sheet with columns: name, acronym, city, state, description, address,
 *    instagram, youtube, tiktok, phone, email, status
 * 2. Deploy this script as a web app
 * 3. Set the SHEET_ID constant below to your Google Sheet ID
 * 4. Add the deployed URL to your server's .env file as YOUTH_GROUPS_APPS_SCRIPT_URL
 */

// ============================================
// CONFIGURATION
// ============================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Sheet ID
const SHEET_NAME = 'Youth Groups'; // Name of the sheet tab
const LOGGING_ENABLED = true; // Set to false to disable logging

// ============================================
// LOGGING FUNCTIONS
// ============================================

function logToSheet(message, level = 'INFO') {
  if (!LOGGING_ENABLED) return;
  
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let logSheet = ss.getSheetByName('Log');
    
    if (!logSheet) {
      logSheet = ss.insertSheet('Log');
      logSheet.appendRow(['Timestamp', 'Level', 'Message']);
    }
    
    logSheet.appendRow([new Date(), level, message]);
  } catch (error) {
    console.error('Failed to log:', error);
  }
}

// ============================================
// MAIN HANDLER
// ============================================

function doGet(e) {
  logToSheet('Received GET request: ' + JSON.stringify(e.parameter));
  
  try {
    const action = e.parameter.action || 'getYouthGroups';
    
    if (action === 'getYouthGroups') {
      return getYouthGroups();
    } else {
      return createResponse(false, 'Unknown action: ' + action);
    }
  } catch (error) {
    logToSheet('Error in doGet: ' + error.toString(), 'ERROR');
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

// ============================================
// GET YOUTH GROUPS
// ============================================

function getYouthGroups() {
  try {
    logToSheet('Fetching youth groups from sheet...');
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      logToSheet('No youth groups found in sheet');
      return createResponse(true, 'No youth groups found', []);
    }
    
    // Get headers from first row
    const headers = data[0];
    
    // Map data to objects
    const youthGroups = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row[0]) continue;
      
      // Only include published groups
      const status = row[11] || '';
      if (status.toLowerCase() !== 'published') continue;
      
      const group = {
        id: i,
        name: row[0] || '',
        acronym: row[1] || '',
        city: row[2] || '',
        state: row[3] || '',
        description: row[4] || '',
        address: row[5] || '',
        instagram: row[6] || '',
        youtube: row[7] || '',
        tiktok: row[8] || '',
        phone: row[9] || '',
        email: row[10] || '',
        status: row[11] || ''
      };
      
      youthGroups.push(group);
    }
    
    logToSheet('Successfully fetched ' + youthGroups.length + ' youth groups');
    return createResponse(true, 'Youth groups fetched successfully', youthGroups);
    
  } catch (error) {
    logToSheet('Error fetching youth groups: ' + error.toString(), 'ERROR');
    return createResponse(false, 'Error fetching youth groups: ' + error.toString());
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TEST FUNCTIONS (for debugging)
// ============================================

function testGetYouthGroups() {
  const result = getYouthGroups();
  Logger.log(result.getContent());
}
