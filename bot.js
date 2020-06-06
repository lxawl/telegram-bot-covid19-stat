require('dotenv').config(); // launch token package
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup'); // add buttons
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.token);
// bot.start((ctx) => ctx.reply('Welcome!'));
// bot.start((ctx) => console.log(ctx.message));
bot.start((ctx) =>
  ctx.reply(
    `Welcome, ${ctx.message.from.first_name} ${ctx.message.from.last_name}!
Узнай статистику по короновирусу

Введи название страны на английском и получи результат
Помощь /help`,
    Markup.keyboard([
      ['China', 'Russia'],
      ['Ukraine', 'Kazakhstan'],
    ])
      .resize()
      .extra()
  )
);

// bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

// bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('text', async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatedData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
    `;

    ctx.reply(formatedData);
  } catch {
    console.log('error');
    ctx.reply("Doesn't exist, see /help");
  }

  //   ctx.reply(formatedData);
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

console.log('Bot started');
