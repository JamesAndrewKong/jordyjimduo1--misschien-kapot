const ImaggaService = require('./imagga');
const Submission = require('../models/submission');

class ScoreService {
  async calculateScores(target) {
    const submissions = await Submission.find({ target: target.id });
    let highestScore = 0;
    let winner = null;

    for (const submission of submissions) {
      const score = await ImaggaService.compareImages(target.photo, submission.photo);
      if (score > highestScore) {
        highestScore = score;
        winner = submission;
      }
    }

    return winner;
  }
}

module.exports = new ScoreService();