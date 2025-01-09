import { OrderEmailRequest } from './types.ts';

export const generateCustomerEmailHtml = (order: OrderEmailRequest): string => {
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

export const generateAdminEmailHtml = (order: OrderEmailRequest): string => {
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