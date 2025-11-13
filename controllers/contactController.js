import ContactRequest from "../models/ContactRequest.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const createRequest = async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;
    if (!name || !phone)
      return res.status(400).json({ msg: "Name & phone required" });

    // Save contact request to DB
    const reqDoc = new ContactRequest({
      name,
      email,
      phone,
      message,
      type: type || "callback",
    });
    await reqDoc.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Healthcare Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Request from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email || "Not provided"}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message || "No message"}</p>
        <p><b>Type:</b> ${type || "callback"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: "Request saved & email sent", data: reqDoc });
 } catch (err) {
  console.error("Error in createRequest:", err);
  res.status(500).json({ msg: "Server error", error: err.message });
}

};
