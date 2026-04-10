// ============================================
// BLOG POSTS APPS SCRIPT - COMPLETELY SEPARATE FROM CLERGY SYSTEM
// This script handles blog/knowledge base posts stored as Google Docs with markdown
// ============================================

// Toggle logging on/off - set to false to disable all logging
var LOGGING_ENABLED = true;

// Helper function to log to spreadsheet
function log(message) {
  // Check if logging is enabled
  if (!LOGGING_ENABLED) {
    return;
  }
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName('BlogLog');
    
    if (!logSheet) {
      logSheet = ss.insertSheet('BlogLog');
      logSheet.appendRow(['Timestamp', 'Execution ID', 'Message']);
    }
    
    var executionId = Utilities.getUuid().substring(0, 8);
    logSheet.appendRow([new Date(), executionId, message]);
  } catch (e) {
    // Fail silently to not break main flow
  }
}

// ============================================
// GET REQUEST - Read blog posts or individual post content
// ============================================
function doGet(e) {
  var execId = Utilities.getUuid().substring(0, 8);
  log('=== BLOG GET REQUEST [' + execId + '] ===');
  
  try {
    // Route to appropriate handler based on action parameter
    if (e && e.parameter && e.parameter.action === 'getPosts') {
      log('[' + execId + '] Routing to getBlogPosts');
      return getBlogPosts(execId);
    }
    
    if (e && e.parameter && e.parameter.action === 'getPost' && e.parameter.id) {
      log('[' + execId + '] Routing to getBlogPost with ID: ' + e.parameter.id);
      return getBlogPost(e.parameter.id, execId);
    }
    
    // Default: return error if no valid action
    log('[' + execId + '] ERROR: No valid action parameter provided');
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: 'Invalid request. Use ?action=getPosts or ?action=getPost&id=FILE_ID' 
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    log('[' + execId + '] ERROR in doGet: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: 'Server error: ' + error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GET ALL BLOG POSTS (metadata only, not content)
// ============================================
function getBlogPosts(execId) {
  try {
    log('[' + execId + '] Fetching blog posts from Blog sheet');
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Blog');
    
    if (!sheet) {
      log('[' + execId + '] ERROR: Blog sheet not found');
      return ContentService.createTextOutput(
        JSON.stringify({ 
          success: false, 
          message: 'Blog sheet not found. Please create a sheet named "Blog"' 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      log('[' + execId + '] No blog posts found (only headers or empty sheet)');
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, data: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0];
    log('[' + execId + '] Headers: ' + headers.join(', '));
    
    // Filter for published posts only (status column = 'published')
    var rows = data.slice(1).filter(function(r) { 
      return r[5] === 'published'; // Column F (index 5) is status
    });
    
    log('[' + execId + '] Found ' + rows.length + ' published posts');
    
    // Map rows to post objects
    var posts = rows.map(function(row, index) {
      return {
        id: index + 1,
        title: row[0] || '',           // Column A
        date: row[1] || '',             // Column B
        author: row[2] || '',           // Column C
        summary: row[3] || '',          // Column D
        fileId: row[4] || '',           // Column E
        status: row[5] || '',           // Column F
        coverImage: row[6] || '',       // Column G
        tags: row[7] ? row[7].split(',').map(function(t) { return t.trim(); }) : [] // Column H
      };
    });
    
    log('[' + execId + '] Successfully prepared ' + posts.length + ' posts');
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, data: posts })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    log('[' + execId + '] ERROR in getBlogPosts: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: 'Error fetching blog posts: ' + error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GET INDIVIDUAL BLOG POST CONTENT (Google Doc with markdown)
// ============================================
function getBlogPost(fileId, execId) {
  try {
    log('[' + execId + '] Fetching Google Doc content for file ID: ' + fileId);
    
    // Open the Google Doc
    var doc = DocumentApp.openById(fileId);
    log('[' + execId + '] Document found: ' + doc.getName());
    
    // Get the document body as plain text (preserves markdown formatting)
    var body = doc.getBody();
    var content = body.getText();
    log('[' + execId + '] Content length: ' + content.length + ' characters');
    
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: true, 
        content: content,
        fileName: doc.getName()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    log('[' + execId + '] ERROR in getBlogPost: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        message: 'Error fetching blog post: ' + error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
