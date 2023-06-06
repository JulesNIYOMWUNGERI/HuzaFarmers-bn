import nodemailer from 'nodemailer';

const sendMail = async (recipient) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipient.recipientEmail,
    subject: recipient.emailSubject,
    html: recipient.emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
});

export default sendMail;
