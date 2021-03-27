const Router = require("@koa/router");
const Controller = require("../controllers/index");

let r = new Router();

// [Internal Route] Handler to create astrologer data.

r.post("/internal/astrologer/create", async (ctx, next) => {
	let ctr = new Controller.Astro(ctx, next);
	await ctr.executeMethod("create");
});

// [Internal Route] Handler to list all applications advertiser wise.
r.patch("/internal/astrologer/update/:id", async (ctx, next) => {
	let ctr = new Controller.Astro(ctx, next);
	await ctr.executeMethod("update", ctx.params.id);
});

// [Internal Route] Handler to list all applications advertiser wise.
r.delete("/internal/astrologer/delete/:id", async (ctx, next) => {
	let ctr = new Controller.Astro(ctx, next);
	await ctr.executeMethod("delete", ctx.params.id);
});

// [Internal Route] Handler to list all astrologer with pagination.
r.get("/internal/astrologer/list", async (ctx, next) => {
	let ctr = new Controller.Astro(ctx, next);
	await ctr.executeMethod("astrologerList");
});

// Unsecure function
// [Internal Route] Handler to list all astrologer with pagination.
r.get("/extrnal/astrologer/list", async (ctx, next) => {
	let ctr = new Controller.Astro(ctx, next);
	await ctr.executeMethod("astrologerListUnsecure");
});
module.exports = r;