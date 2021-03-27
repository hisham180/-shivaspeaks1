const _ = require('lodash');
const redis = require('redis');
/**
 * This class is used to create a new connection with the redis database.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
class RedisClient {
	constructor(config) {
		if (config.user && config.pass) {
			this._dbConnString = `redis://${config.user}:${config.pass}@${config.host}/${config.db}`;
		} else {
			this._dbConnString = `redis://${config.host}/${config.db}`;
		}
	}

	/**
	 * This method will create and return redis client connection. 
	 * @param {object} options - Database options to be passed to redis connection.
	 */
	createConnection(options = {}) {
		let connOptions = _.merge({
			retry_strategy: (opts) => {
				if (opts.error && opts.error.code === 'ECONNREFUSED') {
					return new Error('[REDIS] Connection refused by redis server');
				}
				if (opts.attempt > 5) {
					return undefined;
				}
				return Math.min(opts.attempt * 100, 3000);
			}
		}, options);
		let client = redis.createClient(this._dbConnString, connOptions);
		
		client.on('error', (error) => {
			console.error(`[REDIS] Error connecting to redis server: ${error}`);
		});

		client.on('connect', () => {
			console.log(`[REDIS] Connected to redis server`);
		});

		client.on('ready', () => {
			console.log('[REDIS] Ready to accept commands');
		});

		return client;
	}
}

module.exports = RedisClient;