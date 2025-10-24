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
const emailUser = process.env.EMAIL_USER;
const emailPassword =
    process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = parseInt(process.env.EMAIL_PORT, 10) || 465;

let transporter = null;

if (emailUser && emailPassword) {
    transporter = nodemailer.createTransport({
        pool: true,
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465,
        auth: {
            user: emailUser,
            pass: emailPassword,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 30000,
        debug: process.env.NODE_ENV === 'development',
    });

    transporter
        .verify()
        .then(() => {
            console.log('Email server is ready');
        })
        .catch((error) => {
            console.warn(
                'Unable to connect to email server. Emails will be queued but not delivered until credentials are corrected.'
            );
            if (error?.responseCode === 535) {
                console.warn(
                    'Gmail rejected the credentials. Ensure you are using an app password and that IMAP/SMTP access is enabled.'
                );
            }
            if (process.env.NODE_ENV === 'development') {
                console.warn('Email connection error details:', error.message);
            }
        });
} else {
    console.warn(
        'Email credentials are not fully configured (missing EMAIL_USER or EMAIL_PASSWORD). Email sending is disabled.'
    );
}

// Email templates
export const templates = {
    WELCOME: 'welcome.html',
    PASSWORD_RESET: 'password-reset.html',
    CONTACT_CONFIRMATION: 'contact-confirmation.html',
    CONTACT_NOTIFICATION: 'contact-notification.html',
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
    if (!transporter) {
        throw new Error(
            'Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD (or EMAIL_APP_PASSWORD).'
        );
    }

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
        },
        {
            name: templates.CONTACT_CONFIRMATION,
            content: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>We Received Your Message</title>
                <style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;} .panel{background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 30px rgba(31,41,55,0.08);} .footer{margin-top:24px;font-size:12px;color:#6b7280;text-align:center;}</style>
            </head>
            <body>
                <div class="panel">
                  <h2 style="color:#1f2937;">Hi {{name}},</h2>
                  <p>Thanks for reaching out to the Whip In Time team. We’ve received your message and a member of our support staff will follow up shortly.</p>
                  <p><strong>Summary of your request:</strong></p>
                  <p><strong>Subject:</strong> {{subject}}</p>
                  <p><strong>Message:</strong><br>{{message}}</p>
                  <p>You can reply directly to this email if you need to provide additional details.</p>
                  <p style="margin-top:24px;">Best regards,<br>The Whip In Time Team</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Whip In Time. All rights reserved.</p>
                </div>
            </body>
            </html>`
        },
        {
            name: templates.CONTACT_NOTIFICATION,
            content: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>New Contact Form Submission</title>
                <style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;background:#f3f4f6;} .panel{background:#fff;padding:20px;border-radius:12px;box-shadow:0 4px 20px rgba(15,23,42,0.08);} .meta{margin-top:16px;font-size:14px;color:#374151;} .meta strong{display:inline-block;width:120px;}</style>
            </head>
            <body>
                <div class="panel">
                  <h2 style="color:#111827;">New Contact Form Submission</h2>
                  <p>You received a new message via the website contact form.</p>
                  <div class="meta">
                    <p><strong>Name:</strong> {{name}}</p>
                    <p><strong>Email:</strong> {{email}}</p>
                    <p><strong>Subject:</strong> {{subject}}</p>
                  </div>
                  <p style="margin-top:16px;"><strong>Message:</strong></p>
                  <p style="white-space:pre-line;border-left:3px solid #6366f1;padding-left:12px;">{{message}}</p>
                </div>
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
