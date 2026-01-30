import { Telegraf } from 'telegraf';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

console.log("🚀 SISTEM BASLATILIYOR: GROQ MOTORU SEÇİLDİ");

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error("❌ HATA: BOT_TOKEN bulunamadı!");
  process.exit(1);
}

const groqKey = process.env.GROQ_API_KEY;
if (!groqKey) {
  console.error("❌ HATA: GROQ_API_KEY bulunamadı!");
  // Hata vermesin diye işlem yapmıyoruz ama uyarıyoruz
}

const bot = new Telegraf(botToken);
const groq = new Groq({ apiKey: groqKey });

// Web Sunucusu
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('🦁 Atlas Llama-3 (Groq): ONLINE 🟢'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Atlas: Groq Motoru Devrede! (Llama 3)\n\nGoogle\'ı geride bıraktık. Hızımı test et Patron!');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen Atlas, Sovereign OS asistanısın. Kullanıcıya 'Patron' de. Türkçe, kısa, net ve zeki cevaplar ver."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama3-8b-8192",
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
