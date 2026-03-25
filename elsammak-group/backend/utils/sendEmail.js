const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Trying to send email to:", to);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"El-Sammak Group" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email Error:", error.message);
  }
};

module.exports = sendEmail;