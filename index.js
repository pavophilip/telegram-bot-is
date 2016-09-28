var Config = require('./config.json');
var Telegram = require('node-telegram-bot-api');
var Writer = require('./modules/writer');

var bot = new Telegram(Config.api_token, {polling: true});

var common_options = {
    parse_mode: 'HTML'
};

bot.onText(/\/start/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.welcome(), common_options);
});

bot.onText(/\/week$/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.week(), common_options);
});

bot.onText(/\/week_even/, function (msg, match) {
    bot.sendMessage(msg.from.id, Writer.week('even'), common_options);
});

bot.onText(/\/week_odd/, function (msg, match) {
    bot.sendMessage(msg.from.id, Writer.week('odd'), common_options);
});

bot.onText(/\/today/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.day(), common_options);
});

bot.onText(/\/now/, function (msg) {
    var options = common_options;
    bot.sendMessage(msg.from.id, Writer.lesson(), options);
});

bot.onText(/\/next/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.next(), common_options);
});

bot.onText(/\/day([1-5]$)/, function (msg, match) {
    bot.sendMessage(msg.from.id, Writer.day(match[1] - 1), common_options);
});

bot.onText(/\/tomorrow/, function (msg, match) {
    bot.sendMessage(msg.from.id, Writer.tomorrow(), common_options);
});

//not documented
bot.onText(/\/download/, function (msg, match) {
    bot.sendDocument(msg.from.id, Config.source, common_options);
});

