var Cron = require('node-schedule');
var Config = require('../config.json')[process.env.NODE_ENV];
var Lang = require('../lang.json');
var Shedule = require('./shedule')(Config.source);
var Writer = require('./writer');
var Client = require('./Client');

var now = Shedule.nowDate();

var testTime = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds() + 1
};
var Bot = null;
var job = null;

function sendNotify(to){
    var options = Config.message_options;
    options.reply_markup = {
        inline_keyboard: Lang.keyboards.today_inline
    };

    Bot.sendMessage(to, Writer.daily_notification(), options);
}

module.exports = {
    init: function (bot) {
        Bot = bot;
        if(job) return;
        job = Cron.scheduleJob(Config.default_notify_time, function(){
            Client.getAll(function (err, data) {
                if(data){
                    data.forEach(function (item) {
                        console.log("sending to ", item.telegram_id);
                        sendNotify(item.telegram_id);
                    });
                }
            });
        });
    }
};