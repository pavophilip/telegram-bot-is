var Config = require('./config.json')[process.env.NODE_ENV];
var Telegram = require('node-telegram-bot-api');
var Writer = require('./modules/writer');
var Lang = require('./lang.json');
var Client = require('./modules/Client');
var Notification = require('./modules/Notification');

var Bot = new Telegram(Config.api_token, {polling: true});
Notification.init(Bot);

var common_options = Config.message_options;

Bot.onText(new RegExp(Lang.aliases.start, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.start
    };
    Bot.sendMessage(msg.from.id, Writer.welcome(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week, 'i'), function (msg) {

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week
    };
    Bot.sendMessage(msg.from.id, Writer.week(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week_even, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_even
    };
    Bot.sendMessage(msg.from.id, Writer.week('even'), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week_odd, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_odd
    };
    Bot.sendMessage(msg.from.id, Writer.week('odd'), common_options);
});

Bot.onText(new RegExp(Lang.aliases.today, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        inline_keyboard: Lang.keyboards.today_inline
    };
    Bot.sendMessage(msg.from.id, Writer.day(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.now, 'i'), function (msg) {
    var options = common_options;
    Bot.sendMessage(msg.from.id, Writer.lesson(), options);
});

Bot.onText(new RegExp(Lang.aliases.next, 'i'), function (msg) {
    Bot.sendMessage(msg.from.id, Writer.next(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.day, 'i'), function (msg, match) {
    var day = parseInt(match[1]);
    if(!day){
        var wd = Lang.weekdays.map(function(value) {
            return value.toLowerCase();
        });
        day = wd.indexOf(match.input.toLowerCase());
    }else{
        day = day - 1;
    }

    Bot.sendMessage(msg.from.id, Writer.day(day), common_options);
});

Bot.onText(new RegExp(Lang.aliases.tomorrow, 'i'), function (msg) {
    var options  = common_options;
    options.reply_markup = {
        inline_keyboard: []
    };
    Bot.sendMessage(msg.from.id, Writer.tomorrow(), common_options);
});

//not documented
Bot.onText(new RegExp(Lang.aliases.download, 'i'), function (msg) {
    Bot.sendDocument(msg.from.id, Config.source, common_options);
});

Bot.onText(new RegExp(Lang.aliases.help, 'i'), function (msg) {
    Bot.sendMessage(msg.from.id, Lang.help_text, common_options);
});

Bot.onText(new RegExp(Lang.aliases.shedule, 'i'), function (msg) {
    var options = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.shedule
    };
    Bot.sendMessage(msg.from.id, Writer.week(), common_options);
});

Bot.onText(/(.*)/, function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        if(err){
            console.log(err.trace);
        }
    });

    console.log(msg.from.id + ": " + msg.text)
});

Bot.on('callback_query', function (msg) {
    var cmd = msg.data;

    for(var item in Lang.aliases){
        if(cmd.match(Lang.aliases[item])){
            cmd = item;
        }
    }

    var options = common_options;
    options.message_id = msg.message.message_id;
    options.chat_id = msg.message.chat.id;
    options.reply_markup = {
        inline_keyboard: Lang.keyboards.today_inline
    };

    var response = "";

    if(cmd == 'now'){
        response = Writer.lesson();
    }else if(cmd == 'next'){
        response = Writer.next();
    }

    Bot.editMessageText(response, options).then(function (data) {

    }).catch(function (err) {

    });
    Bot.answerCallbackQuery(msg.id, "");
});

String.prototype.repeat = function(times) {
    return (new Array(times + 1)).join(this);
};