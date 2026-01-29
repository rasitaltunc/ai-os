import "dotenv/config";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(async (ctx) => {
  await ctx.reply(
    "Selam kanka 😎 Ben Atlas.\n\nKomutlar:\n/brief am|pm|trends\n/task add <...>\n/task list\n/mood normal\n/reset\n/settings",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📊 Paneli Aç", web_app: { url: process.env.APP_BASE_URL! } }]
        ]
      }
    }
  );
});

bot.command("brief", (ctx) =>
  ctx.reply("🌅 AM Brief (MVP)\n- (Şimdilik) görev yok.\n/task add ... ile başla")
);

bot.command("task", (ctx) =>
  ctx.reply("🧾 Task MVP: Şimdilik sadece iskelet. Sonraki adımda Supabase bağlayacağız.")
);

bot.command("mood", (ctx) =>
  ctx.reply("Mood kaydedildi ✅ Bugün mini mod: 1 küçük hedef seçelim.")
);

bot.command("reset", (ctx) =>
  ctx.reply("🫁 60 sn reset: 4 al, 4 tut, 6 ver (3 tur). Sonra 1 küçük adım yaz.")
);

bot.command("settings", (ctx) =>
  ctx.reply("⚙️ Ayarlar: (MVP) — sonra bağlayacağız.")
);

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
