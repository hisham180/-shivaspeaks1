// External Deps
const Joi = require("joi");

/**
 * This schema will be used to validate advertiser registration.
 * Used in controller/astrologer.js -> registerAdvertiser()
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */
const CreateSchema = Joi.object({
  aname: Joi.string().required(),
  name: Joi.string().trim().min(3).max(50).label("Customer name").required(),
  email: Joi.string().trim().email().label("Email").required(),
  phone: Joi.string().trim().label("Phone").required(),
  paymentStatus: Joi.string().trim().label("Payment Status").required(),
  bookingDateTime: Joi.string().trim().label("Booking Time Slot").required(),
  payment: Joi.string().trim().label("Payment").required(),
});

module.exports = {
  CreateSchema,
  UpdateSchema: CreateSchema,
};
