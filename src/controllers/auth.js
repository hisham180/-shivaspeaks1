// External and built-in module import
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// Internal module, files and class import
let Base = require("./base");
let Util = require("../misc/util");
let Validation = require("../validations");

const AUTH_COOKIE_NAME = "_token";

/**
 * Auth Class will contains all the methods related to authentication of the 
 * required operation.
 * 
 * @note All other controllers will extend Auth controller class, Base controller 
 * class is only extendable by Auth
 * 
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
class Auth extends Base {
	constructor(ctx, _next) {
		super(ctx, _next);
		this.user = null;
		this.org = null;

		this._beforeMethods = {
			"resetToken": ["_secure"],
		};
	}

	_getPayload() {
		let token = this.ctx.query.token || this.ctx.headers["x-api-key"];
		if (!token) {
			token = this.ctx.cookies.get(AUTH_COOKIE_NAME);
		}
		if (!token) {
			this.throwError("102", "Please login to continue using the dashboard");
		}
		let payload = null;
		try {
			payload = jwt.verify(token, this.config.application.secret);
		} catch (error) {
			this.throwError("102", "Authentication token expired, Please re-login to continue using the dashboard");
		}
		return payload;
	}

	/**
	 * [PROTECTED] This method will check if any authentication cookie is set. If not then throw error 
	 * to the user in response, else set user and org from the cookie.
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async _secure() {
		let payload = this._getPayload();
		// TODO: Use caching and set the user, org from cached data to mongoose model object.
		let user = await this.models.User.findOne({ _id: payload.uid });
		if (!user) {
			this.throwError("102", "Authentication failed, Please re-login to continue using the dashboard");
		}
		this.user = user;
	}

	/**
	 * [PUBLIC] This function will check if the email user is trying to register is already exist or not.
	 * @endpoint /internal/account/check
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async checkEmailExist(emailParams) {
		let email = emailParams || this.ctx.query.email
		let { error, value } = Validation.Auth.EmailExistSchema.validate({ email:  email});
		if (error) {
			let errorMessage = _.size(error.details) > 0 ? error.details[0].message : null;
			this.throwError("201", errorMessage);
		}

		// Searching if user exist with the provided email
		// TODO: Implement Cache
		let user = await this.models.User.findOne({ email: value.email });
		this.ctx.body = {
			success: true,
			message: null,
			data: {
				exist: user ? true : false
			}
		}
	}

	/**
	 * [PROTECTED] This method will generate jwt token for user authentication.
	 * @param {object} org 
	 * @param {object} user 
	 * @param {integer} seconds
	 */
	_generateToken(user, seconds = 60 * 60 * 24) {
		let payload = {
			uid: `${user._id}`
		};
		let options = {
			expiresIn: seconds
		}
		return jwt.sign(payload, this.config.application.secret, options);
	}


	_setLoginCookie(name, value, seconds) {
		this.ctx.cookies.set(name, value, {
			maxAge: seconds * 1000,
			secure: false, // TODO: Fix this error when we are setting secure to true "Process.Error Error: Cannot send secure cookie over unencrypted connection"
			httpOnly: true,
			overwrite: true,
			sameSite: "strict"
		});
	}

	/**
	 * [PUBLIC] This method will a generate that will be used to authenticate future request.
	 * @endpoint /internal/account/login
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async login() {
		let { error, value } = Validation.Auth.LoginSchema.validate(this.ctx.request.body);
		if (error) {
			let errorMessage = _.size(error.details) > 0 ? error.details[0].message : null;
			this.throwError("201", errorMessage);
		}
		let user = await this.models.User.findOne({ email: value.email });
		if (!user) {
			this.throwError("404", "Incorrect email/password.");
		}
		if (!await user.verifyPassword(value.password)) {
			this.throwError("404", "Incorrent email/password");
		}

		// If user select remember me option then we will create token for 30 days, else for 24 hours only.
		let seconds = value.rememberMe ? 86400 * 30 : 86400;
		let token = this._generateToken(user, seconds);
		this._setLoginCookie(AUTH_COOKIE_NAME, token, seconds)
		this.ctx.body = {
			success: true,
			message: "Login successful",
			data: { token: token, user: user }
		}
	}

	/**
	 * [PUBLIC] This method will crate admin for Deshboard only.
	 * @endpoint /internal/account/create
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async createAdmin(){
		let { error, value } = Validation.Auth.CreateSchema.validate(this.ctx.request.body);
		if (error) {
			let errorMessage = _.size(error.details) > 0 ? error.details[0].message : null;
			this.throwError("201", errorMessage);
		}

		// Checking if the user already exist with the provided email address.
		let userExist = await this.models.User.findOne({ email: value.email });
		if (userExist) this.throwError("201", "User with email already exist.");

		let user = new this.models.User({
			_id: Util.generateMongoId(),
			name: value.name,
			email: value.email,
			password: value.password,
			apiKey: Util.generateApiKey(),
		});

		try {
			await user.save();
			this.ctx.body = {
				success: true,
				message: "Admin Created Successfully",
			}
		} catch (error) {
			this.throwError("301");
		}
	}

	/**
	 * [PUBLIC] This method will reset user API Key/Token.
	 * @endpoint /internal/account/reset-token
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async resetToken() {
		let user = await this.models.User.findOne({_id: this.user._id, oid: this.org._id});
		try {
			user.apiKey = Util.generateApiKey();
			user.save();
		} catch (error) {
			Util.logError(error);
			this.throwError("301", "Token reset failed.")
		}
		
		// Sending response back to client
		this.ctx.body = {
			success: true,
			message: "Token Generated Successfully",
			data: {
				user,
				token: user.apiKey
			}
		}
	}
}

module.exports = Auth;