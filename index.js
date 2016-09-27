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