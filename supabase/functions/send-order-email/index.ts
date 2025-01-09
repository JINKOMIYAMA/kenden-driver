import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, OrderEmailRequest } from './types.ts';
import { generateCustomerEmailHtml, generateAdminEmailHtml } from './templates.ts';
import { EmailService } from './email-service.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'comimasa@icloud.com';
const IS_DEVELOPMENT = true;

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set');
  throw new Error('RESEND_API_KEY is not configured');
}

const emailService = new EmailService(RESEND_API_KEY);

const handler = async (req: Request): Promise<Response> => {
  console.log('Received request:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in send-order-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send order confirmation emails',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);