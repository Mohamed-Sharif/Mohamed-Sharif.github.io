# Website Analytics Setup Guide

## Option 1: Google Analytics (GA4) - Recommended

### Steps:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Admin" → "Create Property"
4. Fill in your website details:
   - Property name: "Mohamed Sharif Portfolio"
   - Website URL: Your GitHub Pages URL (e.g., `https://mohamed-sharif.github.io`)
   - Industry: Personal/Portfolio
5. Accept the terms and create the property
6. You'll get a **Measurement ID** (format: `G-XXXXXXXXXX`)
7. Copy your Measurement ID
8. In `index.html`, uncomment the Google Analytics code in the `<head>` section
9. Replace `G-XXXXXXXXXX` with your actual Measurement ID

### What you'll see:
- Number of visitors
- Page views
- Visitor locations (country/city)
- Device types (desktop/mobile)
- Traffic sources
- Most visited pages
- Time spent on site

---

## Option 2: Simple Analytics (Privacy-Friendly)

If you prefer a privacy-focused alternative:

1. Go to [Simple Analytics](https://simpleanalytics.com/)
2. Sign up for a free account
3. Add your website
4. Copy the script they provide
5. Add it to your `index.html` `<head>` section

**Benefits:**
- No cookies
- GDPR compliant
- Simple dashboard
- Free tier available

---

## Option 3: GitHub Pages Analytics (If Available)

If your repository is public and you have GitHub Pages enabled:

1. Go to your repository settings
2. Scroll to "Pages" section
3. Check if "GitHub Pages analytics" is available
4. Enable it if shown

**Note:** This only works for public repositories and provides basic visitor counts.

---

## Option 4: Custom Hit Counter

For a simple visitor counter, you can use services like:
- [Hitwebcounter.com](https://www.hitwebcounter.com/)
- [FreeCounterStat](https://www.freecounterstat.com/)

These provide simple HTML code to add a counter badge to your site.

---

## Privacy Considerations

⚠️ **Important:** If you're targeting EU visitors, you may need:
- Cookie consent banner (for Google Analytics)
- Privacy policy page
- GDPR compliance

For a simple portfolio site, **Simple Analytics** is often the best choice as it's privacy-friendly and doesn't require cookie consent.

---

## Quick Start (Google Analytics)

1. Get your Measurement ID from Google Analytics
2. Uncomment the analytics code in `index.html`
3. Replace `G-XXXXXXXXXX` with your ID
4. Deploy your site
5. Visit your site once to generate data
6. Check Google Analytics dashboard (data may take 24-48 hours to appear)

---

## Testing

After adding analytics:
1. Visit your website
2. Check the browser console (F12) for any errors
3. Use Google Analytics "Realtime" view to see if it's working
4. Wait 24-48 hours for full data to appear
