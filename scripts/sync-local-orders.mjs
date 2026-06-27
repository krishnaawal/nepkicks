import nextEnv from "@next/env";
import { google } from "googleapis";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

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

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/^['"]+|[,;'"]+$/g, "")
    .replace(/\\n/g, "\n")
    .trim();
}

async function main() {
  const localOrdersPath = path.join(process.cwd(), "data", "orders.json");
  if (!existsSync(localOrdersPath)) {
    console.log("No local orders found.");
    return;
  }

  const orders = JSON.parse(readFileSync(localOrdersPath, "utf8"));
  if (!orders.length) {
    console.log("No local orders found.");
    return;
  }

  const privateKey = getPrivateKey();
  if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey || !process.env.GOOGLE_SHEET_ID) {
    throw new Error("Google Sheets environment variables are missing.");
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const hasOrdersSheet = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === "Orders");

  if (!hasOrdersSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Orders" } } }]
      }
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Orders!A1:M1",
    valueInputOption: "RAW",
    requestBody: { values: [headers] }
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A:M",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: orders.map((order) => [
        order.orderId,
        order.date,
        order.customerName,
        order.email,
        order.phone,
        order.address,
        order.productName,
        order.size,
        order.color,
        order.quantity,
        order.price,
        order.total,
        order.status
      ])
    }
  });

  console.log(`Synced ${orders.length} local orders to Google Sheets.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
