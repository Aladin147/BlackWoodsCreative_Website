/**
 * @jest-environment node
 */
// Mock Resend
import { sendContactEmail, sendAutoReplyEmail } from '../email';

const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

// Mock console methods
// Mock console to prevent test output noise
jest.spyOn(console, 'log').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

describe('Email Service', () => {
  const mockFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Test Company',
    projectType: 'Film Production',
    budget: '$10,000 - $25,000',
    message: 'I would like to discuss a potential project with your team.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_EMAIL_TO;
    delete process.env.CONTACT_EMAIL_FROM;
  });

  describe('sendContactEmail', () => {
    it('sends email successfully with all form data', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.CONTACT_EMAIL_TO = 'contact@test.com';
      process.env.CONTACT_EMAIL_FROM = 'noreply@test.com';

      mockSend.mockResolvedValue({
        data: { id: 'email-123' },
        error: null,
      });

      const result = await sendContactEmail(mockFormData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('email-123');
      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: 'contact@test.com',
        subject: 'New Contact Form Submission from John Doe',
        html: expect.stringContaining('John Doe'),
        text: expect.stringContaining('John Doe'),
        replyTo: 'john@example.com',
      });
    });

    it('uses default email addresses when env vars not set', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: { id: 'email-123' },
        error: null,
      });

      await sendContactEmail(mockFormData);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@blackwoodscreative.com',
          to: 'hello@blackwoodscreative.com',
        })
      );
    });

    it('handles missing optional fields gracefully', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      const minimalFormData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Simple message without optional fields.',
      };

      mockSend.mockResolvedValue({
        data: { id: 'email-456' },
        error: null,
      });

      const result = await sendContactEmail(minimalFormData);

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.not.stringContaining('Company:'),
          text: expect.not.stringContaining('Company:'),
        })
      );
    });

    it('returns error when API key is not configured', async () => {
      const result = await sendContactEmail(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service not configured');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RESEND_API_KEY not configured, email sending disabled'
      );
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('handles Resend API errors', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' },
      });

      const result = await sendContactEmail(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Resend API error:', {
        message: 'Invalid API key',
      });
    });

    it('handles network errors', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockRejectedValue(new Error('Network error'));

      const result = await sendContactEmail(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Email service error:', expect.any(Error));
    });

    it('includes all form fields in email content', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: { id: 'email-789' },
        error: null,
      });

      await sendContactEmail(mockFormData);

      const emailCall = mockSend.mock.calls[0][0];

      // Check HTML content includes all fields
      expect(emailCall.html).toContain('John Doe');
      expect(emailCall.html).toContain('john@example.com');
      expect(emailCall.html).toContain('Test Company');
      expect(emailCall.html).toContain('Film Production');
      expect(emailCall.html).toContain('$10,000 - $25,000');
      expect(emailCall.html).toContain('I would like to discuss');

      // Check text content includes all fields
      expect(emailCall.text).toContain('John Doe');
      expect(emailCall.text).toContain('john@example.com');
      expect(emailCall.text).toContain('Test Company');
      expect(emailCall.text).toContain('Film Production');
      expect(emailCall.text).toContain('$10,000 - $25,000');
      expect(emailCall.text).toContain('I would like to discuss');
    });
  });

  describe('sendAutoReplyEmail', () => {
    it('sends auto-reply email successfully', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.CONTACT_EMAIL_FROM = 'noreply@test.com';

      mockSend.mockResolvedValue({
        data: { id: 'auto-reply-123' },
        error: null,
      });

      const result = await sendAutoReplyEmail(mockFormData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('auto-reply-123');
      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: 'john@example.com',
        subject: 'Thank you for contacting BlackWoods Creative',
        html: expect.stringContaining('Hi <strong>John Doe</strong>'),
        text: expect.stringContaining('Hi John Doe'),
      });
    });

    it('returns error when API key is not configured', async () => {
      const result = await sendAutoReplyEmail(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service not configured');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('handles auto-reply sending errors', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'Rate limit exceeded' },
      });

      const result = await sendAutoReplyEmail(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rate limit exceeded');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Auto-reply email error:', {
        message: 'Rate limit exceeded',
      });
    });

    it('personalizes auto-reply with user name', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: { id: 'auto-reply-456' },
        error: null,
      });

      await sendAutoReplyEmail(mockFormData);

      const emailCall = mockSend.mock.calls[0][0];

      expect(emailCall.html).toContain('Hi <strong>John Doe</strong>');
      expect(emailCall.text).toContain('Hi John Doe');
      expect(emailCall.html).toContain('24 hours');
      expect(emailCall.text).toContain('24 hours');
    });

    it('uses default from email when not configured', async () => {
      process.env.RESEND_API_KEY = 'test-api-key';

      mockSend.mockResolvedValue({
        data: { id: 'auto-reply-789' },
        error: null,
      });

      await sendAutoReplyEmail(mockFormData);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@blackwoodscreative.com',
        })
      );
    });
  });

  describe('Email Content Validation', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-api-key';
      mockSend.mockResolvedValue({
        data: { id: 'test-email' },
        error: null,
      });
    });

    it('includes raw form data in email content (sanitization handled by API layer)', async () => {
      const formDataWithHtml = {
        name: '<b>John Doe</b>',
        email: 'test@example.com',
        message: 'Message with <em>emphasis</em>',
      };

      await sendContactEmail(formDataWithHtml);

      const emailCall = mockSend.mock.calls[0][0];

      // Email service includes raw data - sanitization is handled at API layer
      expect(emailCall.html).toContain('<b>John Doe</b>');
      expect(emailCall.html).toContain('<em>emphasis</em>');
      expect(emailCall.text).toContain('<b>John Doe</b>');
      expect(emailCall.text).toContain('<em>emphasis</em>');
    });

    it('includes timestamp in email content', async () => {
      const dateSpy = jest
        .spyOn(Date.prototype, 'toLocaleString')
        .mockReturnValue('12/25/2023, 10:30:00 AM');

      await sendContactEmail(mockFormData);

      const emailCall = mockSend.mock.calls[0][0];

      expect(emailCall.html).toContain('12/25/2023, 10:30:00 AM');
      expect(emailCall.text).toContain('12/25/2023, 10:30:00 AM');

      dateSpy.mockRestore();
    });
  });
});
