const axios = require('axios');
const fs = require('fs');

async function getTags(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const response = await axios.post('https://api.imagga.com/v2/tags', imageData, {
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.IMAGGA_API_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/octet-stream'
    }
  });
  const tags = response.data.result.tags.map(tag => tag.tag.en);
  return tags;
}

function calculateSimilarity(uploadedTags, targetTags) {
  let matchedTags = uploadedTags.filter(tag => targetTags.includes(tag));
  let similarityScore = (matchedTags.length / targetTags.length) * 100;
  return similarityScore;
}

async function analyzeImage(imagePath, targetId) {
  const targetResponse = await axios.get(`${process.env.TARGET_SERVICE_URL}/targets/${targetId}`);
  const targetTags = await getTags(targetResponse.data.photo);
  const uploadedTags = await getTags(imagePath);
  return calculateSimilarity(uploadedTags, targetTags);
}

module.exports = {
  analyzeImage
};