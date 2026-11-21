
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendEmail = async ({ to, subject, html, text, attachments, replyTo }) => {
    console.log("ACCESSPASS EMAIL FUNCTION CALLED");
console.log("Recipient:", to);
console.log("Subject:", subject);
  if (
    !process.env.BREVO_SMTP_USER ||
    !process.env.BREVO_SMTP_KEY ||
    !process.env.EMAIL_FROM_ADDRESS
  ) {
    throw new Error("Email configuration is incomplete. Check your server .env file.");
  }
console.log("Attempting to send email through Brevo...");
 return transporter.sendMail({
    
  from: `"${process.env.EMAIL_FROM_NAME || "AccessPass"}" <${process.env.EMAIL_FROM_ADDRESS}>`,
 to,
subject,
html,
text,
attachments,
replyTo,
});
};

module.exports = { sendEmail };
