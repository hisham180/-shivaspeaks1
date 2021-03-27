// External Deps
const Joi = require("joi");

/**
 * This schema will be used to validate advertiser registration.
 * Used in controller/astrologer.js -> registerAdvertiser()
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
const CreateSchema = Joi.object({
	name: Joi.string().trim().min(3).max(50).label("Astrologer name").required(),
	lang: Joi.string().trim().label("Language").required(),
	expr: Joi.string().trim().label("Experience").required(),
	cat: Joi.string().trim().label("Category").required(),
	imgPath: [Joi.string().label("Image"), Joi.optional(), Joi.allow(null)],
	price: Joi.string().trim().min(2).max(5).label("Price").required()
});

module.exports = {
	CreateSchema,
	UpdateSchema: CreateSchema
};