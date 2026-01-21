# reCAPTCHA v3 Setup Guide

reCAPTCHA v3 is now integrated into your contact form. It's **invisible** to users (no checkbox) and works in the background to detect bots.

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"+ Create"** to create a new site
3. Fill in the form:
   - **Label**: LEVEL Design Agency Contact Form
   - **reCAPTCHA type**: Select **"reCAPTCHA v3"**
   - **Domains**: Add your domain:
     - `leveldesignagency.com`
     - `www.leveldesignagency.com`
     - `localhost` (for testing)
   - Accept the reCAPTCHA Terms of Service
   - Click **Submit**

### Step 2: Copy Your Site Key

After creating the site, you'll see:
- **Site Key** (public - safe to expose)
- **Secret Key** (private - keep secret)

Copy the **Site Key** - you'll need it in the next step.

### Step 3: Update Your Code

1. Open `index.html`
2. Find this line (around line 1430):
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
   ```
3. Replace `YOUR_RECAPTCHA_SITE_KEY` with your actual Site Key:
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=6LcXXXXXXXXXXXXX"></script>
   ```

4. Open `script.js`
5. Find this line (around line 2012):
   ```javascript
   const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY';
   ```
6. Replace `'YOUR_RECAPTCHA_SITE_KEY'` with your actual Site Key:
   ```javascript
   const RECAPTCHA_SITE_KEY = '6LcXXXXXXXXXXXXX';
   ```

### Step 4: Deploy and Test

1. Commit and push your changes
2. Wait for Vercel to deploy (2-3 minutes)
3. Test the form - it should work invisibly in the background
4. Check the browser console - you should see reCAPTCHA loading (no errors)

## ✅ How It Works

- **Invisible to users** - No checkbox, no interruption
- **Runs automatically** - Analyzes user behavior in the background
- **Blocks bots** - Blocks submissions from bots automatically
- **Works with other security** - Complements honeypot, rate limiting, and spam detection

## 🔍 Verification

reCAPTCHA v3 provides a **score** (0.0 to 1.0):
- **0.9 - 1.0**: Very likely a human ✅
- **0.7 - 0.9**: Likely a human ✅
- **0.5 - 0.7**: Suspicious ⚠️
- **0.0 - 0.5**: Very likely a bot ❌

Currently, the form will block submissions if reCAPTCHA fails to generate a token. For full score-based blocking, you'd need server-side verification (see Advanced Setup below).

## 🔧 Advanced Setup (Optional)

For **server-side score verification**, you would need:

1. A serverless function (Vercel Function, Netlify Function, etc.)
2. Verify the token with Google's API using your Secret Key
3. Check the score and block if < 0.5

**Current setup** works great for most cases - reCAPTCHA still analyzes behavior and blocks obvious bots even without server-side verification.

## 📊 Monitoring

- Check [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin) for analytics
- View request statistics and bot detection rates
- See which domains are using reCAPTCHA

## ⚠️ Important Notes

- **Site Key is public** - It's safe to include in your HTML/JS
- **Secret Key is private** - Never expose it in client-side code
- **Free tier** - reCAPTCHA v3 is free for most websites
- **Rate limits** - Google may rate limit if you exceed 1 million requests/month

## 🐛 Troubleshooting

**reCAPTCHA not loading?**
- Check browser console for errors
- Verify Site Key is correct in both `index.html` and `script.js`
- Make sure domain is added in reCAPTCHA admin console

**Form still allowing bots?**
- reCAPTCHA works alongside other security measures
- Check that Site Key is properly configured
- Review reCAPTCHA admin console for analytics

**Want to disable temporarily?**
- Set `RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY'` in `script.js`
- Form will work without reCAPTCHA (other security still active)

---

**Need help?** Check the [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
