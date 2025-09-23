import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Send an email using nodemailer
 * @param {string} to - Email recipient
 * @param {string} subject - Email subject
 * @param {string} text - Plain text version of the email
 * @param {string} html - HTML version of the email (optional)
 * @returns {Promise<object>} - Email sending result
 */
export const sendEmail = async (to, subject, text, html = null) => {
    try {
        // Configure transporter for Gmail with more robust settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Must be an app-specific password
            },
            tls: {
                rejectUnauthorized: false // Helps with SSL certificate issues
            },
            // Set pool to true to use connection pool for better reliability
            pool: true,
            // Set sensible timeouts
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000, // 10 seconds
            socketTimeout: 15000 // 15 seconds
        });

        // Set up email options
        const mailOptions = {
            from: `"Karnue" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text
        };

        // Add HTML content if provided
        if (html) {
            mailOptions.html = html;
        } else if (text) {
            // Generate simple HTML from text if no HTML is provided
            mailOptions.html = text.replace(/\n/g, '<br>');
        }

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw to allow handling by the caller
    }
};

/**
 * Generate HTML email template for contact form confirmations
 * @param {object} data - The contact form data
 * @returns {string} - HTML email content
 */
export const generateContactEmailHTML = (data) => {
    const { fullName, userType } = data;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for Registering with Whip In Time</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4A6DA7; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #4A6DA7; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Thank You for Registering with Whip In Time</h1>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            <p>Thank you for registering with Whip In Time as a ${userType}. We have received your message and will get back to you as soon as possible.</p>
            
            <p><strong>Your message details:</strong></p>
            <div class="message-box">
                <p><strong>User Type:</strong> ${userType}</p>
            </div>
            
            <p>If you have any urgent matters, please call us directly at our office.</p>
            <p>Best regards,<br>Whip In Time Team</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Whip In Time. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>
    `;
};

