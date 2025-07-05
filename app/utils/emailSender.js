const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (to, subject, text, html) => {
  try {
     if (!to) throw new Error("Recipient email (to) is required");

    console.log('Sending email to:', to);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // propagate to catch in controller
  }
};
