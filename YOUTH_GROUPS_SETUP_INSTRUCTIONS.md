# Youth Groups System Setup Guide

This guide will help you set up the Youth Groups system for your website. This system is completely separate from the clergy, blog, and book systems.

## Overview

The Youth Groups system consists of:
- A Google Sheet to store youth group data
- A Google Apps Script to serve the data
- Backend API endpoints in your Node.js server
- A React frontend page to display the groups

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "EOTC Youth Groups"
4. Create a sheet tab named **"Youth Groups"**
5. Add the following column headers in the first row:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| name | acronym | city | state | description | address | instagram | youtube | tiktok | phone | email | status |

### Column Descriptions:
- **name**: Full name of the youth group
- **acronym**: Short acronym (e.g., OTYD)
- **city**: City location
- **state**: State (2-letter code, e.g., TX)
- **description**: Detailed description of the group
- **address**: Physical address
- **instagram**: Instagram profile URL
- **youtube**: YouTube channel URL
- **tiktok**: TikTok profile URL
- **phone**: Contact phone number
- **email**: Contact email address
- **status**: "published" or "draft" (only published groups will show on the website)

6. Add your youth group data starting from row 2

**IMPORTANT**: Set the `status` column to "published" for groups you want to display on the website.

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
3. Copy the entire contents of `YOUTH_GROUPS_APPS_SCRIPT.js` from your project
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
    - Description: "Youth Groups API"
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
   YOUTH_GROUPS_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
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
   YOUTH_GROUPS_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
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
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getYouthGroups
```

You should see JSON output like:
```json
{
  "success": true,
  "message": "Youth groups fetched successfully",
  "data": [...]
}
```

### Test Backend API:

```bash
curl http://localhost:5000/api/youth-groups
```

Or on AWS:
```bash
curl http://localhost:8080/api/youth-groups
```

### Test Frontend:

1. Start your dev server: `npm run dev`
2. Navigate to `/resources`
3. Click on "Youth Groups"
4. You should see your youth groups displayed

---

## Step 6: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "Add youth groups system"
git push

# On AWS
cd ~/Nt_Service
./deploy.sh
```

---

## Troubleshooting

### Youth groups not showing up:

1. Check PM2 logs: `pm2 logs nighttime-service`
2. Verify `YOUTH_GROUPS_APPS_SCRIPT_URL` is set in `.env`
3. Test the Apps Script URL directly in browser
4. Check that your Google Sheet has the correct column headers
5. Make sure the sheet tab is named "Youth Groups"
6. **Verify the `status` column is set to "published"** for groups you want to display

### Apps Script errors:

1. Check the Apps Script execution logs (View → Executions)
2. Verify the `SHEET_ID` is correct
3. Make sure the script is deployed as a web app
4. Ensure "Who has access" is set to "Anyone"

### Social media links not working:

1. Make sure URLs include the full path (https://...)
2. Instagram: `https://www.instagram.com/username/`
3. YouTube: `https://youtube.com/@channelname`
4. TikTok: `https://www.tiktok.com/@username`

---

## Adding More Youth Groups

1. Open your Google Sheet
2. Add a new row with youth group information
3. **Set the `status` column to "published"**
4. The changes will be reflected immediately (no redeployment needed)

---

## Features

### Filters:
- **State**: Filter groups by state
- **City**: Filter groups by city
- **Search**: Search by name, acronym, city, or description

### Contact Information:
- Address with map icon
- Phone number (clickable to call)
- Email (clickable to send email)

### Social Media:
- Instagram (pink badge)
- YouTube (red badge)
- TikTok (gray badge)

---

## System Architecture

```
Google Sheet (Youth Groups data)
    ↓
Google Apps Script (API)
    ↓
Node.js Backend (/api/youth-groups)
    ↓
React Frontend (YouthGroups page)
```

This system is completely independent of:
- Clergy system (GOOGLE_APPS_SCRIPT_URL)
- Blog system (BLOG_APPS_SCRIPT_URL)
- Book recommendations (BOOKS_APPS_SCRIPT_URL)

Each has its own Google Sheet, Apps Script, and API endpoints.
