const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

async function uploadImageToImgBB(imageBuffer, imageName) {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer.toString('base64'));
    formData.append('name', imageName);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

module.exports = { uploadImageToImgBB };
