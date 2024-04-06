
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

  async calculateScores(target) {
    const targetTags = await this.getTags(target.photo);
    const submissions = await Submission.find({ target: target.id });

    let highestScore = 0;
    let winner = null;

    for (const submission of submissions) {
      const submissionTags = await this.getTags(submission.photo);
      const score = this.calculateSimilarity(targetTags, submissionTags);

      if (score > highestScore) {
        highestScore = score;
        winner = submission;
      }
    }

    return winner;
  }

  calculateSimilarity(tags1, tags2) {
    const sharedTags = tags1.filter(tag => tags2.includes(tag));
    return sharedTags.length;
  }
}

module.exports = new ImaggaService(
  process.env.IMAGGA_ENDPOINT,
  process.env.IMAGGA_API_KEY,
  process.env.IMAGGA_API_SECRET
);