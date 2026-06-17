import { NextResponse } from "next/server";
import { isAdminAuthorized, updateOrderStatus } from "@/lib/orders";
import { orderStatuses } from "@/lib/order-status";

type Context = {
  params: Promise<{ orderId: string }>;
};

export async function PATCH(request: Request, context: Context) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await context.params;
  const body = await request.json();

  if (!orderStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  try {
    await updateOrderStatus(orderId, body.status);
    return NextResponse.json({ orderId, status: body.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
