const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { name, email, type, reg, phone, college, city, state, queries } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "yourteamemail@gmail.com",
      pass: "your-app-password" // App Password, NOT regular Gmail password
    }
  });

  // 1. Email to Team
  const teamMailOptions = {
    from: "yourteamemail@gmail.com",
    to: "yourteamemail@gmail.com", // your team email
    subject: `New Enquiry from ${name}`,
    html: `
      <h2>New Project/Enquiry Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Reg No:</strong> ${reg}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>College:</strong> ${college}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Query:</strong> ${queries}</p>
    `
  };

  // 2. Confirmation Email to Customer
  const customerMailOptions = {
    from: "yourteamemail@gmail.com",
    to: email, // customer email
    subject: "✅ Amite Invent-ory - Enquiry Received",
    html: `
      <h3>Dear ${name},</h3>
      <p>Thank you for contacting <strong>Amite Invent-ory</strong>! We have received your enquiry and will get back to you shortly.</p>
      <p><strong>Your Query:</strong><br>${queries}</p>
      <p>📞 For urgent queries, call us at <strong>+91 9176860553</strong>.</p>
      <p>Best regards,<br>Team Amite Invent-ory</p>
    `
  };

  try {
    await transporter.sendMail(teamMailOptions);
    await transporter.sendMail(customerMailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
