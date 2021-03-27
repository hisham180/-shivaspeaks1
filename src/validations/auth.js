// External Deps
const Joi = require("joi");

/**
 * This schema will be used to validate advertiser registration.
 * Used in controller/auth.js -> registerAdvertiser()
 * @author Aslam Desusa <aslam17@navgurukul.org>
 * 
 * TODO: Add regex in companyName, userName, password, country, phoneNumber field.
 */
const CreateSchema = Joi.object({
	name: Joi.string().trim().min(3).max(50).label("User Name").required(),
	email: Joi.string().trim().email().label("Email").required(),
	password: Joi.string().trim().min(8).max(32).label("Password").required()
});

/**
 * This schema will be used in forget password.
 * Used in controller/auth.js -> requestResetPassword()
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
const RequestPasswordResetSchema = Joi.object({
	email: Joi.string().email().label("Email").required()
});

/**
 * This schema will be used to reset password.
 * Used in controller/auth.js -> resetPassword()
 * 
 * // TODO: Update schema to check both password should match.
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
const PasswordResetSchema = Joi.object({
	password: Joi.string().min(8).max(32).label("Password").required(),
	confirmPassword: Joi.string().min(8).max(32).label("Confirm Password").required()
});

/**
 * This schema will be used in login.
 * Used in controller/auth.js -> login()
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
const LoginSchema = Joi.object({
	email: Joi.string().email().label("Email").required(),
	password: Joi.string().label("Password").required(),
	rememberMe: Joi.boolean().default(false)
});

module.exports = {
	CreateSchema,
	RequestPasswordResetSchema,
	PasswordResetSchema,
	LoginSchema,
	EmailExistSchema: RequestPasswordResetSchema
};