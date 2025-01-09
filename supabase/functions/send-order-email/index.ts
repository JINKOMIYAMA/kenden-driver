import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "comimasa@icloud.com"; // 管理者のメールアドレスを更新

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

const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

const generateCustomerEmailHtml = (order: OrderEmailRequest) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}個</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
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
            <td style="padding: 10px;"><strong>${formatPrice(order.totalAmount)}</strong></td>
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
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
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
            <td style="padding: 10px;"><strong>${formatPrice(order.totalAmount)}</strong></td>
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

  try {
    const orderData: OrderEmailRequest = await req.json();

    // 購入者へのメール送信
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
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

    // 管理者へのメール送信
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
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

    if (!customerEmailResponse.ok || !adminEmailResponse.ok) {
      throw new Error("Failed to send emails");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending order emails:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send order confirmation emails" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
