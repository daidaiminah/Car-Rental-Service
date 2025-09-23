import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

// Email templates directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, 'email-templates');

// Create templates directory if it doesn't exist
if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

// Create transporter with connection pooling
const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
    debug: process.env.NODE_ENV === 'development'
});

// Verify connection
transporter.verify((error) => {
    if (error) {
        console.error('Email server connection error:', error);
    } else {
        console.log('Email server is ready');
    }
});

// Email templates
const templates = {
    WELCOME: 'welcome.html',
    PASSWORD_RESET: 'password-reset.html',
    CONTACT: 'contact.html',
    NOTIFICATION: 'notification.html'
};

// Load email template
const loadTemplate = async (templateName, data = {}) => {
    try {
        const templatePath = path.join(TEMPLATES_DIR, templateName);
        let content = await fs.promises.readFile(templatePath, 'utf8');
        
        // Replace placeholders with actual data
        Object.entries(data).forEach(([key, value]) => {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        
        return content;
    } catch (error) {
        console.error('Error loading template:', error);
        return null;
    }
};

// Send email with retry logic
export const sendEmail = async (options, retries = 2) => {
    const emailId = uuidv4();
    const { to, subject, text, template, templateData, attachments } = options;
    
    // Input validation
    if (!to || !subject) {
        throw new Error('Missing required email fields');
    }

    // Prepare email options
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Whip In Time'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
        html: null,
        attachments,
        headers: { 'X-Email-ID': emailId }
    };

    // Load template if specified
    if (template) {
        mailOptions.html = await loadTemplate(template, templateData);
    } else if (text) {
        mailOptions.html = text.replace(/\n/g, '<br>');
    }

    // Send with retry logic
    for (let i = 0; i <= retries; i++) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent (${emailId}):`, info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        }
    }
};

// Create default templates if they don't exist
const createDefaultTemplates = async () => {
    const defaultTemplates = [
        {
            name: templates.WELCOME,
            content: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to Whip In Time</title>
                <style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;}</style>
            </head>
            <body>
                <h2>Welcome, {{name}}!</h2>
                <p>Thank you for joining Whip In Time. We're excited to have you on board.</p>
                <p>Get started by exploring our platform and all it has to offer.</p>
                <p>Best regards,<br>Whip In Time Team</p>
            </body>
            </html>`
        },
        {
            name: templates.PASSWORD_RESET,
            content: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Password Reset</title>
                <style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;}</style>
            </head>
            <body>
                <h2>Password Reset Request</h2>
                <p>Hello {{name}},</p>
                <p>We received a request to reset your password. Use the following link:</p>
                <p><a href="{{resetLink}}" style="color:#4A6DA7;">Reset Password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>Whip In Time Team</p>
            </body>
            </html>`
        }
    ];

    for (const template of defaultTemplates) {
        const templatePath = path.join(TEMPLATES_DIR, template.name);
        if (!fs.existsSync(templatePath)) {
            await fs.promises.writeFile(templatePath, template.content, 'utf8');
        }
    }
};

// Initialize default templates
createDefaultTemplates().catch(console.error);

// Example usage:
/*
await sendEmail({
    to: 'user@example.com',
    subject: 'Welcome to Whip In Time',
    template: 'welcome.html',
    templateData: { name: 'John Doe' }
});
*/

export default {
    sendEmail,
    templates
};
