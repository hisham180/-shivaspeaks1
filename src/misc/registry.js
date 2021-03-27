/**
 * Singleton registry class used to hold application related stuff till the entire lifetime of the application.
 * @author Aslam Desusa <aslam17@navgurukul.com>
 */
class Registry {
	constructor() {
		this._data = {};
	}

	set(key, value = null) {
		this._data[key] = value;
	}

	get(key, defValue = null) {
		return this._data[key] || defValue;
	}

	delete(key) {
		delete this._data[key];
	}
}

module.exports = new Registry();