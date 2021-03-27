const Router = require("@koa/router");
const Controller = require("../controllers/index");

let r = new Router();

// [External Route] Handler for retrieving application running status
r.get("/api/status", (ctx, next) => {
	ctx.body = {
		success: true,
		message: "Backend API is operating normally"
	};
});

// [Internal] Route Handler for advertiser registration
r.post("/internal/auth/register/admin", async (ctx, next) => {
	let ctr = new Controller.Auth(ctx, next);
	await ctr.executeMethod("createAdmin");
});

// [Internal] Route Handler for login token generation
r.post("/internal/auth/login", async (ctx, next) => {
	let ctr = new Controller.Auth(ctx, next);
	await ctr.executeMethod("login");
});

module.exports = r;