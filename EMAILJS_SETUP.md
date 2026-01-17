# EmailJS Setup Guide

Your contact form is now configured to use EmailJS to send emails directly to **help@leveldesignagency.com**.

## Quick Setup Steps

1. **Create a free EmailJS account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account (200 emails/month free)

2. **Add an Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions to connect your email account
   - **Note:** You'll need to use the email account that will receive the form submissions (help@leveldesignagency.com)

3. **Create an Email Template**
   - Go to "Email Templates" in the dashboard
   - Click "Create New Template"
   - Use this template structure:
   
   **Subject:** New Contact Form Submission from {{from_name}}
   
   **Content:**
   ```
   You have received a new message from your website contact form.
   
   Name: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   
   ---
   Reply to: {{reply_to}}
   ```

4. **Get Your Credentials**
   - **Public Key:** Go to "Account" → "General" → Copy your "Public Key"
   - **Service ID:** Go to "Email Services" → Copy the Service ID (looks like: `service_xxxxx`)
   - **Template ID:** Go to "Email Templates" → Copy the Template ID (looks like: `template_xxxxx`)

5. **Update the Code**
   - Open `script.js`
   - Find the line: `emailjs.init('YOUR_PUBLIC_KEY');`
   - Replace `'YOUR_PUBLIC_KEY'` with your actual Public Key
   - Find the line: `'YOUR_SERVICE_ID'`
   - Replace with your Service ID
   - Find the line: `'YOUR_TEMPLATE_ID'`
   - Replace with your Template ID

6. **Test the Form**
   - Submit a test message through your contact form
   - Check your email inbox (help@leveldesignagency.com) for the message

## Important Notes

- The free plan allows 200 emails per month
- Emails will be sent from the email service you connected (not from the form submitter's email)
- Replies should be sent directly to the `from_email` address shown in the email
- Make sure your email service is properly connected and verified

## Troubleshooting

- If emails aren't arriving, check the EmailJS dashboard for error logs
- Verify all three IDs (Public Key, Service ID, Template ID) are correct
- Make sure your email service is active in EmailJS
- Check spam/junk folders

