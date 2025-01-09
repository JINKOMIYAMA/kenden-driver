import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "comimasa@icloud.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderEmailRequest {
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
}

const generateCustomerEmailHtml = (order: OrderEmailRequest) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}個</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">¥${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>ご注文ありがとうございます</h2>
      <p>${order.customerName} 様</p>
      <p>ご注文を受け付けました。以下の内容をご確認ください。</p>
      
      <h3>注文内容</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">商品名</th>
            <th style="padding: 10px; text-align: left;">数量</th>
            <th style="padding: 10px; text-align: left;">金額</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right;"><strong>合計</strong></td>
            <td style="padding: 10px;"><strong>¥${order.totalAmount.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>

      <h3>お届け先情報</h3>
      <p>${order.shippingAddress}</p>

      <h3>お支払い方法</h3>
      <p>${order.paymentMethod === 'credit' ? 'クレジットカード' : '銀行振込'}</p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      
      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
    </div>
  `;
};

const generateAdminEmailHtml = (order: OrderEmailRequest) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}個</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">¥${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>新規注文がありました</h2>
      
      <h3>注文者情報</h3>
      <p>お名前: ${order.customerName}</p>
      <p>メールアドレス: ${order.customerEmail}</p>
      
      <h3>注文内容</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">商品名</th>
            <th style="padding: 10px; text-align: left;">数量</th>
            <th style="padding: 10px; text-align: left;">金額</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right;"><strong>合計</strong></td>
            <td style="padding: 10px;"><strong>¥${order.totalAmount.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>

      <h3>お届け先情報</h3>
      <p>${order.shippingAddress}</p>

      <h3>お支払い方法</h3>
      <p>${order.paymentMethod === 'credit' ? 'クレジットカード' : '銀行振込'}</p>
    </div>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const orderData: OrderEmailRequest = await req.json();
    console.log("Received order data:", orderData);

    // Send customer email
    console.log("Sending customer email to:", orderData.customerEmail);
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Shop <onboarding@resend.dev>",
        to: [orderData.customerEmail],
        subject: "ご注文ありがとうございます",
        html: generateCustomerEmailHtml(orderData),
      }),
    });

    if (!customerEmailRes.ok) {
      const error = await customerEmailRes.text();
      console.error("Failed to send customer email:", error);
      throw new Error(`Customer email failed: ${error}`);
    }

    // Send admin email
    console.log("Sending admin email to:", ADMIN_EMAIL);
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Shop <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `新規注文: ${orderData.customerName}様`,
        html: generateAdminEmailHtml(orderData),
      }),
    });

    if (!adminEmailRes.ok) {
      const error = await adminEmailRes.text();
      console.error("Failed to send admin email:", error);
      throw new Error(`Admin email failed: ${error}`);
    }

    return new Response(
      JSON.stringify({ message: "Order confirmation emails sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send order confirmation emails",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);