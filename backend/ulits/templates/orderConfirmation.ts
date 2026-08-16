import { emailLayout } from "./layout";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationOptions {
  orderId: string;
  customerName?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  grandTotal?: number;
  totalAmount?: number;
  shippingAddress?: string;
  paymentMethod?: string;
}

export const orderConfirmationTemplate = (data: OrderConfirmationOptions): string => {
  const itemsList = data.items || [];
  const itemsHtml = itemsList.length > 0
    ? itemsList
        .map(
          (item) => `
          <tr>
            <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; color: #334155;">${item.name}</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; color: #475569; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; text-align: right; font-weight: 600;">₹${item.price * item.quantity}</td>
          </tr>
        `,
        )
        .join("")
    : `<tr><td colspan="3" style="padding: 12px 8px; color: #64748b; text-align: center;">Order details recorded.</td></tr>`;

  const total = data.grandTotal || data.totalAmount || 0;
  const subtotalVal = data.subtotal || total;
  const shippingVal = data.shipping || 0;

  return emailLayout({
    title: `Order Confirmed #${data.orderId} - Omri's Home Kichen`,
    preheader: `Thank you for your order! Order #${data.orderId} is being prepared with care.`,
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Order Confirmed! 📦</h2>
      <p style="color: #475569;">Hello ${data.customerName || "Valued Customer"},</p>
      <p style="color: #475569;">Thank you for ordering with <strong>Omri's Home Kichen</strong>! We're preparing your artisanal order with fresh ingredients.</p>

      <div style="background-color: #fffbeb; border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid #fef3c7;">
        <p style="margin: 2px 0; color: #92400e; font-size: 14px;"><strong>Order ID:</strong> #${data.orderId}</p>
        <p style="margin: 2px 0; color: #92400e; font-size: 14px;"><strong>Payment Method:</strong> ${data.paymentMethod || "COD / UPI"}</p>
        <p style="margin: 2px 0; color: #92400e; font-size: 14px;"><strong>Shipping Address:</strong> ${data.shippingAddress || "Provided on Checkout"}</p>
      </div>

      <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 12px;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8fafc; text-align: left;">
            <th style="padding: 10px 8px; color: #64748b; font-weight: 600;">Item</th>
            <th style="padding: 10px 8px; color: #64748b; font-weight: 600; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; color: #64748b; font-weight: 600; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="border-top: 2px solid #e2e8f0; padding-top: 12px; font-size: 14px;">
        <div style="display: flex; justify-content: space-between; margin: 4px 0; color: #475569;">
          <span>Subtotal:</span>
          <span>₹${subtotalVal}</span>
        </div>
        ${
          data.discount && data.discount > 0
            ? `<div style="display: flex; justify-content: space-between; margin: 4px 0; color: #166534;">
                <span>Discount:</span>
                <span>-₹${data.discount}</span>
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; margin: 4px 0; color: #475569;">
          <span>Shipping Fee:</span>
          <span>${shippingVal === 0 ? "FREE" : `₹${shippingVal}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 12px 0 0 0; color: #0f172a; font-size: 18px; font-weight: 800;">
          <span>Total Paid:</span>
          <span style="color: #b45309;">₹${total}</span>
        </div>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://omris-home-kichen.vercel.app/orders" class="btn">Track Order Status</a>
      </div>
    `,
  });
};
