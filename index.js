require("dotenv").config();
const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const db = require("./database/handler.js");
const osuAPI = require("./osu-api");
const osu = new osuAPI();
const msgParser = require("./messageParser");

bot.start(async (ctx) => {
  db.addUser(ctx.from);
  ctx.reply("Hello, this bot created for getting user pages from osu.");
});

bot.hears("hello", (ctx) => ctx.reply("Hey!"));

bot.command("user", async (ctx) => {
  let userId = ctx.message.text.split(" ")
    ? ctx.message.text.split(" ")[1]
    : undefined;
  if (!userId) {
    ctx.reply("You have to specify user's name or id\n`/user 9532683`", {
      parse_mode: "Markdown",
    });
    return;
  }
  let user = await osu.user(userId);
  if (!user) {
    ctx.reply("not found");
  } else {
    ctx.reply(msgParser.user(user), {
      parse_mode: "HTML",
    });
  }
  let activity = await osu.recentActivity(user);
});

bot.launch();
