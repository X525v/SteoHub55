# Vercel Edu Demo — Consent-based IP notification to Telegram

**Purpose:** A small demo meant for educational content: show users how clicking a link can reveal basic info (IP) to the link owner. This project **requires explicit consent** from the visitor before sending any information.

## Files
- `index.html` — Frontend with a clear consent banner and buttons. The visit is only sent when the user clicks "Saya mengerti — Kirim".
- `api/visit.js` — Vercel serverless function. Reads environment variables:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- `.env.example` — Example env file (do not commit real tokens to git).

## Deployment (Vercel)
1. Create a new project on Vercel and link your Git repository or upload this template.
2. In the Vercel project settings, set Environment Variables:
   - `TELEGRAM_BOT_TOKEN` = your bot token (from BotFather)
   - `TELEGRAM_CHAT_ID` = your chat id (private or group)
3. Deploy. After deployment, open the published URL and test by clicking the consent button.
4. The demo will send a single Telegram message containing timestamp, IP, page, and user-agent.

## Ethics & Privacy
- This demo **does not** send anything without explicit user action.
- If you use this in content, clearly tell viewers what will happen and advise them to only click from test devices or consent-aware environments.
- Rotate your bot token if it's ever exposed.
- Consider anonymizing or hashing IPs if storing or sharing logs.

## Notes
- Serverless environments can behave differently with IP headers. The server attempts to use `x-forwarded-for` or `x-real-ip`.
- For heavy use, add stronger rate limiting and storage (database) and never log sensitive data in public places.
