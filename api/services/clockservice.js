const cron = require('node-cron');
const Target = require('../models/target');
const ScoreService = require('./scoreservice');

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const targets = await Target.find({ deadline: { $lt: now } });

  for (const target of targets) {
    const winner = await ScoreService.calculateScores(target);
    // Notify the target owner and the winner
  }
});