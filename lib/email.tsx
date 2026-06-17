import { Resend } from "resend";
import { formatMoney, product } from "@/lib/product";
import type { OrderRecord } from "@/lib/orders";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] || char));
}

function orderEmailHtml(order: OrderRecord, admin = false) {
  const customerDetails = admin
    ? `
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
      <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
    `
    : `<p>Nepkicks will contact you soon to confirm delivery. Cash on delivery is available for this order.</p>`;

  return `
    <div style="background:#f7f3ed;color:#141414;font-family:Arial,sans-serif;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:24px">
        <h1 style="margin:0 0 16px;font-size:28px">${admin ? "New Nepkicks order" : "Your Nepkicks order is confirmed"}</h1>
        <p>Order ID: <strong>${escapeHtml(order.orderId)}</strong></p>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
        <p><strong>Product:</strong> ${escapeHtml(order.productName)}</p>
        <p><strong>Size:</strong> ${escapeHtml(order.size)}</p>
        <p><strong>Color:</strong> ${escapeHtml(order.color)}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total:</strong> ${formatMoney(order.total)}</p>
        ${customerDetails}
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
        <p>${product.businessEmail} | WhatsApp: ${product.whatsapp}</p>
      </div>
    </div>
  `;
}

export async function sendOrderEmails(order: OrderRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || product.businessEmail;
  if (!apiKey) {
    console.warn(`Resend is not configured. Email skipped for order ${order.orderId}.`);
    return;
  }

  const resend = new Resend(apiKey);
  const from = "Nepkicks <orders@resend.dev>";

  try {
    await Promise.all([
      resend.emails.send({
        from,
        to: order.email,
        subject: `Nepkicks order confirmed: ${order.orderId}`,
        html: orderEmailHtml(order)
      }),
      resend.emails.send({
        from,
        to: adminEmail,
        subject: `New order ${order.orderId} - ${order.customerName}`,
        html: orderEmailHtml(order, true)
      })
    ]);
  } catch (error) {
    console.error(`Resend email failed for order ${order.orderId}.`, error);
  }
}
