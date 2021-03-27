const Promise = require('bluebird');

/**
 * Wrapper class to use redis client methods.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
class Redis {
	constructor(client, timeout = 1000) {
		this._client = client;
		this.timeout = timeout;
	}

	async set(key, value) {
		return new Promise((resolve, reject) => {
			this._client.set(key, value, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});
	}

	async get(key) {
		return new Promise((resolve, reject) => {
			this._client.get(key, (err, reply) => {
				if (err) reject(err);
				resolve(reply);
			});
		});
	}

	async hget(key, field) {
		return new Promise((resolve, reject) => {
			this._client.hget(key, field, (err, reply) => {
				if (err) reject(err);
				resolve(reply);
			});
		});
	}

	async hset(key, field, value) {
		return new Promise((resolve, reject) => {
			this._client.hset(key, field, value, (err) => {
				if (err) reject(err);
				resolve(true);
			});
		});
	}

	async hincrby(key, field, value, isFloat = false) {
		if (isFloat) {
			return this._execute('hincrbyfloat', key, field, value);
		} else {
			return this._execute('hincrby', key, field, value);
		}
	}

	async hgetall(key) {
		return this._execute("hgetall", key);
	}

	async _execute(...args) {
		let method = args[0];
		args.splice(0, 1);
		return new Promise((resolve, reject) => {
			this._client[method](...args, (err, reply) => {
				if (err) reject(err);
				resolve(reply);
			});
			setTimeout(() => reject(new Error(`Redis timed out after ${this.timeout}ms`)), this.timeout);
		});
	}

}

// module.exports = Redis;