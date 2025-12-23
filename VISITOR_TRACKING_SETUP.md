# Visitor Tracking Setup Guide

This system captures **Email**, **IP Address**, and **Device Information** from your website visitors.

---

## ✅ **What's Already Set Up**

1. **Device Detection**: Automatically detects:
   - Device type (Desktop/Mobile/Tablet)
   - Operating System (Windows, macOS, iOS, Android, Linux)
   - Browser (Chrome, Firefox, Safari, Edge, etc.)
   - Screen resolution
   - Language & Timezone
   - Touch support
   - Connection speed (if available)

2. **IP Address**: Fetches visitor IP using free APIs

3. **Email Capture**: Automatically captures email when contact form is submitted

4. **Google Analytics Integration**: Sends all data to your GA4 property

---

## 📊 **Viewing Data in Google Analytics**

### Method 1: Custom Events Report

1. Go to **Reports** → **Engagement** → **Events**
2. Look for:
   - **`visitor_info`** event (device information)
   - **`form_submission`** event (when contact form is submitted)

### Method 2: Custom Dimensions (Recommended)

To see IP addresses and detailed device info:

1. **Go to**: **Admin** → **Custom Definitions** → **Custom Dimensions**
2. **Create dimensions**:
   - `device_type` (Text)
   - `ip_address` (Text)
   - `operating_system` (Text)
   - `browser` (Text)
   - `screen_resolution` (Text)

3. **Wait 24-48 hours** for data to populate

### Method 3: Explore Reports

1. **Go to**: **Explore** → **Free form**
2. **Add dimensions**:
   - Event name
   - Device type
   - Operating system
   - Browser
3. **Add metrics**:
   - Event count
   - Users
4. **Filter by**: `visitor_info` event

---

## 🔗 **Setting Up Webhook (Optional)**

To store data in a database or send to email:

### Option 1: Zapier Webhook (Easiest)

1. Go to [zapier.com](https://zapier.com) (free account)
2. Create a new Zap
3. Choose **Webhooks by Zapier** → **Catch Hook**
4. Copy the webhook URL
5. In `js/visitor-tracking.js`, replace:
   ```javascript
   var webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
   ```
6. Uncomment the webhook code (remove `/*` and `*/`)
7. Connect to:
   - Google Sheets (to store data)
   - Email (to get notifications)
   - Database (Airtable, etc.)

### Option 2: Make.com (formerly Integromat)

1. Go to [make.com](https://make.com)
2. Create a scenario with **Webhooks** → **Custom webhook**
3. Copy the webhook URL
4. Update `visitor-tracking.js` with the URL

### Option 3: Custom API Endpoint

If you have a backend server:

1. Create an API endpoint (e.g., `/api/visitors`)
2. Update webhook URL in `visitor-tracking.js`
3. Store data in your database

---

## 📧 **Email Capture**

The system automatically captures email when:
- User submits the contact form
- Email is sent to Google Analytics as an event
- Email is included in webhook payload (if configured)

**Note**: Email is only captured when the form is submitted, not on page load.

---

## 🔍 **Testing**

### Test Device Detection

1. Open browser console (F12)
2. Type: `visitorTracking.getData()`
3. See all captured device information

### Test IP Address

1. Check browser console for IP address
2. Or check Google Analytics events after 24 hours

### Test Email Capture

1. Submit the contact form
2. Check browser console for email in visitor data
3. Check Google Analytics for `form_submission` event

---

## 📱 **Data Captured**

### Device Information:
```javascript
{
  deviceType: "Desktop" | "Mobile" | "Tablet",
  os: "Windows 10/11" | "macOS" | "iOS" | "Android",
  osVersion: "10.0.19045",
  browser: "Chrome" | "Firefox" | "Safari" | "Edge",
  browserVersion: "120.0.0.0",
  screenWidth: 1920,
  screenHeight: 1080,
  screenResolution: "1920x1080",
  viewportWidth: 1920,
  viewportHeight: 937,
  language: "en-US",
  timezone: "America/New_York",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  touchSupport: false
}
```

### IP Information:
```javascript
{
  ip: "123.45.67.89",
  ipLocation: {
    country: "United States",
    countryCode: "US",
    region: "California",
    city: "San Francisco",
    lat: 37.7749,
    lon: -122.4194,
    isp: "ISP Name",
    timezone: "America/Los_Angeles"
  }
}
```

### Email:
- Captured from contact form submission
- Included in `form_submission` event

---

## 🔒 **Privacy & GDPR**

⚠️ **Important**: 

1. **IP Address**: Consider privacy implications. You may want to:
   - Hash IP addresses
   - Only store first 3 octets (e.g., `123.45.67.xxx`)
   - Add a privacy policy

2. **Email**: Only captured with user consent (form submission)

3. **GDPR Compliance**: 
   - Add cookie consent banner
   - Update privacy policy
   - Allow users to opt-out

---

## 🛠️ **Customization**

### Change IP Service

In `js/visitor-tracking.js`, modify the `ipServices` array:
```javascript
var ipServices = [
  'https://api.ipify.org?format=json',
  'https://ipapi.co/json/',
  'YOUR_CUSTOM_SERVICE'
];
```

### Add More Data

Extend the `detectDevice()` function to capture:
- Battery level
- Network type
- Hardware info
- etc.

### Custom Events

Add custom events in `sendToGoogleAnalytics()`:
```javascript
gtag('event', 'custom_event_name', {
  'custom_parameter': 'value'
});
```

---

## 📈 **Viewing Data**

### Real-Time

1. **Google Analytics** → **Reports** → **Realtime** → **Events**
2. See `visitor_info` events as they happen

### Historical

1. **Google Analytics** → **Reports** → **Engagement** → **Events**
2. Filter by `visitor_info` or `form_submission`
3. See device breakdown, IP addresses, emails

### Webhook Data

If using Zapier/Make.com:
- Check your connected service (Google Sheets, Email, etc.)
- Data is stored in real-time

---

## 🚀 **Next Steps**

1. ✅ **Test the tracking**: Submit contact form and check console
2. ✅ **Set up webhook** (optional): For storing data
3. ✅ **Create custom dimensions** in GA4: For better reporting
4. ✅ **Wait 24-48 hours**: For data to populate in GA4
5. ✅ **Review data**: Check Events report in GA4

---

## 💡 **Pro Tips**

1. **Use Google Analytics DebugView**: 
   - Install GA Debugger extension
   - See events in real-time

2. **Create Custom Reports**:
   - Save frequently used reports
   - Share with team

3. **Set Up Alerts**:
   - Get notified of form submissions
   - Track unusual traffic patterns

4. **Export Data**:
   - Export to CSV/PDF
   - Import to Excel for analysis

---

**Your tracking is now active!** Check Google Analytics in 24-48 hours to see visitor data.
