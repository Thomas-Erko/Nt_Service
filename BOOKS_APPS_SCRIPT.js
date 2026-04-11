/**
 * BOOK RECOMMENDATIONS APPS SCRIPT
 * 
 * This script manages book recommendations for the Ethiopian Orthodox Tewahedo Church.
 * It is completely separate from the clergy and blog systems.
 * 
 * SETUP:
 * 1. Create a Google Sheet with columns: title, author, year, genre, language, difficulty, 
 *    pages, synopsis, whyRead, eotcRelevance, rating, link, Cover Image Link
 * 2. Deploy this script as a web app
 * 3. Set the SHEET_ID constant below to your Google Sheet ID
 * 4. Add the deployed URL to your server's .env file as BOOKS_APPS_SCRIPT_URL
 */

// ============================================
// CONFIGURATION
// ============================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Sheet ID
const SHEET_NAME = 'Books'; // Name of the sheet tab
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
    const action = e.parameter.action || 'getBooks';
    
    if (action === 'getBooks') {
      return getBooks();
    } else {
      return createResponse(false, 'Unknown action: ' + action);
    }
  } catch (error) {
    logToSheet('Error in doGet: ' + error.toString(), 'ERROR');
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

// ============================================
// GET BOOKS
// ============================================

function getBooks() {
  try {
    logToSheet('Fetching books from sheet...');
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      logToSheet('No books found in sheet');
      return createResponse(true, 'No books found', []);
    }
    
    // Get headers from first row
    const headers = data[0];
    
    // Map data to objects
    const books = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row[0]) continue;
      
      const book = {
        id: i,
        title: row[0] || '',
        author: row[1] || '',
        year: row[2] || '',
        genre: row[3] || '',
        language: row[4] || '',
        difficulty: row[5] || '',
        pages: row[6] || '',
        synopsis: row[7] || '',
        whyRead: row[8] || '',
        eotcRelevance: row[9] || '',
        rating: row[10] || '',
        link: row[11] || '',
        coverImage: row[12] || ''
      };
      
      books.push(book);
    }
    
    logToSheet('Successfully fetched ' + books.length + ' books');
    return createResponse(true, 'Books fetched successfully', books);
    
  } catch (error) {
    logToSheet('Error fetching books: ' + error.toString(), 'ERROR');
    return createResponse(false, 'Error fetching books: ' + error.toString());
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

function testGetBooks() {
  const result = getBooks();
  Logger.log(result.getContent());
}
