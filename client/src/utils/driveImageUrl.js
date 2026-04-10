// CRITICAL: Convert any Google Drive URL to a direct image URL that works in <img> tags
// DO NOT CHANGE THE OUTPUT FORMAT WITHOUT TESTING ALL CLERGY IMAGES
// Current format: https://lh3.googleusercontent.com/d/${fileId}
// This format works with the referrer policy in index.html
export function getDriveImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Format 2: https://drive.google.com/uc?export=view&id=FILE_ID
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }

  // Format 3: https://drive.google.com/thumbnail?id=FILE_ID (with or without other params)
  const thumbnailMatch = url.match(/thumbnail[?&]id=([^&\s]+)/);
  if (thumbnailMatch) {
    fileId = thumbnailMatch[1];
  }

  // Format 4: https://lh3.googleusercontent.com/d/FILE_ID or https://lh3.googleusercontent.com/d/FILE_ID=w400
  const lhMatch = url.match(/googleusercontent\.com\/d\/([^=&?\s]+)/);
  if (lhMatch) {
    fileId = lhMatch[1];
  }

  // If we found a file ID, return the working format
  if (fileId) {
    // CRITICAL: Use lh3.googleusercontent.com format - DO NOT CHANGE
    // This format works with meta referrer="no-referrer" in index.html
    // Other formats (thumbnail, uc?export=view) have CORS/auth issues
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // If it's not a Drive URL, return as-is (for non-Drive images)
  return url;
}
