import { Telegraf } from 'telegraf';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Anahtarlar
const bot = new Telegraf(process.env.BOT_TOKEN || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Web Sunucusu (Render için)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('🦁 Atlas (Groq Llama-3): Online'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Atlas Sistemi Llama-3 Motoruna Geçti.\n\nGoogle kapris yaptı, ben de daha hızlısına geçtim.\n\nEmret Patron!');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  try {
    // Groq'a sor (Llama-3-8b-8192 modeli çok hızlıdır)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen Atlas adında, Sovereign OS işletim sisteminin yapay zeka asistanısın. Kullanıcıya 'Patron' diye hitap et. Cevapların kısa, net, zeki ve Türkçe olsun."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama3-8b-8192",
    });

    const response = completion.choices[0]?.message?.content || "Cevap yok.";
    await ctx.reply(response, { parse_mode: 'Markdown' });

  } catch (error: any) {
    console.error('Groq Hatası:', error);
    ctx.reply(`⚠️ Motor Hatası: ${error.message}`);
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
