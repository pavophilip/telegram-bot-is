var Config = require('./config.json');
var Telegram = require('node-telegram-bot-api');
var Writer = require('./modules/writer');
var Lang = require('./lang.json');

var bot = new Telegram(Config.api_token, {polling: true});

var common_options = {
    parse_mode: 'HTML'
};

bot.onText(/\/start/, function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.start
    };
    bot.sendMessage(msg.from.id, Writer.welcome(), common_options);
});

bot.onText(new RegExp(Lang.aliases.week, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week
    };
    bot.sendMessage(msg.from.id, Writer.week(), common_options);
});

bot.onText(new RegExp(Lang.aliases.week_even, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_even
    };
    bot.sendMessage(msg.from.id, Writer.week('even'), common_options);
});

bot.onText(new RegExp(Lang.aliases.week_odd, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_odd
    };
    bot.sendMessage(msg.from.id, Writer.week('odd'), common_options);
});

bot.onText(new RegExp(Lang.aliases.today, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.today
    };
    bot.sendMessage(msg.from.id, Writer.day(), common_options);
});

bot.onText(new RegExp(Lang.aliases.now, 'i'), function (msg) {
    var options = common_options;
    bot.sendMessage(msg.from.id, Writer.lesson(), options);
});

bot.onText(new RegExp(Lang.aliases.next, 'i'), function (msg) {
    bot.sendMessage(msg.from.id, Writer.next(), common_options);
});

bot.onText(new RegExp(Lang.aliases.day, 'i'), function (msg, match) {
    var day = parseInt(match[1]);
    if(!day){
        var wd = Lang.weekdays.map(function(value) {
            return value.toLowerCase();
        });
        day = wd.indexOf(match.input.toLowerCase());
    }else{
        day = day - 1;
    }

    bot.sendMessage(msg.from.id, Writer.day(day), common_options);
});

bot.onText(new RegExp(Lang.aliases.tomorrow, 'i'), function (msg) {
    bot.sendMessage(msg.from.id, Writer.tomorrow(), common_options);
});

//not documented
bot.onText(new RegExp(Lang.aliases.download, 'i'), function (msg) {
    bot.sendDocument(msg.from.id, Config.source, common_options);
});

bot.onText(new RegExp(Lang.aliases.help, 'i'), function (msg) {
    var options = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.help
    };
    bot.sendMessage(msg.from.id, Lang.help_text, common_options);
});

