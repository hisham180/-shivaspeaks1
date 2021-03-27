// External Deps
const _ = require("lodash");
const moment = require("moment-timezone");
class DateTime {
	constructor() {}

	static validDurationForUnit(duration = 0, unit = "lifetime") {
		switch(unit) {
			case "hour":
				if (duration > 24) duration = 24;
				else if (duration <= 0) duration = 1;
				break;
			case "day":
				if (duration > 30) duration = 30;
				else if (duration <= 0) duration = 1;
				break;
			case "month":
				if (duration > 12) duration = 12;
				else if (duration <= 0) duration = 1;
				break;
			case "lifetime":
			default:
				duration = -1;
		}
		return duration;
	}

	/**
	 * [PUBLIC] This function will convert duration and duration unit to seconds.
	 * @param {integer} duration - 1 to 30 for days, 1 to 24 for Hour, 1 to 12 for month
	 * @param {string} unit - e.g. hour, day, month, lifetime
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getSecondForDuration(duration = 0, unit = "lifetime") {
		let seconds = -1;
		if (duration <= 0) return seconds;
		switch (unit) {
			case "hour":
				if (duration > 24) duration = 24;
				seconds = 60 * 60 * duration;
				break;
			case "day":
				if (duration > 30) duration = 30;
				seconds = 60 * 60 * 24 * duration;
				break;
			case "month":
				if (duration > 12) duration = 12;
				seconds = 60 * 60 * 24 * 30 * duration;
				break;
			case "lifetime":
			default: 
				seconds = -1;
				break;
		}
		return seconds;
	}

	/**
	 * [PUBLIC] This function will convert duration and duration unit to milliseconds.
	 * @param {integer} duration - 1 to 30 for days, 1 to 24 for Hour, 1 to 12 for month
	 * @param {string} unit - e.g. hour, day, month, lifetime
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getMilliSecondForDuration(duration = 0, unit = "lifetime") {
		let milliseconds = -1;
		if (duration <= 0 || unit == "lifetime") return milliseconds;
		milliseconds = this.getSecondForDuration(duration, unit) * 1000;
		return milliseconds;
	}

	/**
	 * [PUBLIC] This function will check if the provided {date} is in provided {format} or not.
	 * @param {string} date
	 * @param {string} format 
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static validateDateFormat(date, format = "YYYY-MM-DD") {
		let momentDate = moment(date, format, true);
		return momentDate.isValid();
	}

	/**
	 * [PUBLIC] This function will return today moment date in the provided timezone.
	 * @param {string} timezone 
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getToday(timezone = "UTC") {
		return moment().tz(timezone).format();
	}

	/**
	 * [PUBLIC] This function will return yesterday moment date in the provided timezone.
	 * @param {string} timezone 
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getYesterday(timezone = "UTC") {
		return moment().tz(timezone).subtract(1, "days").format();
	}

	/**
	 * [PUBLIC] This function will return utc offset from the date passed.
	 * @param {string} date 
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getUTCOffset(date) {
		return moment(date).utcOffset();
	}

	/**
	 * [PUBLIC] This function will return unix of the provided time.
	 * @param {string} date 
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getUnix(date) {
		return moment(date).unix();
	}

	/**
	 * [PUBLIC] This function will return date from seconds since 1970.
	 * @param {integer} seconds
	 * @param {boolean} toUTC
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getDateFromSecond(seconds, toUTC = false) {
		return toUTC ? moment.unix(seconds).utc().format() : moment.unix(seconds).format()
	}

	static getDateFromTime(hour = 0, minute = 0, second = 0, toUTC = false) {
		return toUTC ? moment().utc().hour(hour).minute(minute).second(second).format() : moment().hour(hour).minute(minute).second(second).format();
	}

	/**
	 * [PUBLIC] This function will return date in the provided format.
	 * @param {string} date
	 * @param {string} format
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static format(date, format = "YYYY-MM-DD") {
		return moment(date).format(format);
	}

	/**
	 * [PUBLIC] This function will parse date in provided timezone.
	 * @param {string} date 
	 * @param {string} timezone 
	 */
	static parse(date, timezone = "UTC") {
		return moment.tz(date, timezone).format();
	}

	/**
	 * [PUBLIC] This function will parse
	 * @param {string} date 
	 * @param {string} timezone 
	 */
	static toUTC(date, timezone = "UTC") {
		return moment.tz(date, timezone).utc().format();
	}

	/**
	 * [PUBLIC] This function will parse time to the intented timezone.
	 * @param {string} date 
	 * @param {string} timezone 
	 */
	static toTimezone(date, timezone = "UTC") {
		return moment(date).tz(timezone).format();
	}

	/**
	 * [PUBLIC] This function will return date range query.
	 * @param {string} start 
	 * @param {string} end 
	 */
	static dateRange(start, end) {
		return {
			start: moment(start).minute(0).seconds(0).milliseconds(0).toDate(),
			end: moment(end).hour(23).minute(59).seconds(59).milliseconds(999).toDate()
		}
	}

	/**
	 * [PUBLIC] This function will return seconds from unix epoch time.
	 * @param {string} start 
	 * @param {string} end 
	 */
	static seconds(date, timezone = "UTC") {
		return moment.tz(date, timezone).unix();
	}

	/**
	 * [PUBLIC] This function will return all date ranges list between start and end date.
	 * @param {string} start - Start Date 
	 * @param {string} end - End Date
	 * @param {string} format
	 */
	static getDateRanges(start, end, format = "YYYY-MM-DD", timezone = "UTC") {
		let dateArray = [];
		let currentDate = moment.tz(start, timezone);
		let endDate = moment.tz(end, timezone);
		while (currentDate <= endDate) {
			dateArray.push(moment(currentDate).tz(timezone).format(format));
			currentDate = moment.tz(currentDate, timezone).add(1, "days");
		}
		return dateArray;
	}
}

module.exports = DateTime;