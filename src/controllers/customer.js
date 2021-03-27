const _ = require("lodash");
// Internal module, class imports
const Util = require("../misc/util");

const Validation = require("../validations");
const Auth = require("./auth");

class App extends Auth {
  constructor(ctx, _next) {
    super(ctx, _next);

    this._beforeMethods = {
      // "create": ["_secure"],
      // "customerList": ["_secure"],
      // "update": ["_secure"],
      // "delete": ["_secure"],
    };

    this.page = parseInt(this.ctx.query.page || 1);
    this.limit = parseInt(this.ctx.query.limit || 10);
    this.skip = (this.page - 1) * this.limit;
  }

  /**
   * [PUBLIC] This method create customer accordingly.
   * @endpoint /internal/customer/create
   * @author Aslam Desusa <aslam17@navgurukul.org>
   */
  async create() {
    let { error, value } = Validation.Customer.CreateSchema.validate(
      this.ctx.request.body
    );
    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
      this.throwError("201", errorMessage);
    }

    // Retrieving astologer from database.
    // let astrologer = await this.models.Astrologer.findOne({_id: value.aid});
    // if (!astrologer) {
    // 	this.throwError("404", "Invalid Astrologer ID provided.");
    // }

    let newCustomer = new this.models.Customer({
      _id: Util.generateMongoId(),
      aname: value.aname,
      name: value.name,
      email: value.email,
      phone: value.phone,
      paymentStatus: value.paymentStatus,
      bookingDateTime: value.bookingDateTime,
      payment: value.payment,
    });

    try {
      await newCustomer.save();
      this.ctx.body = {
        success: true,
        message: "New Customer Created Successfully",
      };
    } catch (error) {
      this.throwError("301");
    }
  }

  /**
   * [PUBLIC] This method will get customer list.
   * @endpoint /internal/customer/list
   * @author Aslam Desusa <aslam17@navgurukul.org>
   */
  async customerList() {
    let customerList = [],
      total = 0,
      count = 0;

    customerList = await this.models.Customer.find({})
      .skip(this.skip)
      .limit(this.limit)
      .maxTimeMS(10000);

    total = await this.models.Customer.countDocuments({}).maxTimeMS(10000);
    count = total;
    // Sending response to client.
    this.ctx.body = {
      success: true,
      data: {
        pagination: { page: this.page, limit: this.limit, total, count },
        customerList,
      },
    };
  }

  /**
   * [PUBLIC] This method will update customer data accordingly.
   * @endpoint /internal/customer/update
   * @author Aslam Desusa <aslam17@navgurukul.org>
   * @param {id}
   */
  async update(id) {
    let { error, value } = Validation.Customer.UpdateSchema.validate(
      this.ctx.request.body
    );
    if (error) {
      let errorMessage =
        _.size(error.details) > 0 ? error.details[0].message : null;
      this.throwError("201", errorMessage);
    }

    // Retrieving custom event from database.
    let customer = await this.models.Customer.findOne({ _id: id });
    if (!customer) {
      this.throwError("404", "Invalid Customer ID provided.");
    }

    // Retrieving custom event from database.
    let astrologer = await this.models.Astrologer.findOne({ _id: value.aid });
    if (!astrologer) {
      this.throwError("404", "Invalid Astrologer ID provided.");
    }

    try {
      (customer.aname = value.aname),
        (customer.name = value.name),
        (customer.email = value.email),
        (customer.phone = value.phone),
        (customer.paymentStatus = value.paymentStatus),
        (customer.bookingDateTime = value.bookingDateTime),
        (customer.payment = value.payment),
        await astrologer.save();
    } catch (error) {
      this.throwError("301", "Updating Customer failed, Please try again");
    }

    // Sending reponse to the client.
    this.ctx.body = {
      success: true,
      message: "Customer updated successfully",
      body: {
        customer: customer,
      },
    };
  }

  /**
   * [PUBLIC] This method will delete customer by id.
   * @endpoint /internal/customer/delete
   * @author Aslam Desusa <aslam17@navgurukul.org>
   * @param {id}
   */
  async delete(id) {
    // Retrieving custom event from database.
    let customer = await this.models.Customer.findOne({ _id: id });
    if (!customer) {
      this.throwError("404", "Invalid Customer ID provided.");
    }

    try {
      await this.models.Customer.findOneAndRemove({ _id: id });
    } catch (error) {
      this.throwError("301", "Deleting Customer failed, Please try again");
    }

    // Sending reponse to the client.
    this.ctx.body = {
      success: true,
      message: "Customer Deleted successfully",
      body: {
        customer: customer,
      },
    };
  }
}

module.exports = App;
