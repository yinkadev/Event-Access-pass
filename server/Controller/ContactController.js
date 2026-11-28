
const { sendEmail } = require("../utils/EmailService");

const escapeHTML = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid details for all fields.",
      });
    }

    // Clean the submitted values
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // Check for empty fields
    if (!cleanName || !cleanEmail || !cleanSubject || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields.",
      });
    }

    // Restrict field lengths
    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanSubject.length > 150 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long.",
      });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Prevent newlines in the email address and subject
    if (/[\r\n]/.test(cleanEmail) || /[\r\n]/.test(cleanSubject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address or subject.",
      });
    }

    // Check support email configuration
    const supportEmail = process.env.EMAIL_FROM_ADDRESS;

    if (!supportEmail) {
      throw new Error("Support email is not configured.");
    }

    // Send enquiry to AccessPass support
    await sendEmail({
      to: supportEmail,
      replyTo: cleanEmail,
      subject: `AccessPass enquiry: ${cleanSubject}`,
      text: `New customer enquiry

Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>New AccessPass enquiry</h2>
          <p><strong>Name:</strong> ${escapeHTML(cleanName)}</p>
          <p><strong>Email:</strong> ${escapeHTML(cleanEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHTML(cleanSubject)}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHTML(cleanMessage)}</p>
        </div>
      `,
    });

    // Send acknowledgement email to the customer
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "We received your AccessPass enquiry",
        text: `Hello ${cleanName}, thank you for contacting AccessPass. We have received your message and will get back to you as soon as possible.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Thank you for contacting AccessPass!</h2>
            <p>Hello ${escapeHTML(cleanName)},</p>
            <p>We have successfully received your enquiry.</p>
            <p>Our team will get back to you as soon as possible.</p>
            <p><strong>The AccessPass Team</strong></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Customer acknowledgement email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll be in touch soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't send your message. Please try again later.",
    });
  }
};

module.exports = { submitContactMessage };
