import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EmailService } from './email-service.ts';
import { generateCustomerEmailHtml, generateAdminEmailHtml } from './templates.ts';
import { OrderEmailRequest } from './types.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'comimasa@icloud.com';
const IS_DEVELOPMENT = Deno.env.get('IS_DEVELOPMENT') === 'true';

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set');
  throw new Error('RESEND_API_KEY is not set');
}

const emailService = new EmailService(RESEND_API_KEY);

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const orderData: OrderEmailRequest = await req.json();
    console.log('Processing order for customer:', orderData.customerName);

    // In development, send all emails to admin
    const recipientEmail = IS_DEVELOPMENT ? ADMIN_EMAIL : orderData.customerEmail;

    // Send customer confirmation email
    console.log('Sending customer confirmation email to:', recipientEmail);
    const customerEmailResult = await emailService.sendEmail({
      from: 'Shop <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: 'ご注文ありがとうございます',
      html: generateCustomerEmailHtml(orderData),
    });

    if (!customerEmailResult.ok) {
      console.error('Failed to send customer email:', await customerEmailResult.text());
      throw new Error('Failed to send customer confirmation email');
    }

    // Send admin notification email
    console.log('Sending admin notification email');
    const adminEmailResult = await emailService.sendEmail({
      from: 'Shop <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `新規注文: ${orderData.customerName}様`,
      html: generateAdminEmailHtml(orderData),
    });

    if (!adminEmailResult.ok) {
      console.error('Failed to send admin email:', await adminEmailResult.text());
      throw new Error('Failed to send admin notification email');
    }

    return new Response(
      JSON.stringify({ message: 'Order confirmation emails sent successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Failed to send order confirmation emails:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to send order confirmation emails',
        details: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});