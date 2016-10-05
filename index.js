var Config = require('./config.json')[process.env.NODE_ENV];
var Telegram = require('node-telegram-bot-api');
var Writer = require('./modules/writer');
var Lang = require('./lang.json');
var Client = require('./modules/Client');
var Notification = require('./modules/Notification');

var Bot = new Telegram(Config.api_token, {polling: true});
Notification.init(Bot);

var common_options = Config.message_options;

Bot.onText(/\/start/, function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        console.log(err, r);
    });

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.start
    };
    Bot.sendMessage(msg.from.id, Writer.welcome(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week
    };
    Bot.sendMessage(msg.from.id, Writer.week(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week_even, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_even
    };
    Bot.sendMessage(msg.from.id, Writer.week('even'), common_options);
});

Bot.onText(new RegExp(Lang.aliases.week_odd, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.week_odd
    };
    Bot.sendMessage(msg.from.id, Writer.week('odd'), common_options);
});

Bot.onText(new RegExp(Lang.aliases.today, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options  = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.today
    };
    Bot.sendMessage(msg.from.id, Writer.day(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.now, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options = common_options;
    Bot.sendMessage(msg.from.id, Writer.lesson(), options);
});

Bot.onText(new RegExp(Lang.aliases.next, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    Bot.sendMessage(msg.from.id, Writer.next(), common_options);
});

Bot.onText(new RegExp(Lang.aliases.day, 'i'), function (msg, match) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

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
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    Bot.sendMessage(msg.from.id, Writer.tomorrow(), common_options);
});

//not documented
Bot.onText(new RegExp(Lang.aliases.download, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    Bot.sendDocument(msg.from.id, Config.source, common_options);
});

Bot.onText(new RegExp(Lang.aliases.help, 'i'), function (msg) {
    var from = msg.from;
    from.telegram_id = from.id;
    Client.check(from, function (err, r) {
        //console.log(err, r);
    });

    var options = common_options;
    options.reply_markup = {
        keyboard: Lang.keyboards.help
    };
    Bot.sendMessage(msg.from.id, Lang.help_text, common_options);
});

String.prototype.repeat = function(times) {
    return (new Array(times + 1)).join(this);
};

