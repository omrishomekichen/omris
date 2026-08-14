# Vercel Express Mail API

Simple Express-based mail API designed to run on Vercel serverless functions.

Environment variables (set these in Vercel dashboard or in `.env` locally):

- `GMAIL_USER` - Gmail address
- `GMAIL_APP_PASSWORD` - App password for Gmail

API endpoint (POST): `/api/mail/send`
Body (JSON): `{ "to": "recipient@example.com", "subject": "Hi", "text": "Hello" }`
