import { emailLayout } from "./layout";

export interface AdminOrderAlertOptions {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice: number;
  paymentMethod: string;
  utrNumber?: string;
  shippingAddress: string;
  status?: string;
  createdAt?: string;
  hasScreenshot?: boolean;
  screenshotBase64?: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
}

export const adminOrderAlertTemplate = (data: AdminOrderAlertOptions): string => {
  const itemsList = (data.orderItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">${item.name}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #475569; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; color: #0f172a; text-align: right; font-weight: 600;">₹${item.price * item.quantity}</td>
      </tr>
    `,
    )
    .join("");

  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  return emailLayout({
    title: `🚨 New Order Received #${data.orderId}`,
    preheader: `New order #${data.orderId} of ₹${data.totalPrice} received on Omri's Home Kichen`,
    content: `
      <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 6px;">
        <h2 style="color: #065f46; margin: 0 0 4px 0; font-size: 20px;">📦 New Order Placed!</h2>
        <p style="color: #047857; margin: 0; font-size: 14px;">Order <strong>#${data.orderId}</strong> has been submitted and saved in MongoDB.</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #0f172a; font-size: 16px; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order & Customer Details</h3>
        
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Order ID:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">#${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Order Date:</strong></td>
            <td style="padding: 6px 0; color: #334155;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Status:</strong></td>
            <td style="padding: 6px 0; color: #d97706; font-weight: 600; text-transform: uppercase;">${data.status || "Pending"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Customer Name:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${data.customerName || "Valued Customer"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Customer Email:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${data.customerEmail}">${data.customerEmail || "N/A"}</a></td>
          </tr>
          ${
            data.customerPhone
              ? `<tr>
                  <td style="padding: 6px 0; color: #64748b;"><strong>Customer Phone:</strong></td>
                  <td style="padding: 6px 0; color: #0f172a;">${data.customerPhone}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Payment Method:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${data.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>UTR / Ref No:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-size: 15px;">${data.utrNumber || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Payment Screenshot:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${data.hasScreenshot ? "✅ Attached Below & Saved" : "❌ None (COD)"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Shipping Address:</strong></td>
            <td style="padding: 6px 0; color: #334155;">${data.shippingAddress}</td>
          </tr>
          ${
            data.screenshotBase64
              ? `<tr>
                  <td colspan="2" style="padding: 14px 0 6px 0;">
                    <div style="background-color: #ffffff; border: 1px dashed #94a3b8; padding: 12px; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: #334155; font-weight: 600; font-size: 13px;">📸 Uploaded Payment Screenshot Preview:</p>
                      <img src="${data.screenshotBase64}" alt="Payment Screenshot" style="max-width: 100%; max-height: 380px; border-radius: 6px; border: 1px solid #cbd5e1; display: inline-block;" />
                    </div>
                  </td>
                </tr>`
              : ""
          }
        </table>

        <div style="border-top: 2px solid #e2e8f0; margin-top: 16px; padding-top: 12px; text-align: right;">
          <span style="font-size: 14px; color: #64748b;">Grand Total: </span>
          <span style="font-size: 20px; color: #b45309; font-weight: 800;">₹${data.totalPrice}</span>
        </div>
      </div>

      <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 12px;">Order Items Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px 8px; text-align: left; color: #475569;">Item Name</th>
            <th style="padding: 10px 8px; text-align: center; color: #475569;">Quantity</th>
            <th style="padding: 10px 8px; text-align: right; color: #475569;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://omris-home-kichen.vercel.app/orders" class="btn" style="background-color: #059669;">Open Order Dashboard</a>
      </div>
    `,
  });
};
