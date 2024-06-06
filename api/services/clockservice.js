const cron = require('node-cron');
const axios = require('axios');
// const ScoreService = require('./scoreservice');
const API_URL = process.env.API_URL;

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const response = await axios.get(`${API_URL}/targets`);
  const targets = response.data.filter(target => new Date(target.deadline) < now);

  for (const target of targets) {
    // const winner = await ScoreService.calculateScores(target);
    
    
    //TEMP MAIL PLACEHOLDER
    // const nodemailer = require('nodemailer');

    // const transporter = nodemailer.createTransport({
    //   host: "mailhog",
    //   port: 1025,
    // });

    // app.get("/mail", (res) => {
    //   const messageStatus = transporter.sendMail({
    //     from: "My Company <company@companydomain.org>",
    //     to: "My Company <company@companydomain.org>",
    //     subject: "Hi Mailhog!",
    //     text: "This is the email content",
    //   });

    //   if (!messageStatus) res.json("Error sending message!").status(500);

    //   messageStatus.then(data => res.json(data))
    //         .catch(next);
    // });
    //TEMP MAIL PLACEHOLDER


    //TODO: Connect to mail service
    // axios.post(`${API_URL}/mail`, { targetOwner: target.owner, winner });
  }
});