import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// DENENECEK MODELLER LİSTESİ (Sırasıyla dener)
const MODEL_LIST = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
  "gemini-1.5-flash-latest"
];

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('🦁 Atlas Model Hunter: Active'); });
app.listen(port, () => { console.log(`Server running on port ${port}`); });

bot.start((ctx) => {
  ctx.reply('🦁 Model Avcısı Modu Açıldı.\n\nBana bir şey yaz, senin için çalışan doğru modeli bulup sisteme kilitleyeceğim.');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  ctx.sendChatAction('typing');

  // Döngüyle modelleri dene
  let activeModel = null;
  let responseText = "";

  for (const modelName of MODEL_LIST) {
    try {
      console.log(`Deneniyor: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      responseText = response.text();
      
      // Hata vermediyse bu model çalışıyordur!
      activeModel = modelName;
      break; // Döngüyü kır, cevabı ver
    } catch (error: any) {
      console.error(`❌ ${modelName} başarısız oldu: ${error.status || error.message}`);
      // Bir sonrakine geç
    }
  }

  if (activeModel) {
    // Çalışan model bulunduysa
    await ctx.reply(`✅ EŞLEŞME BAŞARILI!\nKullanılan Model: **${activeModel}**\n\n🦁 Cevap:\n${responseText}`, { parse_mode: 'Markdown' });
  } else {
    // Hiçbiri çalışmadıysa (İmkansız ama olsun)
    await ctx.reply('⚠️ KRİTİK HATA: Listemdeki hiçbir model bu Anahtarla çalışmadı. Lütfen Google AI Studio\'dan "Free of Charge" bir proje açtığına emin ol.');
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
