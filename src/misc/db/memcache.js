const Promise = require('bluebird');

/**
 * Wrapper class to use memcache client methods.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
class Memcache {
	constructor(client, prefix = 'cache:js', timeout = 600) {
		this._client = client;
		this._prefix = prefix;
		this._timeout = timeout;
	}

	_getPrefixedKeyName(name) {
		return `${this._prefix}:${name}`;
	}

	async get(key, defValue = null) {
		return new Promise((resolve, reject) => {
			this._client.get(this._getPrefixedKeyName(key), (err, data) => {
				if (err) {
					resolve(defValue);
				}
				resolve(data);
			});
		});
	}

	async set(key, value, timeout) {
		return new Promise((resolve, reject) => {
			this._client.set(this._getPrefixedKeyName(key), value, timeout || this._timeout, (err) => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}

	async increment(key, amount) {
		return new Promise((resolve, reject) => {
			this._client.incr(this._getPrefixedKeyName(key), amount, (err) => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}

	async decrement(key, amount) {
		return new Promise((resolve, reject) => {
			this._client.decr(this._getPrefixedKeyName(key), amount, (err) => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}

	async delete(key) {
		return new Promise((resolve, reject) => {
			this._client.del(this._getPrefixedKeyName(key), (err) => {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}
}

module.exports = Memcache;