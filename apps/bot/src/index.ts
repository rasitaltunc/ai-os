import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Anahtarı ve Bot Token'ı al
const bot = new Telegraf(process.env.BOT_TOKEN || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// GÜNCEL MODEL: gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => { res.send('🦁 Atlas Brain: Active (Flash Mode)'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Atlas Hazır.\n\nGoogle Gemini 1.5 Flash motoru devrede.\n\nBana bir soru sor Patron!');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  try {
    const result = await model.generateContent(`Sen Atlas, Sovereign OS asistanısın. Kullanıcı: "${userMessage}". Kısa, zeki ve "Patron" diyerek cevapla.`);
    const response = await result.response;
    const text = response.text();
    await ctx.reply(text, { parse_mode: 'Markdown' });
  } catch (error: any) {
    console.error('Gemini Hatası:', error);
    // Hatayı Telegram'a da gönderelim ki görebilelim
    ctx.reply(`⚠️ HATA OLUŞTU:\n${error.message || error}`);
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
