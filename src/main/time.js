"use strict";

/**
 * Works for time in the range 4000 B.C. - 3000 A.C.
 * Timestamp is calculated from year 1, 1st January, 00:00.
 * Timestamp is in milliseconds.
 * 
 * The year 0 is that in which one supposes that Jesus Christ was born, which several chronologists mark 1 before the birth of Jesus Christ
 and which we marked 0, so that the sum of the years before and after Jesus Christ gives the interval which is between these years,
 and where numbers divisible by 4 mark the leap years as so many before or after Jesus Christ.
 —Jacques Cassini, Tables astronomiques, 5, translated from French
 *
 * Conclusion: Year 0 in our library equals year -1 B.C.
 *  
 */
var Time = (function () {
    var appContext = window || global;

    /* TEMP Start */

    //            // Call hidden function
    //            var isPositionValid = validatePosition.call(this);

    //    function DateExtended(firstName, subject) {
    //        Date.call(this, firstName);
    //    }
    //    DateExtended.prototype = Object.create(Date.prototype);

    //        if (!(date instanceof Date)) {
    //            throw new Error("Date should be a Time.Date() object.");
    //        }

    /* TEMP End */

    var Util = (function () {
        /**
         * Works only for custom objects with no recursive references.
         * 
         * If two references point to the same sub-object,
         * the copy contains two different copies of it.
         */
        var clone = function (obj) {
            if ((obj === null) || (typeof obj !== "object")) {
                return obj;
            }

            var cloned = obj.constructor();

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = clone(obj[key]);
                }
            }
            return cloned;
        };

        return {
            "clone": clone
        };
    }());
    
    var ValidatorGeneral = (function () {
        var isEmpty = function (value) {
            return value === undefined || value === null || value === "";
        };

        var isInteger = function (value) {
            return (typeof value === 'number') && value % 1 === 0;
        };
        
        return {
            "isEmpty": isEmpty,
            "isInteger": isInteger
        };
    }());

    var Const = (function () {
        var DAYS = {
            "SUNDAY": 0,
            "MONDAY": 1,
            "TUESDAY": 2,
            "WEDNESDAY": 3,
            "THURSDAY": 4,
            "FRIDAY": 5,
            "SATURDAY": 6
        };

        var MONTHS = {
            "JANUARY": 0,
            "FEBRUARY": 1,
            "MARCH": 2,
            "APRIL": 3,
            "MAY": 4,
            "JUNE": 5,
            "JULY": 6,
            "AUGUST": 7,
            "SEPTEMBER": 8,
            "OCTOBER": 9,
            "NOVEMBER": 10,
            "DECEMBER": 11
        };

        var PERIODS_IN_MILLISEC = (function () {
            var second = 1000;
            var minute = second * 60;
            var hour = minute * 60;
            var day = hour * 24;

            return {
                "SECOND": second,
                "MINUTE": minute,
                "HOUR": hour,
                "DAY": day
            };
        }());

        var LIMITS = {
            "MIN_TIMESTAMP": -128563200000000,
            "MAX_TIMESTAMP": 96422400000000,
            "MIN_YEAR": -4000,
            "MAX_YEAR": 3000,
            "MIN_MONTH": 0,
            "MAX_MONTH": 11,
            "MIN_DAY": 1,
            "MAX_DAY": 31,
            "MIN_HOUR": 0,
            "MAX_HOUR": 23,
            "MIN_MINUTE": 0,
            "MAX_MINUTE": 59,
            "MIN_SECOND": 0,
            "MAX_SECOND": 59,
            "MIN_MILLISECOND": 0,
            "MAX_MILLISECOND": 1000
        };

        var MISC = {
            "LEAP_YEAR_DAYS": 366,
            "COMMON_YEAR_DAYS": 365
        };

        var allConstLists = [DAYS, MONTHS, PERIODS_IN_MILLISEC, LIMITS, MISC];

        var get = function (requestedConst) {
            if (ValidatorGeneral.isEmpty(requestedConst)) {
                throw new Error("Invalid argument: Please provide a string argument for the requested constant.");
            }
            for (var index in allConstLists) {
                var currentList = allConstLists[index];
                for (var key in currentList) {
                    if (key === requestedConst) {
                        return currentList[key];
                    }
                }
            }
        };

        return {
            "get": get
        };
    }());

    var ValidatorDate = (function () {
        var isVanillaDate = function (value) {
            return !isEmpty(value) && (value instanceof appContext.Date);
        };

        var isTimestamp = function (value) {
            return isInteger(value) && value <= Const.get("MAX_TIMESTAMP") && value >= Const.get("MIN_TIMESTAMP");
        };

        var isYear = function (value) {
            return isInteger(value) && value <= Const.get("MAX_YEAR") && value >= Const.get("MIN_YEAR");
        };

        var isMonth = function (value) {
            return isInteger(value) && value <= Const.get("MAX_MONTH") && value >= Const.get("MIN_MONTH");
        };

        var isDay = function (value) {
            return isInteger(value) && value <= Const.get("MAX_DAY") && value >= Const.get("MIN_DAY");
        };

        var isHour = function (value) {
            return isInteger(value) && value <= Const.get("MAX_HOUR") && value >= Const.get("MIN_HOUR");
        };

        var isMinute = function (value) {
            return isInteger(value) && value <= Const.get("MAX_MINUTE") && value >= Const.get("MIN_MINUTE");
        };

        var isSecond = function (value) {
            return isInteger(value) && value <= Const.get("MAX_SECOND") && value >= Const.get("MIN_SECOND");
        };

        var isMillisecond = function (value) {
            return isInteger(value) && value <= Const.get("MAX_MILLISECOND") && value >= Const.get("MIN_MILLISECOND");
        };

        var isLeapYear = function (value) {
            if (!isInteger(value)) {
                throw new Error("Year should be an integer number.");
            }

            var isLeap = false;

            if (value % 4 === 0) {
                if (value % 100 === 0) {
                    if (value % 400 === 0) {
                        isLeap = true;
                    } else {
                        isLeap = false;
                    }
                } else {
                    isLeap = true;
                }
            } else {
                isLeap = false;
            }

            return isLeap;
        };

        var isFormatString = function (value) {
            // TODO:
            return (typeof value !== "string");
        };

        return {
            "isTimestamp": isTimestamp,
            "isLeapYear": isLeapYear,
            "isVanillaDate": isVanillaDate,
            "isYear": isYear,
            "isMonth": isMonth,
            "isDay": isDay,
            "isHour": isHour,
            "isMinute": isMinute,
            "isSecond": isSecond,
            "isMillisecond": isMillisecond,
            "isFormatString": isFormatString
        };
    }());

    var parse = function (dateString, formatType) {
        if ((typeof dateString !== "string") || (typeof formatType !== "string")) {
            throw new Error("Invalid arguments: Expected string for date and format.");
        }
        return new Date();
    };

    var getDaysInYear = function (year) {
        return (ValidatorDate.isLeapYear(year)) ? Const.getDaysLeapYear() : Const.getDaysCommonYear();
    };

    var convertVanillaDate = function (date) {
        if (!ValidatorDate.isVanillaDate(date)) {
            throw new Error("Invalid argument: Expected vanilla JavaScript Date.");
        }

        var cutomDate = new Date();
        cutomDate.year(date.getFullYear());
        cutomDate.month(date.getMonth());
        cutomDate.date(date.getDate());
        cutomDate.hour(date.getHours());
        cutomDate.minute(date.getMinutes());
        cutomDate.second(date.getSeconds());
        cutomDate.millisecond(date.getMilliseconds());
        return cutomDate;
    };

