import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


console.log("EMAIL_HOST =", process.env.EMAIL_HOST);
console.log("EMAIL_PORT =", process.env.EMAIL_PORT);
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Verify Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Investment Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email Sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};