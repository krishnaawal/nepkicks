import { NextResponse } from "next/server";
import { appendOrderToSheet, createOrderRecord, getOrdersFromSheet, isAdminAuthorized, validateOrderPayload } from "@/lib/orders";
import { sendOrderEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validationError = validateOrderPayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const order = createOrderRecord(payload);
    await appendOrderToSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({ orderId: order.orderId, total: order.total, status: order.status });
  } catch (error) {
    console.error(error);
    const message = "Order could not be submitted right now. Please contact Nepkicks on WhatsApp.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getOrdersFromSheet();
    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load orders.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
