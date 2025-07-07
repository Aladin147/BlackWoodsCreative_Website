# Analytics and Integrations Setup Guide

## Overview

This guide provides step-by-step instructions for setting up analytics tracking and third-party integrations for the BlackWoods Creative website.

## 🎯 Current Integration Status

### ✅ Formspree Contact Form - CONFIGURED
- **Form ID**: `mzzgagbb`
- **Master API Key**: Configured
- **Readonly API Key**: Configured
- **Status**: ✅ Ready for production use

### 🔧 Google Analytics 4 - READY FOR SETUP
- **Integration**: Complete
- **Components**: Analytics provider ready
- **Status**: ⏳ Awaiting GA4 Measurement ID

### 🔧 Vercel Analytics - READY FOR SETUP
- **Integration**: Complete
- **Components**: Speed Insights included
- **Status**: ⏳ Awaiting Vercel project setup

## 📊 Google Analytics 4 Setup

### Step 1: Create Google Analytics Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Account** (if needed):
   - Account Name: "BlackWoods Creative"
   - Data Sharing Settings: Configure as needed

3. **Create Property**:
   - Property Name: "BlackWoods Creative Website"
   - Reporting Time Zone: "Morocco Time (GMT+1)"
   - Currency: "Moroccan Dirham (MAD)"

4. **Set Up Data Stream**:
   - Platform: "Web"
   - Website URL: "https://blackwoodscreative.com"
   - Stream Name: "BlackWoods Creative Website"

5. **Get Measurement ID**:
   - Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 2: Configure Environment Variables

Add to your `.env.local` and Vercel environment variables:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Step 3: Verify Installation

1. **Deploy with GA4 ID**: Push changes to production
2. **Test Tracking**: Visit your website
3. **Check Real-time Reports**: Go to GA4 → Reports → Realtime
4. **Verify Events**: Should see page views and events

### Step 4: Set Up Goals and Conversions

Configure these important conversions in GA4:

1. **Contact Form Submission**:
   - Event Name: `form_submit`
   - Category: `contact`

2. **Portfolio Views**:
   - Event Name: `portfolio_view`
   - Category: `portfolio`

3. **Service Inquiries**:
   - Event Name: `service_inquiry`
   - Category: `services`

## 🚀 Vercel Analytics Setup

### Step 1: Enable Vercel Analytics

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Your Project**: BlackWoods Creative
3. **Go to Analytics Tab**
4. **Enable Analytics**: Click "Enable Analytics"

### Step 2: Configure Environment Variables

Vercel Analytics is automatically enabled when deployed to Vercel. No additional environment variables needed.

### Step 3: Enable Speed Insights

Speed Insights is automatically included in the analytics provider.

### Step 4: Verify Installation

1. **Deploy to Vercel**: Push changes
2. **Check Analytics Dashboard**: View in Vercel dashboard
3. **Monitor Performance**: Check Core Web Vitals

## 📧 Formspree Contact Form - ALREADY CONFIGURED

### Current Configuration

```env
FORMSPREE_FORM_ID=mzzgagbb
FORMSPREE_MASTER_KEY=a0e79422e82347dbacc2b2f3b35982ed
FORMSPREE_READONLY_KEY=f3d00a4b0e093a74eba8322a20da53c50a5db6b4
```

### Features Enabled

1. **Contact Form Submissions**: ✅ Working
2. **Email Notifications**: ✅ Automatic
3. **Spam Protection**: ✅ Built-in
4. **Form Analytics**: ✅ Available via API
5. **Rate Limiting**: ✅ Implemented

### Formspree Dashboard Access

1. **Login**: https://formspree.io/login
2. **View Form**: Search for form ID `mzzgagbb`
3. **Check Submissions**: View all form submissions
4. **Configure Settings**: Adjust notifications and settings

### Form Features

- **Validation**: Client-side and server-side validation
- **Rate Limiting**: 3 submissions per minute per email
- **Analytics Tracking**: Google Analytics integration
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: User-friendly success messages

## 🔧 Integration Components

### Analytics Provider

**Location**: `src/components/analytics/AnalyticsProvider.tsx`

**Features**:
- Google Analytics 4 integration
- Vercel Analytics integration
- Automatic page view tracking
- Custom event tracking
- Privacy-compliant configuration

