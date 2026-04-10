# የማታ አገልግሎት / Nighttime Service

A full-stack web application for the Ethiopian Orthodox Tewahedo Church (EOTC) community, providing resources for church administration, clergy directory, and organizational guidance.

## Tech Stack

- **Frontend:** React 18 with React Router
- **Backend:** Node.js + Express
- **Styling:** Tailwind CSS
- **Database:** Google Sheets (with JSON fallback)
- **APIs:** Google Sheets API, Google Places API, ImgBB (image hosting)
- **Fonts:** Noto Sans Ethiopic (for Amharic text)

## Features

- 🏠 **Home Page:** Welcome section with disclaimer and resource overview
- ⛪ **Nesiha Abat Directory:** Find spiritual fathers with filtering by language and church
- ➕ **Add Clergy Form:** Submit new clergy information directly to Google Sheets with:
  - Address autocomplete (Google Places API)
  - City autocomplete for major US cities
  - Multi-select language dropdown
  - Image upload with preview
  - Auto-sync to Google Sheets backend
- 🌍 **Bilingual Support:** Content in both English and Amharic (Fidel script)
- 📱 **Responsive Design:** Mobile-friendly layout
- 🎨 **Ethiopian Orthodox Theme:** Forest green and gold color scheme

## Project Structure

```
Nightime_Service/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── data/             # JSON data files
│   │   └── clergy.json
│   ├── server.js
│   └── package.json
└── package.json          # Root package for concurrent dev
```

## Installation

1. Install all dependencies (root, client, and server):
```bash
npm run install-all
```

Or install manually:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Running the Application

### Quick Start (Basic Features)

Start both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000

### Full Setup (With Clergy Submission Form)

To enable the "Add Clergy" form feature, you need to set up API keys:

1. **Quick Setup Guide:** See `QUICK_START.md` (5 minutes)
2. **Detailed Setup:** See `SETUP_GOOGLE_SHEETS.md` (complete guide)

Required APIs (all have free tiers):
- Google Sheets API (for data storage)
- Google Places API (for address autocomplete)
- ImgBB API (for image uploads)

## API Endpoints

- `GET /api/clergy` - Get all clergy listings
- `GET /api/clergy?language=Amharic` - Filter by language
- `GET /api/clergy?church=Mekanaselam` - Filter by church
- `GET /api/clergy/:id` - Get specific clergy member

## Pages

### Home (/)
- Bilingual welcome section
- Important disclaimer about site independence
- Overview of available resources
- Navigation to main sections

### Nesiha Abat (/nesiha-abat)
- Clergy directory with photos
- Filter by language (Amharic, English, Tigrinya, Oromo)
- Filter by church
- Detailed clergy information cards

## Color Scheme

- **Forest Green:** `#1B5E20` - Primary brand color
- **Medium Green:** `#2E7D32` - Headings and accents
- **Light Green:** `#4CAF50` - Interactive elements
- **Gold/Amber:** `#FFB300` / `#FFC107` - Accent highlights

## Adding Clergy

To add new clergy members, edit `server/data/clergy.json`:

```json
{
  "id": 4,
  "name": "Name",
  "photoUrl": "image-url",
  "languages": ["Amharic", "English"],
  "church": "Church Name",
  "address": "Full Address",
  "bio": "Biography text",
  "contact": "Contact info (optional)"
}
```

## Disclaimer

This is an independent community resource for Ethiopian Orthodox Tewahedo Church (EOTC) members and organizations. **This site is NOT an official source endorsed by the Ethiopian Orthodox Tewahedo Church or any of its governing bodies.**

## License

Community Resource - Not for commercial use
