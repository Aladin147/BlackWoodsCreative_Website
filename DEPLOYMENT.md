# Deployment Guide

## 🚀 Overview

This guide covers deployment procedures for the BlackWoods Creative website, including environment setup, build processes, security configurations, and monitoring.

## 🏗️ Build Process

### Production Build

```bash
# Install dependencies
npm ci

# Run quality checks
npm run type-check
npm run lint
npm test

# Create production build
npm run build

# Test production build locally
npm run start
```

### Build Optimization

The build process includes:

- **Next.js 15 Optimizations**: Latest performance features and static generation
- **Bundle Analysis**: Automatic code splitting and optimization
- **Security Headers**: Comprehensive CSP and security header configuration
- **Asset Optimization**: Image optimization and compression
- **TypeScript Compilation**: Strict mode compilation with type checking

## 🌐 Deployment Platforms

### Vercel (Recommended)

Vercel provides optimal Next.js 15 support with automatic optimizations.

#### Setup

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Configure Environment**: Set environment variables
3. **Deploy**: Automatic deployment on push to main branch

#### Vercel Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### Netlify

Alternative deployment platform with good Next.js support.

#### Setup

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### Self-Hosted Deployment

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
NODE_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Rate Limiting (Optional - Redis)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Security Configuration
NEXT_PUBLIC_CSP_NONCE_ENABLED=true
NEXT_PUBLIC_SECURITY_HEADERS_ENABLED=true
NEXT_PUBLIC_RATE_LIMITING_ENABLED=true

# Monitoring (Optional)
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ACCESSIBILITY_FEATURES=true
NEXT_PUBLIC_CSP_REPORT_URI=https://your-csp-report-endpoint
```

### Development Environment

```env
# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Development Features
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=false
```

## 🔒 Security Configuration

### SSL/TLS Setup

```nginx
# Nginx configuration for SSL termination
server {
    listen 443 ssl http2;
    server_name blackwoodscreative.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Security Headers Verification

```bash
# Test security headers
curl -I https://blackwoodscreative.com

# Expected headers:
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

## 📊 Monitoring & Analytics

### Performance Monitoring

```javascript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Monitoring

```javascript
// Error boundary for production
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Health Checks

```javascript
// API health check endpoint
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] ESLint validation clean
- [ ] TypeScript compilation successful
- [ ] Security headers configured
- [ ] Environment variables set
- [ ] SSL certificate valid
- [ ] Performance benchmarks met
- [ ] Accessibility validation passed

## 🚨 Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard [commit-hash]
git push --force-with-lease origin main
```

## 📈 Performance Optimization

### Build Analysis

```bash
# Analyze bundle size
npm run analyze

# Check bundle report
open .next/analyze/bundle-report.html
```

### Performance Monitoring

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

## 🔍 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### SSL Certificate Issues

```bash
# Test SSL configuration
openssl s_client -connect blackwoodscreative.com:443 -servername blackwoodscreative.com
```

### Debug Mode

```env
# Enable debug logging
DEBUG=next:*
NODE_ENV=development
```

## 📞 Support

For deployment support:

- **Technical Issues**: contact@blackwoodscreative.com
- **Security Concerns**: security@blackwoodscreative.com
- **Performance Issues**: Create GitHub issue with performance label

---

**Last Updated**: December 19, 2024
**Version**: 1.2.0
