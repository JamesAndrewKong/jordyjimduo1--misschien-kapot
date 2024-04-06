const cron = require('node-cron');
const axios = require('axios');
const ScoreService = require('./scoreservice');
const API_URL = process.env.API_URL;

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const response = await axios.get(`${API_URL}/targets`);
  const targets = response.data.filter(target => new Date(target.deadline) < now);

  for (const target of targets) {
    const winner = await ScoreService.calculateScores(target);
    // Notify the target owner and the winner
  }
});