//    var convertTimestampToDate = function (timestamp) {
//        if (!ValidatorDate.isTimestamp(timestamp)) {
//            throw new Error("Invalid argument: timestamp.");
//        }
//
//        var cutomDate = new Date();
//
//        return cutomDate;
//    };

    var Date = (function () {
        // Constructor
        var Date = function (timestamp) {
            if (!(this instanceof Date)) {
                return new Date(timestamp);
            }

            this._year = 0;
            this._month = 0;
            this._day = 1;
            this._hour = 0;
            this._minute = 0;
            this._second = 0;
            this._millisecond = 0;

            if (!ValidatorGeneral.isEmpty(timestamp)) {
                if (!ValidatorDate.isTimestamp(timestamp)) {
                    throw new Error("Invalid argument: timestamp.");
                }
                //TODO: convertTimestampToDate(timestamp);
            } else {
                var nowVanillaDate = new appContext.Date();
                this._year = nowVanillaDate.getFullYear();
                this._month = nowVanillaDate.getMonth();
                this._day = nowVanillaDate.getDate();
                this._hour = nowVanillaDate.getHours();
                this._minute = nowVanillaDate.getMinutes();
                this._second = nowVanillaDate.getSeconds();
                this._millisecond = nowVanillaDate.getMilliseconds();
            }
        };

        Date.prototype.year = function (year) {
            if (ValidatorGeneral.isEmpty(year)) {
                return this._year;
            }

            if (ValidatorDate.isYear(year)) {
                if (!ValidatorDate.isLeapYear(year)) {
                    if (this._day === 29 && this._month === Const.MONTHS.FEBRUARY) {
                        throw new Error("Invalid argument: year. Cannot set a common year when the date is 29 February.");
                    }
                }

                this._year = year;
                return this;
            }

            throw new Error("Invalid argument: year");
        };

        Date.prototype.month = function (month) {
            if (ValidatorGeneral.isEmpty(month)) {
                return this._month;
            }

            if (ValidatorDate.isMonth(month)) {
                this._month = month;
                return this;
            }

            throw new Error("Invalid argument: month");
        };

        Date.prototype.day = function (day) {
            if (ValidatorGeneral.isEmpty(day)) {
                return this._day;
            }

            if (ValidatorDate.isDay(day)) {
                this._day = day;
                return this;
            }

            throw new Error("Invalid argument: day");
        };

        Date.prototype.hour = function (hour) {
            if (ValidatorGeneral.isEmpty(hour)) {
                return this._hour;
            }

            if (ValidatorDate.isHour(hour)) {
                this._hour = hour;
                return this;
            }

            throw new Error("Invalid argument: hour");
        };

        Date.prototype.minute = function (minute) {
            if (ValidatorGeneral.isEmpty(minute)) {
                return this._minute;
            }

            if (ValidatorDate.isMinute(minute)) {
                this._minute = minute;
                return this;
            }

            throw new Error("Invalid argument: minute");
        };

        Date.prototype.second = function (second) {
            if (ValidatorGeneral.isEmpty(second)) {
                return this._second;
            }

            if (ValidatorDate.isSecond(second)) {
                this._second = second;
                return this;
            }

            throw new Error("Invalid argument: second");
        };

        Date.prototype.millisecond = function (millisecond) {
            if (ValidatorGeneral.isEmpty(millisecond)) {
                return this._millisecond;
            }

            if (ValidatorDate.isMillisecond(millisecond)) {
                this._millisecond = millisecond;
                return this;
            }

            throw new Error("Invalid argument: millisecond");
        };

        Date.prototype.format = function format(format) {
            if (!ValidatorDate.isFormatString(format)) {
                throw new Error("Invalid argument: format.");
            }
            // TODO:
            return "1st July 2015";
        };

        Date.prototype.getTimestamp = function () {
            return this._timestamp;
        };

        Date.prototype.getDayOfWeek = function () {
            // TODO: 
        };

        Date.prototype.isLeapYear = function () {
            return ValidatorDate.isLeapYear(this._year);
        };

        Date.prototype.toString = function () {
            var toString = "timestamp: " + this._timestamp + "\r\n year: " + this._year + "\r\n month: " + this._month
                    + "\r\n day: " + this._day + "\r\n hour: " + this._hour + "\r\n minute: " + this._minute
                    + "\r\n second: " + this._second + "\r\n millisecond: " + this._millisecond;
            return toString;
        };

        return Date;
    }());

    return {
        "Date": Date,
        "parse": parse,
        "get": Const.get,
        "isLeapYear": ValidatorDate.isLeapYear,
        "getDaysInYear": getDaysInYear,
        "convertVanillaDate": convertVanillaDate
    };
}());