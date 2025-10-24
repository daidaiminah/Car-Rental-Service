import dotenv from 'dotenv';
import { sendEmail, templates } from '../utils/emailService.js';

dotenv.config();

/**
 * Handle contact form submissions and send notification/confirmation emails.
 */
export const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  const adminRecipient =
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER;

  if (!adminRecipient) {
    return res.status(500).json({
      success: false,
      message:
        'Email server is not configured. Please set ADMIN_EMAIL or EMAIL_FROM in the environment.',
    });
  }

  const normalizedSubject =
    subject && subject.trim().length > 0 ? subject.trim() : 'Website enquiry';

  try {
    // Notify admin/support team
    await sendEmail({
      to: adminRecipient,
      subject: `[Contact Form] ${normalizedSubject} - ${name}`,
      template: templates.CONTACT_NOTIFICATION,
      templateData: {
        name,
        email,
        subject: normalizedSubject,
        message,
      },
      text: `New contact form submission:\nName: ${name}\nEmail: ${email}\nSubject: ${normalizedSubject}\n\n${message}`,
    });

    // Send acknowledgement to the user
    await sendEmail({
      to: email,
      subject: 'We received your message – Whip In Time',
      template: templates.CONTACT_CONFIRMATION,
      templateData: {
        name,
        subject: normalizedSubject,
        message,
      },
      text: `Hi ${name},\n\nThanks for reaching out to Whip In Time.\n\nWe received the following message from you:\n"${message}"\n\nOur support team will follow up shortly.\n\nBest regards,\nWhip In Time`,
    });

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact form email error:', error);
    return res.status(500).json({
      success: false,
      message:
        'We were unable to send your message. Please try again later or email us directly.',
    });
  }
};

export default {
  submitContactForm,
};
