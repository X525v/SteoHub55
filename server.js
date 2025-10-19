const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(express.static(__dirname)); // ini penting kalau file html di folder yang sama

app.get("/log", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    "Unknown IP";
  const text = `🚨 IP baru mengunjungi situs kamu: ${ip}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
  } catch (err) {
    console.error("Gagal kirim ke Telegram:", err);
  }

  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));