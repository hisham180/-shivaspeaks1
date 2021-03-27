/**
 * Customer Model Schema
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */

// External Deps
const _ = require("lodash");
const { Schema } = require("mongoose");

const commonSchemaOpts = require("./common");
let schema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true,
		alias: "astrologerName"
	},
	lang: {
		type: String,
		required: true,
		alias: "language"
	},
	expr: {
		type: String,
		required: true,
        alias: "experience"
	},
    cat: {
		type: String,
		required: true,
        alias: "categories"
	},
    imgPath: {
		type: String,
		required: true,
        alias: "imagePath"
	},
	price: {
		type: String,
		required: true,
        alias: "Price"
	}

}, _.merge({ collection: "astrologers" }, commonSchemaOpts));

module.exports = schema;