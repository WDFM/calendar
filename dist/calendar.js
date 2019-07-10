;
(function (global, undefined) {
    "use strict" // 使用js严格模式检查，使语法更规范
    var _global;

    var calendar = {
        /**
         * 默认参数
         * @param {Number || String} width 宽度
         * @param {Number || String} height 高度
         * @param {Number} year 默认显示的年份
         * @param {Number} month 默认显示的月份
         * @param {String} selector 选择器
         */
        defaultOptions: {
            width: 'auto',
            height: 'auto',
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1 > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
            selector: '#calendar-container'
        },
        weeks: function () {
            var week = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
            var weekElem = '';
            for (let i = 0; i < week.length; i++) {                    
                weekElem += '<div class="week-item">'+ week[i] +'</div>';
            }
            return weekElem;
        },
        days: function() {
            var days = calendar.getDays();
            var daysELem = '';
            var currentDate = new Date().getDate(),
                currentMonth = new Date().getMonth() + 1,
                currentYear = new Date().getFullYear();
            for(var i = 0; i < days.length; i++) {
                var date = days[i];
                var current = currentDate === date && currentMonth === parseInt(calendar.defaultOptions.month) && currentYear === calendar.defaultOptions.year ? 'current' : '';
                daysELem += '<div class="dates-item '+current+'" onclick="calendar.selectDay(this)">'+ date +'</div>'
            }
            // console.log(days)
            return daysELem;
        },
        /**
         * 初始化
         * @param {} options 
         */
        init: function (options) {
            if (!options) {
                options = calendar.defaultOptions;
            } else {
                calendar.defaultOptions.width = options.width ? options.width : calendar.defaultOptions.width;
                calendar.defaultOptions.height = options.height ? options.height : calendar.defaultOptions.height;
                calendar.defaultOptions.year = options.year ? options.year : calendar.defaultOptions.year;
                calendar.defaultOptions.month = options.month ? options.month : calendar.defaultOptions.month;
                calendar.defaultOptions.selector = options.selector ? options.selector : calendar.defaultOptions.selector;
            }
            
            calendar.render(calendar.defaultOptions);
        },
        /**
         * 获取对应的日期
         * @param {Number} year 
         * @param {Number} month 
         */
        getDays: function(year, month) {
            year = year ? year : calendar.defaultOptions.year;
            month = month ? month : parseInt(calendar.defaultOptions.month);
            // 闰年判断
            var RN = year % 4 === 0 ? true : false;
            // 大小月判断
            // 大月31天  1,3,5,7,8,10,12
            // 小月30天  4,6,9,11
            // 二月28/29天  2
            var daysLen = 0;
            if(month === 2) {
                // console.log('二月');
                daysLen = RN ? 29 : 28;
            } else if([4,6,9,11].indexOf(month) !== -1) {
                // console.log('小月');
                daysLen = 30;
            } else {
                // console.log('大月');
                daysLen = 31;
            }
            var week = new Date(calendar.defaultOptions.year + '-' + calendar.defaultOptions.month + '-01').getDay();
            var days = [];
            for(var j = 0; j < week; j++) {
                days.push('');
            };
            for(var i = 1; i <= daysLen; i++) {
                days.push(i);
            };
            return days;
        },
        /**
         * 渲染页面
         */
        render: function(options) {
            if(!options) {
                options = calendar.defaultOptions
            }
            var root = document.querySelector(options.selector);

            var header = '<div class="header flex-box center">\
                            <button id="prev" class="selector" onclick="calendar.prevMonth()"><</button>\
                            <div class="date flex-box center">\
                                <div id="year">' + options.year + '</div>年<div id="month">' + options.month + '</div>月\
                            </div>\
                            <button id="next" class="selector" onclick="calendar.nextMonth()">></button>\
                        </div>',

                content = '<div id="calendar-content">\
                            <div class="week flex-box center">'+calendar.weeks()+'</div>\
                            <div class="dates flex-box left">'+calendar.days()+'</div>\
                        </div>';
            root.innerHTML = '<div id="calendar-wrap" style="width: ' + options.width + ';height: ' + options.height + ';">'+ header + content +'</div>';
            console.log('rendered')
        },
        /**
         * 前一个月
         */
        prevMonth: function() {
            var year = calendar.defaultOptions.year,
                month = parseInt(calendar.defaultOptions.month);
            if(month < 2) {
                month = 12;
                year --;
            } else {
                month --;
            }
            calendar.defaultOptions.year = year;
            calendar.defaultOptions.month = month < 10 ? '0' + month : month;
            calendar.render();
        },
        /**
         * 下一个月
         */
        nextMonth: function() {
            var year = calendar.defaultOptions.year,
                month = parseInt(calendar.defaultOptions.month);
            if(month == 12) {
                month = 1;
                year ++;
            } else {
                month ++;
            }
            calendar.defaultOptions.year = year;
            calendar.defaultOptions.month = month < 10 ? '0' + month : month;
            calendar.render();
        },
        /**
         * 选择日期
         */
        selectDay: function(e) {
            console.log(e.innerText)
            return {
                year: calendar.defaultOptions.year,
                month: calendar.defaultOptions.month,
                date: e.innerText
            }
        }
    }

    // 将插件对象暴露给全局对象
    _global = (function () {
        return this || (0, eval)('this');
    })();
    // 如果存在加载器，就使用加载器
    if (typeof module !== "undefined" && module.exports) {
        module.exports = calendar;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return calendar;
        });
    } else {
        _global.calendar = calendar;
    }
    // !('calendar' in _global) && (_global.calendar = calendar);
})();



/** 
 *  为了提升速度，将插件逻辑写在私有作用域中

    实现私有作用域，最好的办法就是使用闭包。可以把插件当做一个函数，插件内部的变量及函数的私有变量，为了在调用插件后依旧能使用其功能，闭包的作用就是延长函数(插件)内部变量的生命周期，使得插件函数可以重复调用，而不影响用户自身作用域。

    在定义插件之前添加一个分号，可以解决js合并时可能会产生的错误问题；

    undefined在老一辈的浏览器是不被支持的，直接使用会报错，js框架要考虑到兼容性，因此增加一个形参undefined，就算有人把外面的 undefined 定义了，里面的 undefined 依然不受影响；

    把window对象作为参数传入，是避免了函数执行的时候到外部去查找。

    其实，我们觉得直接传window对象进去，我觉得还是不太妥当。我们并不确定我们的插件就一定用于浏览器上，也有可能使用在一些非浏览端上。所以我们还可以这么干，我们不传参数，直接取当前的全局this对象为作顶级对象用。
*/