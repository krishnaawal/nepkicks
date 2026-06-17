export const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

export type OrderStatus = (typeof orderStatuses)[number];
