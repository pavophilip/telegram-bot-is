XLSX = require('xlsx');


module.exports = function (src) {
    var workbook = XLSX.readFile(src);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];

    var times = [
        {
            b: '9:00',
            e: '10:30'
        },
        {
            b: '10:45',
            e: '12:15'
        },
        {
            b: '12:30',
            e: '14:00'
        },
        {
            b: '14:00',
            e: '16:30'
        },
        {
            b: '16:15',
            e: '17:45'
        },
        {
            b: '18:00',
            e: '19:30'
        }
    ];

    var weekdays = [
        'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'
    ];

    function parseShedule(worksheet) {
        var days = [];

        var curr_lesson = null,
            curr_week = null;
        var curr_day = -1;

        for(c in worksheet){
            var col = c.charAt(0);
            var value = worksheet[c].v;
            if(col == 'A'){
                curr_day++;
                days.push([]);
            }else if(col == 'B'){
                curr_lesson = parseInt(value.charAt(0)) - 1;
                days[curr_day].push({
                    even: {},
                    odd: {}
                });
            }else if(col == 'D'){
                curr_week = value == 'нечет.' ? 'odd' : 'even'
            }else if(col == 'E'){
                days[curr_day][curr_lesson][curr_week].title = value;
            }else if(col == 'F'){
                days[curr_day][curr_lesson][curr_week].cab = value;
            }
        }

        return days;
    }

    function clearDay(day, week){
        var last = day.length - 1;

        for(var i = day.length - 1; i >= 0; i--){
            if(day[i][week].title){
                last = i;
                break;
            }
        }
        return day.slice(0, last+1);
    }

    var shedule = parseShedule(worksheet);

    return {
        getShedule: function (week, day) {
            var items = [];
            if(day !== undefined){
                return clearDay(shedule[day], week);
            }

            shedule.forEach(function(day) {
                items.push(clearDay(day, week));
            });

            return items;
        },

        shedule: shedule,

        times: times,

        getTime: function (id, format) {
            var t = times[id];
            if(!format) return t;
            return t.b + '-' + t.e;
        },

        getDayTitle: function (id) {
            return weekdays[id];
        },

        getCurrentWeek: function () {
            var d = new Date().getDate() - 1;
            if (d % 2 == 0)
                return 'odd';
            else
                return 'even';
        }
    }
};