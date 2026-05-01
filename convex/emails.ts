import { v } from 'convex/values';
import { internalAction } from './_generated/server';

export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.warn('BREVO_API_KEY is not set. Welcome email will not be sent.');
      return;
    }

    const userName = args.name || 'there';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Promptamist</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome to Promptamist!</h2>
          <p>Hi ${userName},</p>
          <p>We're thrilled to have you on board. You've successfully created your account and can now start exploring all our features.</p>
          <p>If you have any questions or need assistance, feel free to reply to this email or reach out to our support team.</p>
          <br/>
          <p>Best regards,</p>
          <p>The Promptamist Team</p>
        </div>
      </body>
      </html>
    `;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Promptamist Team',
            // NOTE: Change this email to the domain you verified with Brevo
            email: 'yasirwebio@gmail.com',
          },
          to: [
            {
              email: args.email,
              name: args.name,
            },
          ],
          subject: 'Welcome to Promptamist!',
          htmlContent: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          'Failed to send welcome email via Brevo:',
          response.status,
          errorText,
        );
      } else {
        console.log(`Welcome email successfully sent to ${args.email}`);
      }
    } catch (error) {
      console.error('Error occurred while sending welcome email:', error);
    }
  },
});
