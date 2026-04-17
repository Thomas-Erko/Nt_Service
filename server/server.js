const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { appendClergyToSheet } = require('./services/googleSheetsWriter');
const { getClergyFromSheet } = require('./services/googleSheetsReader');
const { uploadImageToImgBB } = require('./services/imageUpload');
// Load .env from the server directory, not the current working directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/clergy', async (req, res) => {
  try {
    const { language, church } = req.query;
    
    let clergyData = await getClergyFromSheet();
    
    if (language) {
      clergyData = clergyData.filter(clergy =>
        clergy.languages.includes(language)
      );
    }
    
    if (church) {
      clergyData = clergyData.filter(clergy =>
        clergy.church === church
      );
    }
    
    res.json(clergyData);
  } catch (error) {
    console.error('Error fetching clergy:', error);
    res.status(500).json({ error: 'Failed to fetch clergy data' });
  }
});

app.get('/api/clergy/:id', async (req, res) => {
  try {
    const clergyData = await getClergyFromSheet();
    const clergy = clergyData.find(c => c.id === parseInt(req.params.id));
    
    if (!clergy) {
      return res.status(404).json({ message: 'Clergy not found' });
    }
    
    res.json(clergy);
  } catch (error) {
    console.error('Error fetching clergy:', error);
    res.status(500).json({ error: 'Failed to fetch clergy data' });
  }
});

