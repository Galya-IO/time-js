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

    //    function error(msg) {
    //        console.error('\r\n' + msg + '\r\n');
    //        // TODO: stop function
    //    }

    //    function DateExtended(firstName, subject) {
    //        Date.call(this, firstName);
    //    }
    //    DateExtended.prototype = Object.create(Date.prototype);

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
            return (value instanceof appContext.Date);
        };

        var isTimestamp = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_TIMESTAMP") && value >= Const.get("MIN_TIMESTAMP");
        };

        var isYear = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_YEAR") && value >= Const.get("MIN_YEAR");
        };

        var isMonth = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_MONTH") && value >= Const.get("MIN_MONTH");
        };

        var isDay = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_DAY") && value >= Const.get("MIN_DAY");
        };

        var isHour = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_HOUR") && value >= Const.get("MIN_HOUR");
        };

        var isMinute = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_MINUTE") && value >= Const.get("MIN_MINUTE");
        };

        var isSecond = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_SECOND") && value >= Const.get("MIN_SECOND");
        };

        var isMillisecond = function (value) {
            return ValidatorGeneral.isInteger(value) && value <= Const.get("MAX_MILLISECOND") && value >= Const.get("MIN_MILLISECOND");
        };

        var isLeapYear = function (value) {
            if (!ValidatorGeneral.isInteger(value)) {
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

    var parseToDate = function (dateString, formatType) {
        if ((typeof dateString !== "string") || (typeof formatType !== "string")) {
            throw new Error("Invalid arguments: Expected string for date and format.");
        }
        return new Date();
    };

    var getDaysInYear = function (year) {
        return (ValidatorDate.isLeapYear(year)) ? Const.getDaysLeapYear() : Const.getDaysCommonYear();
    };

    var Date = (function () {
        // Constructor
        var Date = function (arg, format) {
            if (!(this instanceof Date)) {
                return new Date(arg, format);
            }

            // Private properties
            var _year = 0;
            var _month = 0;
            var _day = 1;
            var _hour = 0;
            var _minute = 0;
            var _second = 0;
            var _millisecond = 0;

            // Private methods
            var setPropertiesFromVanillaDate = function (date) {
                // TODO: decide if UTC or current time zone time is taken
                _year = date.getUTCFullYear();
                _month = date.getUTCMonth();
                _day = date.getUTCDate();
                _hour = date.getUTCHours();
                _minute = date.getUTCMinutes();
                _second = date.getUTCSeconds();
                _millisecond = date.getUTCMilliseconds();
            };

            // Constructor base
            if (!ValidatorGeneral.isEmpty(arg)) {
                if (!ValidatorGeneral.isEmpty(format)) {
                    if (ValidatorDate.isFormatString(format)) {
                        // TODO: Parse date as string to Time.Date() obj based on given format string.
                    } else {
                        throw new Error("Invalid arguments: Date constructor with 2 parameters expects date string and format string.");
                    }
                }

                if (ValidatorDate.isVanillaDate(arg)) {
                    // Converts vanilla Date() obj to Time.Date() obj
                    setPropertiesFromVanillaDate.call(this, arg);
                } else if (ValidatorDate.isTimestamp(arg)) {
                    // TODO: Convert Time.js timestamp number to Time.Date() obj.
                } else {
                    throw new Error("Invalid argument: Expected timestamp, vanilla JavaScript Date or no argument.");
                }
            } else {
                // Sets the current time to the newly instantiated Time.Date() obj.
                var nowVanillaDate = new appContext.Date();
                setPropertiesFromVanillaDate.call(this, nowVanillaDate);
            }

            // Privileged methods
            this.year = function (year) {
                if (ValidatorGeneral.isEmpty(year)) {
                    return _year;
                }

                if (ValidatorDate.isYear(year)) {
                    if (!ValidatorDate.isLeapYear(year)) {
                        if (_day === 29 && _month === Const.MONTHS.FEBRUARY) {
                            throw new Error("Invalid argument: year. Cannot set a common year when the date is 29 February.");
                        }
                    }

                    _year = year;
                    return this;
                }

                throw new Error("Invalid argument: year");
            };

            this.month = function (month) {
                if (ValidatorGeneral.isEmpty(month)) {
                    return _month;
                }

                if (ValidatorDate.isMonth(month)) {
                    _month = month;
                    return this;
                }

                throw new Error("Invalid argument: month");
            };

            this.day = function (day) {
                if (ValidatorGeneral.isEmpty(day)) {
                    return _day;
                }

                if (ValidatorDate.isDay(day)) {
                    _day = day;
                    return this;
                }

                throw new Error("Invalid argument: day");
            };

            this.hour = function (hour) {
                if (ValidatorGeneral.isEmpty(hour)) {
                    return _hour;
                }

                if (ValidatorDate.isHour(hour)) {
                    _hour = hour;
                    return this;
                }

                throw new Error("Invalid argument: hour");
            };

            this.minute = function (minute) {
                if (ValidatorGeneral.isEmpty(minute)) {
                    return _minute;
                }

                if (ValidatorDate.isMinute(minute)) {
                    _minute = minute;
                    return this;
                }

                throw new Error("Invalid argument: minute");
            };

            this.second = function (second) {
                if (ValidatorGeneral.isEmpty(second)) {
                    return _second;
                }

                if (ValidatorDate.isSecond(second)) {
                    _second = second;
                    return this;
                }

                throw new Error("Invalid argument: second");
            };

            this.millisecond = function (millisecond) {
                if (ValidatorGeneral.isEmpty(millisecond)) {
                    return _millisecond;
                }

                if (ValidatorDate.isMillisecond(millisecond)) {
                    _millisecond = millisecond;
                    return this;
                }

                throw new Error("Invalid argument: millisecond");
            };
        };

        Date.prototype.format = function format(format) {
            if (!ValidatorDate.isFormatString(format)) {
                throw new Error("Invalid argument: format.");
            }
            // TODO:
            return "1st July 2015";
        };

        Date.prototype.getTimestamp = function () {
            // TODO: 
        };

        Date.prototype.getDayOfWeek = function () {
            // TODO: 
        };

        Date.prototype.isLeapYear = function () {
            return ValidatorDate.isLeapYear(this.year());
        };

        Date.prototype.toString = function () {
            var toString = "year: " + this.year() + "\r\n month: " + this.month() + "\r\n day: " + this.day()
                    + "\r\n hour: " + this.hour() + "\r\n minute: " + this.minute()
                    + "\r\n second: " + this.second() + "\r\n millisecond: " + this.millisecond();
            return toString;
        };
        
        return Date;
    }());

    return {
        "Date": Date,
        "parseToDate": parseToDate,
        "getConst": Const.get,
        "isLeapYear": ValidatorDate.isLeapYear,
        "getDaysInYear": getDaysInYear
    };
}());