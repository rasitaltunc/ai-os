import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// EN GARANTİ MODEL: gemini-pro
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => { res.send('🦁 Atlas Brain: Online'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Sistem Resetlendi. Yeni kimlikler yüklendi. Hazırım Patron.');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    await ctx.reply(text);
  } catch (error: any) {
    console.error('Gemini Hatası:', error);
    ctx.reply(`⚠️ HATA: ${error.message}`);
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