app.post('/api/clergy/submit', upload.single('picture'), async (req, res) => {
  console.log('\n========== NEW CLERGY SUBMISSION ==========');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const { name, title, languages, deber, address, city, phoneNumber, email, bio } = req.body;
    console.log('Step 1: Received form data');
    console.log('  - Name:', name);
    console.log('  - Title:', title);
    console.log('  - Languages:', languages);
    console.log('  - Church:', deber);
    console.log('  - City:', city);
    
    let imageData = null;
    let imageName = null;
    
    if (req.file) {
      console.log('Step 2: Image file detected');
      console.log('  - Original filename:', req.file.originalname);
      console.log('  - Mimetype:', req.file.mimetype);
      console.log('  - Size:', req.file.size, 'bytes');
      console.log('  - Buffer length:', req.file.buffer.length);
      
      try {
        // Convert image buffer to base64
        imageData = req.file.buffer.toString('base64');
        imageName = `${name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
        console.log('Step 3: Image converted to base64');
        console.log('  - Base64 length:', imageData.length, 'characters');
        console.log('  - Generated filename:', imageName);
      } catch (conversionError) {
        console.error('ERROR in Step 3: Failed to convert image to base64');
        console.error('  - Error:', conversionError.message);
        console.error('  - Stack:', conversionError.stack);
        throw conversionError;
      }
    } else {
      console.log('Step 2: No image file provided');
    }
    
    const clergyData = {
      name,
      languages,
      deber,
      address,
      city,
      phoneNumber,
      email,
      bio,
      imageData,
      imageName
    };
    
    console.log('Step 4: Preparing to send to Google Apps Script');
    console.log('  - Has image data:', !!imageData);
    console.log('  - Image name:', imageName || 'N/A');
    
    const result = await appendClergyToSheet(clergyData);
    
    console.log('Step 5: Successfully received response from Apps Script');
    console.log('  - Success:', result.success);
    console.log('  - Picture URL:', result.data.pictureUrl || 'No URL returned');
    console.log('========== SUBMISSION COMPLETE ==========\n');
    
    res.json({ 
      success: true, 
      message: 'Clergy member added successfully!', 
      pictureUrl: result.data.pictureUrl 
    });
  } catch (error) {
    console.error('\n========== SUBMISSION FAILED ==========');
    console.error('Error in /api/clergy/submit endpoint');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('========================================\n');
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit clergy data', 
      error: error.message 
    });
  }
});

// Contact clergy endpoint
app.post('/api/contact-clergy', async (req, res) => {
  console.log('\n========== CONTACT CLERGY REQUEST ==========');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const { name, phoneNumber, message, clergyName, clergyId } = req.body;
    console.log('Contact request for:', clergyName);
    console.log('From:', name, phoneNumber);
    console.log('Message:', message);
    
    // For now, just log the contact request
    // In the future, you could:
    // - Send an email to the clergy member
    // - Store in a database
    // - Send SMS notification
    
    res.json({ 
      success: true, 
      message: 'Contact request received successfully' 
    });
  } catch (error) {
    console.error('Error processing contact request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
});

// ============================================
// BLOG/KNOWLEDGE BASE ENDPOINTS - COMPLETELY SEPARATE FROM CLERGY SYSTEM
// ============================================

// Get all blog posts (metadata only)
app.get('/api/blog/posts', async (req, res) => {
  try {
    console.log('=== BLOG POSTS REQUEST START ===');
    
    const BLOG_APPS_SCRIPT_URL = process.env.BLOG_APPS_SCRIPT_URL;
    console.log('BLOG_APPS_SCRIPT_URL from env:', BLOG_APPS_SCRIPT_URL);
    
    if (!BLOG_APPS_SCRIPT_URL) {
      console.error('BLOG_APPS_SCRIPT_URL not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Blog system not configured. Please set BLOG_APPS_SCRIPT_URL in .env' 
      });
    }
    
    const fullUrl = `${BLOG_APPS_SCRIPT_URL}?action=getPosts`;
    console.log('Fetching from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Full response text:', responseText);
      throw new Error('Apps Script returned non-JSON response: ' + responseText.substring(0, 200));
    }
    
    console.log('Blog posts response:', data.success ? `${data.data.length} posts` : 'Failed');
    console.log('=== BLOG POSTS REQUEST END ===');
    res.json(data);
    
  } catch (error) {
    console.error('=== ERROR IN BLOG POSTS ENDPOINT ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog posts: ' + error.message
    });
  }
});

// Get individual blog post content (markdown)
app.get('/api/blog/post/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log('=== BLOG POST CONTENT REQUEST START ===');
    console.log('File ID:', fileId);
    
    const BLOG_APPS_SCRIPT_URL = process.env.BLOG_APPS_SCRIPT_URL;
    console.log('BLOG_APPS_SCRIPT_URL from env:', BLOG_APPS_SCRIPT_URL);
    
    if (!BLOG_APPS_SCRIPT_URL) {
      console.error('BLOG_APPS_SCRIPT_URL not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Blog system not configured. Please set BLOG_APPS_SCRIPT_URL in .env' 
      });
    }
    
    const fullUrl = `${BLOG_APPS_SCRIPT_URL}?action=getPost&id=${fileId}`;
    console.log('Fetching from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Full response text:', responseText);
      throw new Error('Apps Script returned non-JSON response: ' + responseText.substring(0, 200));
    }
    
    console.log('Blog post content response:', data.success ? 'Success' : 'Failed');
    console.log('=== BLOG POST CONTENT REQUEST END ===');
    res.json(data);
    
  } catch (error) {
    console.error('=== ERROR IN BLOG POST ENDPOINT ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog post content: ' + error.message
    });
  }
});

// ============================================
// BOOK RECOMMENDATIONS ENDPOINTS - COMPLETELY SEPARATE SYSTEM
// ============================================

// Get all book recommendations
app.get('/api/books', async (req, res) => {
  try {
    console.log('=== BOOKS REQUEST START ===');
    
    const BOOKS_APPS_SCRIPT_URL = process.env.BOOKS_APPS_SCRIPT_URL;
    console.log('BOOKS_APPS_SCRIPT_URL from env:', BOOKS_APPS_SCRIPT_URL);
    
    if (!BOOKS_APPS_SCRIPT_URL) {
      console.error('BOOKS_APPS_SCRIPT_URL not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Book recommendations system not configured. Please set BOOKS_APPS_SCRIPT_URL in .env' 
      });
    }
    
    const fullUrl = `${BOOKS_APPS_SCRIPT_URL}?action=getBooks`;
    console.log('Fetching from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      throw new Error('Apps Script returned non-JSON response: ' + responseText.substring(0, 200));
    }
    
    console.log('Books response:', data.success ? `${data.data.length} books` : 'Failed');
    console.log('=== BOOKS REQUEST END ===');
    res.json(data);
    
  } catch (error) {
    console.error('=== ERROR IN BOOKS ENDPOINT ===');
    console.error('Error message:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch books: ' + error.message
    });
  }
});

// ============================================
// YOUTH GROUPS ENDPOINTS - COMPLETELY SEPARATE SYSTEM
// ============================================

// Get all youth groups
app.get('/api/youth-groups', async (req, res) => {
  try {
    console.log('=== YOUTH GROUPS REQUEST START ===');
    
    const YOUTH_GROUPS_APPS_SCRIPT_URL = process.env.YOUTH_GROUPS_APPS_SCRIPT_URL;
    console.log('YOUTH_GROUPS_APPS_SCRIPT_URL from env:', YOUTH_GROUPS_APPS_SCRIPT_URL);
    
    if (!YOUTH_GROUPS_APPS_SCRIPT_URL) {
      console.error('YOUTH_GROUPS_APPS_SCRIPT_URL not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Youth groups system not configured. Please set YOUTH_GROUPS_APPS_SCRIPT_URL in .env' 
      });
    }
    
    const fullUrl = `${YOUTH_GROUPS_APPS_SCRIPT_URL}?action=getYouthGroups`;
    console.log('Fetching from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      throw new Error('Apps Script returned non-JSON response: ' + responseText.substring(0, 200));
    }
    
    console.log('Youth groups response:', data.success ? `${data.data.length} groups` : 'Failed');
    console.log('=== YOUTH GROUPS REQUEST END ===');
    res.json(data);
    
  } catch (error) {
    console.error('=== ERROR IN YOUTH GROUPS ENDPOINT ===');
    console.error('Error message:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch youth groups: ' + error.message
    });
  }
});

// ============================================
// SERVE REACT PRODUCTION BUILD
// ============================================

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing - return all non-API requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
