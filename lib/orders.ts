import { google } from "googleapis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { orderStatuses, type OrderStatus } from "@/lib/order-status";
import { product } from "@/lib/product";

export type OrderPayload = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  size: string;
  color: string;
  quantity: number;
};

export type OrderRecord = OrderPayload & {
  orderId: string;
  date: string;
  productName: string;
  price: number;
  total: number;
  status: OrderStatus;
};

const headers = [
  "Order ID",
  "Date",
  "Customer Name",
  "Email",
  "Phone",
  "Address",
  "Product Name",
  "Size",
  "Color",
  "Quantity",
  "Price",
  "Total",
  "Status"
];

const localOrdersPath = path.join(process.cwd(), "data", "orders.json");

export function generateOrderId(date = new Date()) {
  const yyyymmdd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${yyyymmdd}-${random}`;
}

export function createOrderRecord(payload: OrderPayload): OrderRecord {
  const quantity = Math.max(1, Math.min(10, Number(payload.quantity) || 1));
  return {
    ...payload,
    customerName: payload.customerName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    address: payload.address.trim(),
    size: payload.size.trim(),
    color: payload.color.trim(),
    quantity,
    orderId: generateOrderId(),
    date: new Date().toISOString(),
    productName: product.name,
    price: product.salePrice,
    total: product.salePrice * quantity + product.deliveryCharge,
    status: "Pending"
  };
}

export function validateOrderPayload(payload: Partial<OrderPayload>) {
  const required: Array<keyof OrderPayload> = ["customerName", "email", "phone", "address", "size", "color", "quantity"];
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === "");
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (!product.sizes.includes(String(payload.size) as never)) return "Selected size is not available.";
  if (!product.colors.some((color) => color.name === payload.color)) return "Selected color is not available.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) return "Please enter a valid email address.";
  if (!/^[0-9+\-\s()]{7,20}$/.test(String(payload.phone))) return "Please enter a valid phone number.";
  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) return "Quantity must be between 1 and 10.";
  return null;
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function hasGoogleSheetsConfig() {
  return Boolean(process.env.GOOGLE_CLIENT_EMAIL && getPrivateKey() && process.env.GOOGLE_SHEET_ID);
}

async function readLocalOrders(): Promise<OrderRecord[]> {
  try {
    const file = await readFile(localOrdersPath, "utf8");
    return JSON.parse(file) as OrderRecord[];
  } catch {
    return [];
  }
}

async function writeLocalOrders(orders: OrderRecord[]) {
  await mkdir(path.dirname(localOrdersPath), { recursive: true });
  await writeFile(localOrdersPath, JSON.stringify(orders, null, 2));
}

async function appendOrderLocally(order: OrderRecord) {
  const orders = await readLocalOrders();
  orders.unshift(order);
  await writeLocalOrders(orders);
}

async function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error("Google Sheets environment variables are not configured.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return {
    sheets: google.sheets({ version: "v4", auth }),
    sheetId
  };
}

async function ensureHeaderRow() {
  const { sheets, sheetId } = await getSheetsClient();
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: sheetId
  });

  const hasOrdersSheet = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === "Orders");
  if (!hasOrdersSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: "Orders"
              }
            }
          }
        ]
      }
    });
  }

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Orders!A1:M1"
  });

  if (!existing.data.values?.[0]?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Orders!A1:M1",
      valueInputOption: "RAW",
      requestBody: { values: [headers] }
    });
  }
}

export async function appendOrderToSheet(order: OrderRecord) {
  if (!hasGoogleSheetsConfig()) {
    await appendOrderLocally(order);
    console.warn("Google Sheets is not configured. Order saved locally in data/orders.json.");
    return;
  }

  try {
    await ensureHeaderRow();
    const { sheets, sheetId } = await getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Orders!A:M",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[order.orderId, order.date, order.customerName, order.email, order.phone, order.address, order.productName, order.size, order.color, order.quantity, order.price, order.total, order.status]]
      }
    });
  } catch (error) {
    await appendOrderLocally(order);
    console.error("Google Sheets save failed. Order saved locally in data/orders.json.", error);
  }
}

export async function getOrdersFromSheet(): Promise<OrderRecord[]> {
  if (!hasGoogleSheetsConfig()) {
    return readLocalOrders();
  }

  let response;
  try {
    await ensureHeaderRow();
    const { sheets, sheetId } = await getSheetsClient();
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Orders!A2:M"
    });
  } catch (error) {
    console.error("Google Sheets read failed. Showing local orders instead.", error);
    return readLocalOrders();
  }

  return (response.data.values || []).map((row) => ({
    orderId: String(row[0] || ""),
    date: String(row[1] || ""),
    customerName: String(row[2] || ""),
    email: String(row[3] || ""),
    phone: String(row[4] || ""),
    address: String(row[5] || ""),
    productName: String(row[6] || product.name),
    size: String(row[7] || ""),
    color: String(row[8] || ""),
    quantity: Number(row[9] || 0),
    price: Number(row[10] || 0),
    total: Number(row[11] || 0),
    status: (row[12] || "Pending") as OrderStatus
  }));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!hasGoogleSheetsConfig()) {
    const orders = await readLocalOrders();
    const index = orders.findIndex((order) => order.orderId === orderId);
    if (index === -1) throw new Error("Order not found.");
    orders[index] = { ...orders[index], status };
    await writeLocalOrders(orders);
    return;
  }

  try {
    const orders = await getOrdersFromSheet();
    const index = orders.findIndex((order) => order.orderId === orderId);
    if (index === -1) throw new Error("Order not found.");

    const { sheets, sheetId } = await getSheetsClient();
    const rowNumber = index + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Orders!M${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [[status]] }
    });
  } catch (error) {
    const orders = await readLocalOrders();
    const index = orders.findIndex((order) => order.orderId === orderId);
    if (index === -1) throw error;
    orders[index] = { ...orders[index], status };
    await writeLocalOrders(orders);
    console.error("Google Sheets status update failed. Local order status updated instead.", error);
  }
}

export function isAdminAuthorized(request: Request) {
  const password = request.headers.get("x-admin-password");
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}
