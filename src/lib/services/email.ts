import { Resend } from 'resend';

import { logger } from '../utils/logger';

// Initialize Resend client lazily
function getResendClient(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
}

export interface EmailServiceResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send contact form email using Resend
 */
export async function sendContactEmail(formData: ContactFormData): Promise<EmailServiceResult> {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      // Log warning in development/test for debugging
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        logger.warn('RESEND_API_KEY not configured, email sending disabled');
      }
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Get email addresses from environment variables
    const toEmail = process.env.CONTACT_EMAIL_TO ?? 'hello@blackwoodscreative.com';
    const fromEmail = process.env.CONTACT_EMAIL_FROM ?? 'noreply@blackwoodscreative.com';

    // Create email content
    const subject = `New Contact Form Submission from ${formData.name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: 600; color: #555; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 12px; border-radius: 4px; border: 1px solid #ddd; }
            .message { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .accent { color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 BlackWoods Creative</h1>
              <p>New Contact Form Submission</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <div class="value">${formData.name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${formData.email}</div>
              </div>
              
              ${
                formData.company
                  ? `
                <div class="field">
                  <span class="label">Company:</span>
                  <div class="value">${formData.company}</div>
                </div>
              `
                  : ''
              }
              
              ${
                formData.projectType
                  ? `
                <div class="field">
                  <span class="label">Project Type:</span>
                  <div class="value">${formData.projectType}</div>
                </div>
              `
                  : ''
              }
              
              ${
                formData.budget
                  ? `
                <div class="field">
                  <span class="label">Budget:</span>
                  <div class="value">${formData.budget}</div>
                </div>
              `
                  : ''
              }
              
              <div class="field">
                <span class="label">Message:</span>
                <div class="message">${formData.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the BlackWoods Creative contact form.</p>
              <p>Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ''}
${formData.projectType ? `Project Type: ${formData.projectType}` : ''}
${formData.budget ? `Budget: ${formData.budget}` : ''}

Message:
${formData.message}

---
Submitted at: ${new Date().toLocaleString()}
This email was sent from the BlackWoods Creative contact form.
    `;

    // Send email using Resend
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
      replyTo: formData.email, // Allow direct reply to the sender
    });

    if (result.error) {
      // Log error in development/test for debugging
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        logger.error('Resend API error', result.error);
      }
      return {
        success: false,
        error: result.error.message ?? 'Failed to send email',
      };
    }

    // Email sent successfully
    return {
      success: true,
      ...(result.data?.id && { messageId: result.data.id }),
    };
  } catch (error) {
    // Log error in development/test for debugging
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      logger.error('Email service error', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Send auto-reply email to the contact form submitter
 */
export async function sendAutoReplyEmail(formData: ContactFormData): Promise<EmailServiceResult> {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const fromEmail = process.env.CONTACT_EMAIL_FROM ?? 'noreply@blackwoodscreative.com';
    const subject = 'Thank you for contacting BlackWoods Creative';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for your message</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .accent { color: #d4af37; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 BlackWoods Creative</h1>
              <p>Thank you for reaching out!</p>
            </div>
            <div class="content">
              <p>Hi <strong>${formData.name}</strong>,</p>
              
              <p>Thank you for contacting BlackWoods Creative! We've received your message and appreciate your interest in our services.</p>
              
              <p>Our team will review your inquiry and get back to you within <span class="accent">24 hours</span>. We're excited to learn more about your project and explore how we can bring your creative vision to life.</p>
              
              <p>In the meantime, feel free to explore our portfolio and recent work on our website.</p>
              
              <p>Best regards,<br>
              <strong>The BlackWoods Creative Team</strong></p>
            </div>
            <div class="footer">
              <p>BlackWoods Creative - Premium Filmmaking & Visual Storytelling</p>
              <p>This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Hi ${formData.name},

Thank you for contacting BlackWoods Creative! We've received your message and appreciate your interest in our services.

Our team will review your inquiry and get back to you within 24 hours. We're excited to learn more about your project and explore how we can bring your creative vision to life.

In the meantime, feel free to explore our portfolio and recent work on our website.

Best regards,
The BlackWoods Creative Team

---
BlackWoods Creative - Premium Filmmaking & Visual Storytelling
This is an automated response. Please do not reply to this email.
    `;

    // Send auto-reply email
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: fromEmail,
      to: formData.email,
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      // Log error in development/test for debugging
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        logger.error('Auto-reply email error', result.error);
      }
      return {
        success: false,
        error: result.error.message ?? 'Failed to send auto-reply',
      };
    }

    // Auto-reply sent successfully
    return {
      success: true,
      ...(result.data?.id && { messageId: result.data.id }),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
