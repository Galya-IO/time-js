"use strict";

/**
 * Works for time in the range 4000 B.C. - 3000 A.C.
 * Timestamp is calculated from year Zero (0), 1st January.
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

        var LIMITS = {
            "MIN_TIMESTAMP": -128563200000000,
            "MAX_TIMESTAMP": 96422400000000,
            "MIN_YEAR": -4000,
            "MAX_YEAR": 3000
        };

        var MISC = {
            "LEAP_YEAR_DAYS": 366,
            "COMMON_YEAR_DAYS": 365
        };

        return {
            "getMinTimestamp": function () {
                return LIMITS.MIN_TIMESTAMP;
            },
            "getMaxTimestamp": function () {
                return LIMITS.MAX_TIMESTAMP;
            },
            "getMinYear": function () {
                return LIMITS.MIN_YEAR;
            },
            "getMaxYear": function () {
                return LIMITS.MAX_YEAR;
            },
            "getDaysLeapYear": function () {
                return MISC.LEAP_YEAR_DAYS;
            },
            "getDaysCommonYear": function () {
                return MISC.COMMON_YEAR_DAYS;
            }
        };
    }());

    var Validator = (function () {
        var isEmpty = function (value) {
            return value === undefined || value === null || value === "";
        };

        var isInteger = function (value) {
            return (typeof value === 'number') && value % 1 === 0;
        };

        var isTimestamp = function (value) {
            return isInteger(value) && value <= Const.getMaxTimestamp() && value >= Const.getMinTimestamp();
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

        return {
            "isTimestamp": isTimestamp,
            "isEmpty": isEmpty,
            "isLeapYear": isLeapYear
        };
    }());

    var parse = function (dateString, formatType) {
        if ((typeof dateString !== "string") || (typeof formatType !== "string")) {
            throw new Error("Date and date format should be string.");
        }
        return new Date();
    };
    
    var getDaysInYear = function(year) {
         return (Validator.isLeapYear(year)) ? Const.getDaysLeapYear() : Const.getDaysCommonYear();
    };

    var Date = (function () {
        // Constructor
        var Date = function (timestamp) {
            if (!(this instanceof Date)) {
                return new Date(current);
            }

            if (!Validator.isEmpty(timestamp)) {
                if (!Validator.isTimestamp(timestamp)) {
                    throw new Error("Invalid timestamp passed to the constructor of Time.Date().");
                }

                this._timestamp = timestamp;
            } else {
                // TODO: today
                this._timestamp = 0;
            }

//            this._year = 0;
//            this._month = 0;
//            this._day = 0;
//            this._hour = 0;
//            this._minute = 0;
//            this._second = 0;
//            this._millisecond = 0;
        };

        Date.prototype.format = function format(formatType) {
            if (typeof formatType !== "string") {
                throw new Error("Format is not a correct string.");
            }
            return "1st July 2015";
        };

        Date.prototype.getTimestamp = function () {
            return this._timestamp;
        };

        Date.prototype.isLeapYear = function () {
            // TODO: return Validator.isLeapYear(this._year);
        };
        
        Date.prototype.toString = function () {
            return "Date as timestamp " + this._timestamp;
        };

        return Date;
    }());

    return {
        "Date": Date,
        "parse": parse,
        "getMinTimestamp": Const.getMinTimestamp,
        "getMaxTimestamp": Const.getMaxTimestamp,
        "getMinYear": Const.getMinYear,
        "getMaxYear": Const.getMaxYear,
        "getDaysLeapYear": Const.getDaysLeapYear,
        "getDaysCommonYear": Const.getDaysCommonYear,
        "isLeapYear": Validator.isLeapYear,
        "getDaysInYear": getDaysInYear
    };
}());