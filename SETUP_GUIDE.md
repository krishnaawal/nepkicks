# Nepkicks Ecommerce Setup Guide

This project is a Next.js 15 single product ecommerce landing page for Nepkicks Brilliant Shoes.

## Local Testing Before Google Setup

You can test orders before adding Google Sheets and Resend credentials.

If Google Sheets is not configured, orders are saved locally in:

`data/orders.json`

If Resend is not configured, emails are skipped during local testing.

After you add the Google and Resend environment variables, the same order form will automatically save to Google Sheets and send emails.

If orders were saved locally before Google Sheets was fixed, sync them later with:

```bash
npm run sync:orders
```

If Google returns `Requested entity was not found`, check these two things:

1. `GOOGLE_SHEET_ID` must be the spreadsheet ID from the URL, not the sheet tab ID.
2. The Google Sheet must be shared with the `GOOGLE_CLIENT_EMAIL` service account as Editor.

## 1. Create Google Sheet

1. Open Google Sheets.
2. Create a new spreadsheet.
3. Name it `Nepkicks Orders`.
4. Rename the first sheet tab to `Orders`.
5. Add this header row in row 1:

`Order ID, Date, Customer Name, Email, Phone, Address, Product Name, Size, Color, Quantity, Price, Total, Status`

## 2. Get Google Sheet ID

Open your sheet and copy the long ID from the URL.

Example URL shape:

`https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

Copy only the `SHEET_ID_HERE` part.

## 3. Create Google Cloud Service Account

1. Go to Google Cloud Console.
2. Create or select a project.
3. Enable the Google Sheets API.
4. Go to IAM & Admin, then Service Accounts.
5. Create a service account named `nepkicks-orders`.

## 4. Get Google API Credentials

1. Open the service account.
2. Go to Keys.
3. Create a new JSON key.
4. Download the JSON file.
5. Copy `client_email` into `GOOGLE_CLIENT_EMAIL`.
6. Copy `private_key` into `GOOGLE_PRIVATE_KEY`.
7. Share your Google Sheet with the `client_email` address and give it Editor access.

When pasting the private key into `.env.local`, keep it on one line and replace line breaks with `\n`.

## 5. Create Resend Account

1. Go to Resend.
2. Create an account.
3. Verify your sender domain if you have one.
4. For early testing, Resend can send from `orders@resend.dev`.

## 6. Get Resend API Key

1. In Resend, open API Keys.
2. Create a new API key.
3. Copy it into `RESEND_API_KEY`.

## 7. Configure Environment

Create `.env.local` in the project root:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Nepkicks <orders@your-verified-domain.com>
ADMIN_EMAIL=unickbane@gmail.com
ADMIN_PASSWORD=Clfa5afdd33
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key_with_\n_line_breaks
GOOGLE_SHEET_ID=your_google_sheet_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For customer emails, verify your sending domain in Resend and use that address in `RESEND_FROM_EMAIL`. Resend test sender addresses can be restricted and may only deliver to your verified/admin email.

## 8. Run npm install

```bash
npm install
```

## 9. Run npm run dev

```bash
npm run dev
```

Open `http://localhost:3000`.

Admin dashboard:

`http://localhost:3000/admin`

Use password:

`Clfa5afdd33`

## 10. Deploy to GitHub

```bash
git init
git add .
git commit -m "Build Nepkicks ecommerce landing page"
```

Create a GitHub repository, then push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

## 11. Deploy to Vercel

1. Open Vercel.
2. Import the GitHub repository.
3. Add the environment variables from `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain.
5. Deploy.

After deployment, place a test order and confirm:

1. Customer receives the confirmation email.
2. Admin receives the order notification email.
3. The order appears in Google Sheets.
4. The order appears in `/admin`.
