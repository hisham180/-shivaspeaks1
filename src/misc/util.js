const _ = require("lodash");
const Promise = require('bluebird');
const mongoose = require("mongoose");
const Crypto = require("crypto");
const {v4: UUIDv4} = require("uuid");
const { nanoid } = require("nanoid");

class Util {
	constructor() {}
	
	/**
	 * [PUBLIC] This method return a unique id for mongodb document.
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static generateMongoId() {
		return mongoose.Types.ObjectId();
	}

	/**
	 * [PUBLIC] This function will return the IP of the incoming request.
	 * @param {KoaContext} ctx - Koa application context object
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getRequestIp(ctx) {
		let ip = null;
		if (ctx.request.headers["cf-connecting-ip"]) {
			ip = ctx.request.headers["cf-connecting-ip"];
		} else if (ctx.request.headers["x-forwarded-for"]) {
			let ipList = _.split(ctx.request.headers["x-forwarded-for"], ",");
			ip = _.trim(ipList[0]);
		} else {
			ip = ctx.request.ip || null
		}
		return ip;
	}

	/**
	 * [PUBLIC] This function will return the user agent of the user making request.
	 * @param {KoaContext} ctx - Koa application context object
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getUserAgent(ctx) {
		return ctx.request.headers["user-agent"] || null;
	}

	/**
	 * [PUBLIC] This function will resolve promise after a specified time in milliseconds. This 
	 * method is used to pause the execution for a specified amount of time in milliseconds.
	 * @param {integer} milliseconds - Time for which to sleep the current execution
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static async sleep(milliseconds) {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	}

	/**
	 * [PUBLIC] This function will return random token.
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static getRandomToken(size = 32) {
		return Crypto.randomBytes(size).toString('hex');
	}

	/**
	 * [PUBLIC] This function will return a random uuid.
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static generateApiKey() {
		return UUIDv4();
	}

	/**
	 * [PUBLIC] This function will generate a unique nano/short id for the specified length
	 * @param {integer} size - Number of character in the short/nano id
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	static generateNanoId(size = 10) {
		return nanoid(size);
	}

	/**
	 * [PUBLIC] This method will check domain existence.
	 * @param {string} dns - [Required] Any Domain will be accepted
	 * @author Aslam Desusa <aslam@trackier.com>
	 */
	static async dnsValidation(domain) {
		const lookupPromise = new Promise((resolve, reject) => {
			dns.lookup(domain, (err, address, family) => {
				if(err) reject(err);
				resolve(address);
			});
		});
		return lookupPromise
	}
}

module.exports = Util;