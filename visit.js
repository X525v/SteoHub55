// Vercel serverless function
// Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from environment variables (set them in Vercel dashboard)
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST from client
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limiting naive (in-memory per instance) to reduce spam in demos
  // NOTE: serverless instances may be cold-started; this is best-effort only
  if (!global._visits) global._visits = { count: 0, ts: Date.now() };
  if (Date.now() - global._visits.ts > 60000) { global._visits.count = 0; global._visits.ts = Date.now(); }
  global._visits.count++;
  if (global._visits.count > 30) {
    res.status(429).json({ error: 'Rate limit' });
    return;
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    res.status(500).json({ error: 'Server not configured (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID).' });
    return;
  }

  // Get client IP from headers (Vercel sets x-forwarded-for)
  const ipHeader = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'Unknown';
  const ip = Array.isArray(ipHeader) ? ipHeader[0] : String(ipHeader).split(',')[0].trim();

  const ua = req.headers['user-agent'] || '-';
  const page = (req.body && req.body.page) || req.url || '/';
  const ts = new Date().toISOString();

  const message = `<b>Edu Demo Visit</b>\nTime: ${ts}\nIP: ${ip}\nPage: ${page}\nUA: ${ua}`;

  try {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });
    const j = await r.json();
    if (!j.ok) {
      res.status(500).json({ error: 'Telegram API error', details: j });
      return;
    }
    // Return minimal info to client
    res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to call Telegram API', details: String(err) });
  }
}
