const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to handle contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'paul.kunda@unza.zm',
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.status(200).json({ message: 'Message sent successfully' });
        });
    });
});

// Route to retrieve messages
app.get('/api/messages', (req, res) => {
    const query = 'SELECT * FROM messages ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving messages:', err);
            return res.status(500).json({ error: 'Failed to retrieve messages' });
        }
        res.status(200).json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
