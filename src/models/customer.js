/**
 * Customer Model Schema
 * @author Aslam Desusa <aslam17@navgurukul.org>
 */

// External Deps
const _ = require("lodash");
const { Schema } = require("mongoose");

const commonSchemaOpts = require("./common");
let schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    aname: {
      type: String,
      required: true,
      alias: "astrologerName",
    },
    name: {
      type: String,
      required: true,
      alias: "customerName",
    },
    email: {
      type: String,
      required: true,
      alias: "customerEmail",
    },
    phone: {
      type: String,
      required: true,
      alias: "phoneNumber",
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    bookingDateTime: {
      type: String,
      required: true,
    },
  },
  _.merge({ collection: "customers" }, commonSchemaOpts)
);

module.exports = schema;
