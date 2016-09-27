var Config = require('../../config.json');
var Format = require('string-template');
var Shedule = require('./../shedule')(Config.source);
var Lang = Config.lang;

var Formatter = {
    welcome: function(){
        return text = Format(Lang.welcome, {
            test: "azaza"
        });
    },

    week: function (week) {
        if(!week){
            week = Shedule.getCurrentWeek();
        }

        var days_list ="";

        Shedule.getShedule(week).forEach(function (day, id) {
            days_list += Formatter.day(id, week);
        });

        return text = Format(Lang.week, {
            week_header: Format(Lang.week_header, {
                week_type: Lang['week_type_' + week]
            }),
            days_list: days_list,
            week_footer: Format(Lang.week_footer, {
                week_type: Lang['week_type_' + (week == 'odd' ? 'even' : 'odd')],
                week_type_key: week == 'odd' ? 'even' : 'odd'
            })
        });
    },

    day: function (id, week) {
        var day = Shedule.getShedule(week, id);
        var shedule = "";
        day.forEach(function (item, i) {
            var t = item[week];

            if(!t){
                t = {
                    title: 'Нет',
                    cab: ''
                }
            }
            shedule += Format(Lang.shedule_item, {
                time: Shedule.getTime(i, true),
                title: t.title,
                cab: t.cab
            }) + "\n";
        });

        return text = Format(Lang.week_day_item, {
            day_title: Shedule.getDayTitle(id),
            day_shedule: shedule
        });
    }
};
module.exports = Formatter;