require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', async (req, res) => {
  const data = req.body;

  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `New Enquiry from ${data.name}`,
    text: `
New enquiry received:

Name: ${data.name}
Type: ${data.type}
Reg No: ${data.reg}
Phone: ${data.phone}
Email: ${data.email}
College: ${data.college}
City: ${data.city}
State: ${data.state}
Queries: ${data.queries}
    `
  };

  const userMail = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Thanks for registering with Amite Invent-ory`,
    text: `Hi ${data.name},

Thanks for registering your enquiry with Amite Invent-ory.

Our team will contact you shortly regarding your request.

Regards,  
Team Amite Invent-ory`
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);
    res.status(200).json({ success: true, message: "Emails sent" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: "Email failed", error: err.message });
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});