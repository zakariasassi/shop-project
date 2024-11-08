const express = require('express');
const nodemailer = require('nodemailer');


const router = express.Router();



router.post('/', async (req, res) => {
    const { fullName, email, message } = req.body;
  
    // Validate fields
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Set up Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any email service like Gmail, Outlook, etc.
      auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password'   // Replace with your email password or app-specific password
      }
    });
  
    // Email options
    const mailOptions = {
      from: email,
      to: 'support@libocare.com', // The email address where the message will be sent
      subject: `Contact Form Submission from ${fullName}`,
      text: `
        You have received a new message from the contact form.
  
        Name: ${fullName}
        Email: ${email}
        Message: ${message}
      `,
    };
  
    try {
      // Send email
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send the message' });
    }
  });

module.exports = router;
