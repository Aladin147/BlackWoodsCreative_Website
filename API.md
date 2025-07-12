# API Documentation

## 🚀 Overview

BlackWoods Creative website provides several API endpoints for contact form submission, CSRF token management, and various utility functions. All APIs implement comprehensive security measures including rate limiting, CSRF protection, and input validation.

## 🔒 Security

### Authentication

- **CSRF Tokens**: Required for all form submissions
- **Rate Limiting**: Applied to all endpoints to prevent abuse
- **Input Validation**: All inputs are validated and sanitized
- **Security Headers**: Comprehensive security headers on all responses

### Rate Limits

- **Contact Form**: 5 requests per 10 minutes per IP
- **CSRF Token**: 100 requests per 15 minutes per IP
- **General APIs**: 100 requests per 15 minutes per IP

## 📋 API Endpoints

### Contact Form API

#### POST `/api/contact`

Submit a contact form with CSRF protection.

**Request Headers:**

```http
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services...",
  "csrfToken": "<csrf-token>"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "timestamp": "2024-12-19T10:30:00Z"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "error": "Invalid input data",
  "details": {
    "email": "Invalid email format",
    "message": "Message is required"
  }
}
```

**Response (Rate Limited - 429):**

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 600,
  "message": "Too many requests. Please try again later."
}
```

**Validation Rules:**

- `name`: Required, 2-100 characters, alphanumeric and spaces only
- `email`: Required, valid email format, max 254 characters
- `subject`: Required, 5-200 characters
- `message`: Required, 10-2000 characters
- `csrfToken`: Required, valid CSRF token

### CSRF Token API

#### GET `/api/csrf-token`

Retrieve a CSRF token for form submissions.

**Response (Success - 200):**

```json
{
  "csrfToken": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "expires": "2024-12-19T11:30:00Z"
}
```

**Response (Rate Limited - 429):**

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 900,
  "message": "Too many token requests. Please try again later."
}
```

**Token Properties:**

- **Length**: 64 characters
- **Format**: Hexadecimal string
- **Expiry**: 1 hour from generation
- **Usage**: Single-use tokens (consumed on form submission)

### Sitemap APIs

#### GET `/sitemap.xml`

Generate XML sitemap for SEO.

**Response (Success - 200):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blackwoodscreative.com/</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

#### GET `/sitemap-images.xml`

Generate XML sitemap for images.

**Response (Success - 200):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://blackwoodscreative.com/</loc>
    <image:image>
      <image:loc>https://blackwoodscreative.com/images/hero-bg.jpg</image:loc>
      <image:title>BlackWoods Creative Hero</image:title>
    </image:image>
  </url>
</urlset>
```

### Robots.txt API

#### GET `/robots.txt`

Generate robots.txt for search engine crawling.

**Response (Success - 200):**

```text
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://blackwoodscreative.com/sitemap.xml
Sitemap: https://blackwoodscreative.com/sitemap-images.xml

# Crawl-delay
Crawl-delay: 1
```

## 🛠️ Usage Examples

### JavaScript/TypeScript

#### Contact Form Submission

```typescript
// Get CSRF token
const tokenResponse = await fetch('/api/csrf-token');
const { csrfToken } = await tokenResponse.json();

// Submit contact form
const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a project...',
  csrfToken,
};

const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(formData),
});

const result = await response.json();
if (result.success) {
  console.log('Message sent successfully!');
} else {
  console.error('Error:', result.error);
}
```

#### Error Handling

```typescript
async function submitContactForm(formData: ContactFormData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': formData.csrfToken,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(`Rate limited. Retry after ${errorData.retryAfter} seconds`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Contact form submission failed:', error);
    throw error;
  }
}
```

### React Hook Example

```typescript
import { useState, useCallback } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = useCallback(async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get CSRF token
      const tokenResponse = await fetch('/api/csrf-token');
      const { csrfToken } = await tokenResponse.json();

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ ...data, csrfToken }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitForm, isSubmitting, error };
}
```

## 🔍 Error Codes

| Code | Description           | Action                              |
| ---- | --------------------- | ----------------------------------- |
| 400  | Bad Request           | Check request format and validation |
| 401  | Unauthorized          | Provide valid CSRF token            |
| 403  | Forbidden             | Check permissions and rate limits   |
| 404  | Not Found             | Verify endpoint URL                 |
| 405  | Method Not Allowed    | Use correct HTTP method             |
| 429  | Too Many Requests     | Wait for rate limit reset           |
| 500  | Internal Server Error | Contact support if persistent       |

## 📊 Response Headers

All API responses include security headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<nonce>'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

## 🧪 Testing

### API Testing Examples

```bash
# Test CSRF token endpoint
curl -X GET https://blackwoodscreative.com/api/csrf-token

# Test contact form (with valid token)
curl -X POST https://blackwoodscreative.com/api/contact \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message content",
    "csrfToken": "your-csrf-token"
  }'
```

### Rate Limit Testing

```bash
# Test rate limiting (should return 429 after limit exceeded)
for i in {1..10}; do
  curl -X GET https://blackwoodscreative.com/api/csrf-token
  sleep 1
done
```

## 📞 Support

For API support and questions:

- **Documentation Issues**: Create a GitHub issue
- **Technical Support**: contact@blackwoodscreative.com
- **Security Issues**: security@blackwoodscreative.com

---

**Last Updated**: December 19, 2024
**API Version**: 1.2.0
