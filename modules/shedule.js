XLSX = require('xlsx');
var Lang = require('../lang.json');

module.exports = function (src) {
    var workbook = XLSX.readFile(src);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];

    var times = Lang.times;

    var weekdays = Lang.weekdays;

    function parseShedule(worksheet) {
        var days = [];

        var curr_lesson = null,
            curr_week = null;
        var curr_day = -1;

        for (c in worksheet) {
            var col = c.charAt(0);
            var value = worksheet[c].v;
            if (col == 'A') {
                curr_day++;
                days.push([]);
            } else if (col == 'B') {
                curr_lesson = parseInt(value.charAt(0)) - 1;
                days[curr_day].push({
                    even: {},
                    odd: {}
                });
            } else if (col == 'D') {
                curr_week = value == 'нечет.' ? 'odd' : 'even'
            } else if (col == 'E') {
                days[curr_day][curr_lesson][curr_week].title = value;
            } else if (col == 'F') {
                days[curr_day][curr_lesson][curr_week].cab = value;
            }
        }

        return days;
    }

    function clearDay(day, week) {
        var last = day.length - 1;

        for (var i = day.length - 1; i >= 0; i--) {
            if (day[i][week].title) {
                last = i;
                break;
            }
        }

        return day.slice(0, last + 1);
    }

    function getTime(id) {
        return times[id];
    }

    function getDay(date) {
        return date.getDay() - 1;
    }

    function getCurrentDay() {
        return getDay(new Date());
    }

    function incDate(inc, date) {
        if (!date) {
            date = new Date();
        }
        var n = new Date();
        n.setDate(date.getDate() + inc);
        return n;
    }

    var shedule = parseShedule(worksheet);

    return {
        getShedule: function (week, day) {
            var items = [];
            if (day !== undefined) {
                return clearDay(shedule[day], week);
            }

            shedule.forEach(function (day) {
                items.push(clearDay(day, week));
            });

            return items;
        },

        shedule: shedule,

        times: times,

        getTime: getTime,

        getDayTitle: function (id) {
            return weekdays[id];
        },

        getCurrentWeek: function () {

            var d = new Date().getDate();

            if (!(Math.floor(d / 7) % 2))
                return 'odd';
            else
                return 'even';
        },

        getDay: getDay,

        getCurrentDay: getCurrentDay,

        incDate: incDate,

        getLessonByTime: function (shedule, week, time) {
            var found = null;
            shedule.forEach(function (lesson, index) {
                lesson = lesson[week];
                lesson.time = getTime(index);

                var begin = lesson.time.b.split(':');
                var end = lesson.time.e.split(':');

                begin = parseInt(begin[0]) * 60 + parseInt(begin[1]);
                end = parseInt(end[0]) * 60 + parseInt(end[1]);
                if (!found && (begin <= (time.h * 60 + time.m) && end >= (time.h * 60 + time.m))) {
                    found = lesson;
                }
            });

            return found;
        },

        getNextBegin: function (time) {
            var now = new Date();
            now = {
                h: now.getHours(),
                m: now.getMinutes()
            };

            var found = null;

            times.forEach(function (time) {
                time = time.b.split(':');
                var lesson_time = {
                    h: parseInt(time[0]),
                    m: parseInt(time[1])
                };
                if (!found && (now.h * 60 + now.m) < (lesson_time.h * 60 + lesson_time.m)) {
                    found = lesson_time;
                }
            });

            return found;
        }
    }
};