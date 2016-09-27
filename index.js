var Config = require('./config.json');
var Telegram = require('node-telegram-bot-api');
var Writer = require('./modules/writer');

var bot = new Telegram(Config.api_token, {polling: true});

bot.onText(/\/start/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.welcome(), {parse_mode: 'HTML'});
});

bot.onText(/\/week/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.week(), {parse_mode: 'HTML'});
});

bot.onText(/\/today/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.day(), {parse_mode: 'HTML'});
});

bot.onText(/\/now/, function (msg) {
    bot.sendMessage(msg.from.id, Writer.lesson(), {parse_mode: 'HTML'});
});

bot.onText(/\/next/, function (mgs) {
    bot.sendMessage(msg.from.id, Writer.next(), {parse_mode: 'HTML'});
});