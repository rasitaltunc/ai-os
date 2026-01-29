import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// 1. Kurulumlar
const bot = new Telegraf(process.env.BOT_TOKEN || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// GÜNCELLEME: En yeni ve hızlı model 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 2. Web Sunucusu
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🦁 Atlas Brain: Active (Gemini 1.5 Flash)');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 3. Başlangıç
bot.start((ctx) => {
  ctx.reply('🦁 Atlas v1.5 Hazır.\n\nEn yeni Gemini Flash motoruyla çalışıyorum. Hızlandım.\n\nBana bir görev ver Patron!');
});

// 4. Beyin
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  try {
    const result = await model.generateContent(`Sen Atlas, Sovereign OS asistanısın. Kullanıcı: "${userMessage}". Kısa, zeki ve "Patron" diyerek cevapla.`);
    const response = await result.response;
    const text = response.text();
    await ctx.reply(text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Gemini Hatası:', error);
    ctx.reply('⚠️ Bağlantı hatası. (Cache temizliği gerekiyor olabilir)');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
