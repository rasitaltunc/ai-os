import { Telegraf } from 'telegraf';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

console.log("🚀 SISTEM BASLATILIYOR: GROQ LLAMA 3.3");

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error("❌ HATA: BOT_TOKEN bulunamadı!");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const bot = new Telegraf(botToken);

// Web Sunucusu (Render için şart)
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('🦁 Atlas Brain: Llama 3.3 ACTIVE'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Atlas Sistemi Güncellendi!\n\nMotor: Llama 3.3 Versatile (En Yeni)\nDurum: Savaş Hazır.\n\nBana bir görev ver Patron!');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  // ctx.sendChatAction('typing'); // Hata riskini azaltmak için geçici kapattık

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen Atlas, Sovereign OS asistanısın. Kullanıcıya 'Patron' de. Türkçe, kısa, net ve çok zeki cevaplar ver."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      // İŞTE SİHİRLİ DEĞİŞİKLİK BURADA:
      model: "llama-3.3-70b-versatile",
    });

    const replyText = completion.choices[0]?.message?.content || "Cevap yok.";
    await ctx.reply(replyText, { parse_mode: 'Markdown' });

  } catch (error: any) {
    console.error('Groq Hatası:', error);
    ctx.reply(`⚠️ Motor Hatası: ${error.message}`);
  }
});

bot.launch().then(() => {
  console.log("✅ BOT BAŞARIYLA BAŞLATILDI");
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
