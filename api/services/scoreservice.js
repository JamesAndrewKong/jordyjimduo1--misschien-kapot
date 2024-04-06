const fs = require('fs');
const path = require('path');
const imaggaService = require('./imagga');

class ScoreService {
  async calculateScores(target) {
    const targetTags = await imaggaService.getTags(target.photo);
    const targetDir = path.join(__dirname, '../uploads', target.id.toString());
    const photoFiles = fs.readdirSync(targetDir);

    let highestScore = 0;
    let winner = null;

    for (const photoFile of photoFiles) {
      const photoPath = path.join(targetDir, photoFile);
      const photoTags = await imaggaService.getTags(photoPath);
      const score = imaggaService.calculateSimilarity(targetTags, photoTags);

      if (score > highestScore) {
        highestScore = score;
        winner = photoPath;
      }
    }

    return winner;
  }
}

module.exports = new ScoreService();