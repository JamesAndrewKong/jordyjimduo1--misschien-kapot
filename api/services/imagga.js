
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class ImaggaService {
  constructor(apiEndpoint, apiKey, apiSecret) {
    this.apiEndpoint = apiEndpoint;
    this.auth = {
      username: apiKey,
      password: apiSecret
    };
  }

  async getTags(imagePath) {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(`${this.apiEndpoint}/v2/tags`, formData, {
      auth: this.auth,
      headers: formData.getHeaders()
    });

    return response.data.result.tags.map(tag => tag.tag.en);  // extract the English tag names
  }
}

module.exports = new ImaggaService(
  process.env.IMAGGA_ENDPOINT,
  process.env.IMAGGA_API_KEY,
  process.env.IMAGGA_API_SECRET
);