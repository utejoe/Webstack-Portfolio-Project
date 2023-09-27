const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for handling form submissions
app.post('/send-email', (req, res) => {
  // Get the form data from the request
  const { fullName, email, phoneNumber, subject, message } = req.body;

  // Create a transporter for sending emails (you'll need to configure your email service)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'utejoe.ju@gmail.com',
      pass: 'Ugochukwu@5'
    }
  });

  // Configure the email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'your-email@gmail.com',
    subject: `New Message: ${subject}`,
    text: `Name: ${fullName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage:\n${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully!');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
