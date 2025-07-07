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

  const mailOptions = {
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

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ success: false, message: 'Email failed', error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});