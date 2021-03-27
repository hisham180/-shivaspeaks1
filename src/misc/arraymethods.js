/**
 * This class will contains static utility methods that will operate over array or objects.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */

// External Deps
const _ = require("lodash");

class ArrayMethods {
	constructor(){}

	/**
	 * [PUBLIC] This method will iterate over an array of object and return an array of field value
	 * required.
	 * @param {array of objects} data 
	 * @param {string} field - object field to be retrieved
	 * 
	 * @author Aslam Desusa <aslam@trackier.com>
	 */
	static objectKeys(data, field) {
		let result = [];
		_.each(data, (d) => {
			result.push(d[field]);
		});
		return _.uniq(result);
	}

	/**
	 * [PUBLIC] This method will iterate over an array of object and return a map(Key => Value) object.
	 * With field being the key and object in item array being the value.
	 * @param 
	 * 
	 * @author Aslam Desusa <aslam@trackier.com>
	 */
	static generateMapObject(data, field) {
		let result = {};
		_.each(data, (d) => {
			result[d[field]] = d;
		});
		return result;
	}

	static addObject(from, to) {
		_.each(from, (value, key) => {
			if (to[key]) {
				to[key] += parseFloat(value);
			} else {
				to[key] = parseFloat(value);
			}
		});
		return to;
	}
}

module.exports = ArrayMethods;