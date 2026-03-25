# VoucherForge

A Next.js app that generates styled voucher PDFs and images from uploaded CSV/Excel data.

## Features
- Upload CSV or Excel (.xlsx) files
- Map your columns to voucher fields (name, code, value, expiry, etc.)
- Live preview as you configure
- Export individual vouchers as PDF
- Export all vouchers as a multi-page PDF or individual PNG images
- Customisable brand name, message, and accent colour

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Click Deploy — no configuration needed

## CSV Format

Any CSV or Excel file works. Example columns:

| Name | Code | Value | Expiry |
|------|------|-------|--------|
| Jane Smith | SAVE20 | £20 Off | 31 Dec 2025 |

Column names don't have to match exactly — you'll map them in the app.
