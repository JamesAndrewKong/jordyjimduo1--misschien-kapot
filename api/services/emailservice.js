const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(email, username, subject, text) {
    const message = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: `Hello ${username},\n\n${text}`
    };

    await this.transporter.sendMail(message);
  }
}

module.exports = new EmailService();