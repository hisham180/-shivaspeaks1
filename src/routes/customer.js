const Router = require("@koa/router");
const Controller = require("../controllers/index");

let r = new Router();

// [Internal Route] Handler to create customer data.
r.post("/internal/customer/create", async (ctx, next) => {
	let ctr = new Controller.Customer(ctx, next);
	await ctr.executeMethod("create");
});

// [Internal Route] Handler to update customer data.
r.patch("/internal/customer/update/:id", async (ctx, next) => {
	let ctr = new Controller.Customer(ctx, next);
	await ctr.executeMethod("update", ctx.params.id);
});

// [Internal Route] Handler to delete customer.
r.delete("/internal/customer/delete/:id", async (ctx, next) => {
	let ctr = new Controller.Customer(ctx, next);
	await ctr.executeMethod("delete", ctx.params.id);
});

// [Internal Route] Handler to get customer list.
r.get("/internal/customer/list", async (ctx, next) => {
	let ctr = new Controller.Customer(ctx, next);
	await ctr.executeMethod("customerList");
});

module.exports = r;