// const Promise = require('bluebird')
const _ = require("lodash");
// Internal module, class imports
const Util = require("../misc/util");

const Validation = require("../validations");
const Auth = require('./auth');

class App extends Auth {
	constructor(ctx, _next) {
		super(ctx, _next);

		// this._beforeMethods = {
		// 	"create": ["_secure"],
		// 	"astrologerList": ["_secure"],
		// 	"update": ["_secure"],
		// 	"delete": ["_secure"]
		// };

		this.page = parseInt(this.ctx.query.page || 1);
		this.limit = parseInt(this.ctx.query.limit || 10);
		this.skip = (this.page - 1) * this.limit;
	}

	/**
	 * [PUBLIC] This method will crate astrologer accordingly.
	 * @endpoint /internal/astrologer/create
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
    async create() {
		let { error, value } = Validation.Astrologer.CreateSchema.validate(this.ctx.request.body);
		if (error) {
			let errorMessage = _.size(error.details) > 0 ? error.details[0].message : null;
			this.throwError("201", errorMessage);
		}

		let newAstrologer = new this.models.Astrologer({
			_id: Util.generateMongoId(),
			name: value.name,
			lang: value.lang,
			expr: value.expr,
			cat: value.cat,
			imgPath: value.imgPath,
			price: value.price
		})

		try {
			await newAstrologer.save()
			this.ctx.body = {
				success: true,
				message: "New Astrologer Created Successfully"
			};
			// my_changes
			// res.redirect("/dashboard/internal/astrologer/create")
		} catch (error) {
			this.throwError("301");
		}
    }

	/**
	 * [PUBLIC] This method will get astrologer list.
	 * @endpoint /internal/astrologer/list
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async astrologerList() {
		let astrologerList = [], total = 0, count = 0;
		astrologerList = await this.models.Astrologer.find({}).skip(this.skip).maxTimeMS(10000);
		// astrologerList = await this.models.Astrologer.find({}).skip(this.skip).limit(this.limit).maxTimeMS(10000);
		

		total = await this.models.Astrologer.countDocuments({}).maxTimeMS(10000);	
		count = total;
		// Sending response to client.
		this.ctx.body = {
			success: true,
			data: {
				pagination: { page: this.page, total, count },
				astrologerList
			}
		}
	}

	/**
	 * [PUBLIC] This method will get astrologer list.
	 * @endpoint /internal/astrologer/list
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 */
	async astrologerListUnsecure() {
		await this.astrologerList()
	}

	/**
	 * [PUBLIC] This method will update astrologer data by id.
	 * @endpoint /internal/astrologer/update
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 * @param {id}
	 */
	async update(id) {
		let { error, value } = Validation.Astrologer.UpdateSchema.validate(this.ctx.request.body);
		if (error) {
			let errorMessage = _.size(error.details) > 0 ? error.details[0].message : null;
			this.throwError("201", errorMessage);
		}

		// Retrieving custom event from database.
		let astrologer = await this.models.Astrologer.findOne({_id: id});
		if (!astrologer) {
			this.throwError("404", "Invalid Astrologer ID provided.");
		}

		try {
			astrologer.name = value.name
			astrologer.lang = value.lang,
			astrologer.expr = value.expr,
			astrologer.cat = value.cat,
			astrologer.imgPath = value.imgPath,
			astrologer.price = value.price
			await astrologer.save();
		} catch (error) {
			this.throwError("301", "Updating Astrologer failed, Please try again");
		}

		// Sending reponse to the client.
		this.ctx.body = {
			success: true,
			message: "Astrologer updated successfully",
			body: {
				astrologer: astrologer
			}
		}
	}

	/**
	 * [PUBLIC] This method will delete astrologer from database.
	 * @endpoint /internal/astrologer/delete
	 * @author Aslam Desusa <aslam17@navgurukul.org>
	 * @param {id}
	 */
	 async delete(id){
		 // Retrieving custom event from database.
		let astrologer = await this.models.Astrologer.findOne({_id: id});
		if (!astrologer) {
			this.throwError("404", "Invalid Astrologer ID provided.");
		}
		
		try {
			await this.models.Astrologer.findOneAndRemove({_id: id});
		} catch (error) {
			this.throwError("301", "Deleting Astrologer failed, Please try again");
		}

		// Sending reponse to the client.
		this.ctx.body = {
			success: true,
			message: "Astrologer Deleted successfully",
			body: {
				astrologer: astrologer
			}
		}
	 }

}

module.exports = App;