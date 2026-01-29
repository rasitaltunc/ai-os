import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// 1. Kurulumlar
const bot = new Telegraf(process.env.BOT_TOKEN || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// DİKKAT: Modeli 'gemini-pro' olarak değiştirdik. Bu model en stabil olandır.
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 2. Web Sunucusu (Render'ın Ayakta Kalması İçin)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🦁 Atlas Brain: Active & Listening (Gemini Pro)...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 3. Başlangıç Mesajı
bot.start((ctx) => {
  ctx.reply('🦁 UYANIŞ TAMAMLANDI.\n\nBen Atlas. Sovereign OS\'un zekasıyım.\nArtık beni sadece bir sekreter olarak değil, bir stratejist olarak kullanabilirsin.\n\nBana bir görev ver veya bir soru sor. Deneyelim!');
});

// 4. Beyin Fonksiyonu (Yapay Zeka Cevabı)
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  // Bekliyor efekti ver (Yazıyor...)
  ctx.sendChatAction('typing');

  try {
    // Gemini'ye sor
    const result = await model.generateContent(`Sen Atlas adında, Sovereign OS işletim sisteminin yapay zeka asistanısın. Kullanıcı sana şunu yazdı: "${userMessage}". Buna kısa, zeki ve "Patron" diye hitap ederek cevap ver.`);
    const response = await result.response;
    const text = response.text();

    // Cevabı Telegram'a ilet
    await ctx.reply(text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Gemini Hatası:', error);
    // Hata detayını da yazdıralım ki loglardan görelim
    ctx.reply('⚠️ Bir bağlantı sorunu var Patron. Logları kontrol et.');
  }
});

// 5. Botu Başlat
bot.launch().then(() => {
  console.log('🦁 Atlas is online with Gemini Pro!');
});

// Hata Yakalama
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
