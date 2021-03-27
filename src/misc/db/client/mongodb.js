const _ = require('lodash');
const mongoose = require('mongoose');

// PORT=3000
// MONGO_URI=mongodb+srv://admin:8447383454@mongoDb@cluster0.senwn.mongodb.net/users?retryWrites=true&w=majority

/**
 * This class is used to create a new connection with mongodb database.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
class MongodbClient {
	constructor(config) {
		if (_.size(config.user) && _.size(config.pass)) {               //pass }$ @
			this._dbConnString = `mongodb+srv://${config.user}:${config.pass}@${config.host}/${config.db}?${config.options}`;
		} else {
			this._dbConnString = `mongodb+srv://${config.host}/${config.db}?${config.options}`;
		}
	}
	// mongodb+srv://<username>:<password>@cluster0.hzgdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
	/**
	 * This method will create and return mongodb client connection.
	 *  - Database options to be passed to mongodb connection
	 */


	createConnection(options = {}) {
		let connOptions = _.merge({ useNewUrlParser: true,useUnifiedTopology: true }, options);
		return mongoose.createConnection(this._dbConnString, connOptions);
	};	
}

module.exports = MongodbClient;