**Usage**:
```tsx
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### Enhanced Contact Form

**Location**: `src/components/forms/EnhancedContactForm.tsx`

**Features**:
- Formspree integration
- Real-time validation
- Rate limiting protection
- Analytics tracking
- Professional styling
- Error handling

**Usage**:
```tsx
import { EnhancedContactForm } from '@/components/forms/EnhancedContactForm';

export default function ContactPage() {
  return (
    <div>
      <EnhancedContactForm 
        showProjectDetails={true}
        defaultSubject="Project Inquiry"
      />
    </div>
  );
}
```

## 📈 Analytics Events Tracking

### Automatic Events

1. **Page Views**: Tracked automatically
2. **Form Interactions**: Contact form events
3. **Navigation**: Menu clicks and page transitions
4. **Portfolio**: Project views and interactions

### Custom Events Available

```typescript
import { analytics } from '@/lib/integrations/analytics';

// Contact form events
analytics.contactFormStart();
analytics.contactFormSubmit();
analytics.contactFormSuccess();

// Portfolio events
analytics.portfolioView('project-id');
analytics.portfolioImageClick('project-id', 1);

// Service events
analytics.serviceView('video-production');
analytics.serviceInquiry('video-production');

// Navigation events
analytics.navigationClick('/about');

// Social media events
analytics.socialMediaClick('instagram');
```

## 🔒 Privacy and Compliance

### Google Analytics Configuration

- **IP Anonymization**: Enabled
- **Data Sharing**: Disabled for ads
- **Cookie Consent**: Implemented
- **Data Retention**: 14 months (default)

### GDPR Compliance

- **Consent Management**: Built-in consent handling
- **Data Processing**: Minimal data collection
- **User Rights**: Analytics can be disabled
- **Transparency**: Clear privacy policy needed

## 🧪 Testing and Validation

### Test Analytics Setup

1. **Run Production Validation**:
   ```bash
   npm run production:validate
   ```

2. **Check Analytics Status**:
   - Development mode shows analytics status indicator
   - Verify GA4 and Vercel analytics are detected

3. **Test Form Submission**:
   - Submit test form
   - Check Formspree dashboard
   - Verify analytics events

### Debugging

1. **Google Analytics Debugger**: Use GA Debugger Chrome extension
2. **Vercel Analytics**: Check Vercel dashboard
3. **Console Logs**: Check browser console for errors
4. **Network Tab**: Verify analytics requests

## 📋 Production Deployment Checklist

### Before Deployment

- [ ] Google Analytics 4 Measurement ID configured
- [ ] Vercel Analytics enabled (automatic with Vercel)
- [ ] Formspree credentials verified
- [ ] Privacy policy updated
- [ ] Cookie consent implemented

### After Deployment

- [ ] Verify Google Analytics tracking
- [ ] Test contact form submissions
- [ ] Check Vercel Analytics dashboard
- [ ] Monitor error rates
- [ ] Validate event tracking

### Environment Variables for Production

```env
# Required
NEXT_PUBLIC_SITE_URL=https://blackwoodscreative.com
NEXT_PUBLIC_SITE_NAME="BlackWoods Creative"

# Formspree (Configured)
FORMSPREE_FORM_ID=mzzgagbb
FORMSPREE_MASTER_KEY=a0e79422e82347dbacc2b2f3b35982ed
FORMSPREE_READONLY_KEY=f3d00a4b0e093a74eba8322a20da53c50a5db6b4

# Analytics (Add your IDs)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# VERCEL_ANALYTICS_ID automatically configured on Vercel
```

## 🎯 Next Steps

1. **Set up Google Analytics 4**:
   - Create GA4 property
   - Get Measurement ID
   - Add to environment variables

2. **Deploy to Vercel**:
   - Push code to GitHub
   - Deploy to Vercel
   - Vercel Analytics will be automatically enabled

3. **Test Everything**:
   - Submit test contact form
   - Check analytics tracking
   - Verify all integrations working

4. **Monitor Performance**:
   - Check Core Web Vitals
   - Monitor form submissions
   - Review analytics data

---

**Status**: ✅ **INTEGRATIONS READY**

Formspree is fully configured and ready. Google Analytics 4 and Vercel Analytics are ready for setup with your accounts.
