/**
 * User Model Schema - This model contains user related information like email, password, name, etc.
 * This model contains the information of the users added in the organization.
 * Note: Only one can be the admin in any organization, rest all will be team members.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */

// External Deps
const _ = require('lodash');
const { Schema } = require("mongoose");

const commonSchemaOpts = require('./common');
let schema = new Schema({
	_id: Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
		maxlength: 50,
		minlength: 3
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	},
	apiKey: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
}, _.extend({ collection: 'users' }, commonSchemaOpts));

// Applying mongoose bcrypt plugin
schema.plugin(require('mongoose-bcrypt'));

module.exports = schema;