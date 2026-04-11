# Book Recommendations System Setup Guide

This guide will help you set up the Book Recommendations system for your website. This system is completely separate from the clergy and blog systems.

## Overview

The Book Recommendations system consists of:
- A Google Sheet to store book data
- A Google Apps Script to serve the data
- Backend API endpoints in your Node.js server
- A React frontend page to display the books

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "EOTC Book Recommendations"
4. Create a sheet tab named **"Books"**
5. Add the following column headers in the first row:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| title | author | year | genre | language | difficulty | pages | synopsis | whyRead | eotcRelevance | rating | link | Cover Image Link |

### Column Descriptions:
- **title**: Book title
- **author**: Author name
- **year**: Publication year
- **genre**: Genre (e.g., History, Theology, Biography)
- **language**: Language (e.g., English, Amharic)
- **difficulty**: Reading level (Beginner, Intermediate, Advanced)
- **pages**: Number of pages
- **synopsis**: Brief description of the book
- **whyRead**: Why this book is recommended
- **eotcRelevance**: How it relates to EOTC (High, Medium, Low)
- **rating**: Star rating (1-5)
- **link**: Purchase/info link (Amazon, etc.)
- **Cover Image Link**: URL to book cover image

6. Add your book data starting from row 2

---

## Step 2: Get Sheet ID

1. Look at your Google Sheet URL
2. It will look like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the `SHEET_ID_HERE` part
4. Save this for the next step

---

## Step 3: Deploy Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy the entire contents of `BOOKS_APPS_SCRIPT.js` from your project
4. Paste it into the Apps Script editor
5. **IMPORTANT**: Update the `SHEET_ID` constant at the top:
   ```javascript
   const SHEET_ID = 'YOUR_ACTUAL_SHEET_ID_HERE';
   ```
6. Click **Save** (disk icon)
7. Click **Deploy** → **New deployment**
8. Click the gear icon next to "Select type"
9. Choose **Web app**
10. Configure:
    - Description: "Book Recommendations API"
    - Execute as: **Me**
    - Who has access: **Anyone**
11. Click **Deploy**
12. Click **Authorize access**
13. Choose your Google account
14. Click **Advanced** → **Go to [project name] (unsafe)**
15. Click **Allow**
16. Copy the **Web app URL** (it will look like `https://script.google.com/macros/s/...`)

---

## Step 4: Update Server Environment Variables

### On Your Local Machine:

1. Open `server/.env`
2. Add this line:
   ```
   BOOKS_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
   ```
3. Replace `YOUR_COPIED_URL` with the actual URL from Step 3

### On AWS Lightsail:

1. SSH into your server
2. Edit the .env file:
   ```bash
   nano ~/Nt_Service/server/.env
   ```
3. Add the same line:
   ```
   BOOKS_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
   ```
4. Save and exit (Ctrl+X, Y, Enter)
5. Restart PM2:
   ```bash
   pm2 restart nighttime-service
   ```

---

## Step 5: Test the System

### Test Apps Script Directly:

Open this URL in your browser (replace with your actual URL):
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getBooks
```

You should see JSON output like:
```json
{
  "success": true,
  "message": "Books fetched successfully",
  "data": [...]
}
```

### Test Backend API:

```bash
curl http://localhost:5000/api/books
```

Or on AWS:
```bash
curl http://localhost:8080/api/books
```

### Test Frontend:

1. Start your dev server: `npm run dev`
2. Navigate to `/resources`
3. Click on "Book Recommendations"
4. You should see your books displayed

---

## Step 6: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add book recommendations system"
git push

# On AWS
cd ~/Nt_Service
./deploy.sh
```

---

## Troubleshooting

### Books not showing up:

1. Check PM2 logs: `pm2 logs nighttime-service`
2. Verify `BOOKS_APPS_SCRIPT_URL` is set in `.env`
3. Test the Apps Script URL directly in browser
4. Check that your Google Sheet has the correct column headers
5. Make sure the sheet tab is named "Books"

### Apps Script errors:

1. Check the Apps Script execution logs (View → Executions)
2. Verify the `SHEET_ID` is correct
3. Make sure the script is deployed as a web app
4. Ensure "Who has access" is set to "Anyone"

### Image not displaying:

1. Make sure the Cover Image Link column contains valid image URLs
2. Images must be publicly accessible
3. For Google Drive images, use the sharing link format

---

## Adding More Books

1. Open your Google Sheet
2. Add a new row with book information
3. The changes will be reflected immediately (no redeployment needed)

---

## System Architecture

```
Google Sheet (Books data)
    ↓
Google Apps Script (API)
    ↓
Node.js Backend (/api/books)
    ↓
React Frontend (BookRecommendations page)
```

This system is completely independent of:
- Clergy system (GOOGLE_APPS_SCRIPT_URL)
- Blog system (BLOG_APPS_SCRIPT_URL)

Each has its own Google Sheet, Apps Script, and API endpoints.
