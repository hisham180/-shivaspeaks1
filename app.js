require("./common.js");
const _ = require("lodash");
const path = require("path");

const Registry = require("./src/misc/registry");
const config = Registry.get("config");
const logger = Registry.get("logger");

const http = require("http");
http.Agent.defaultMaxSockets = Infinity; // Setting infinity sockets

// Import Koa framework and related dependent modules
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
var serve = require("koa-static");

const app = new Koa();
require("koa-qs")(app, "extended");
// Request body parser middleware
app.use(bodyParser());

// Request Middleware Handling
app.use(async (ctx, next) => {
  try {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "*");
    ctx.set("Access-Control-Allow-Headers", "*");
    await next();
  } catch (error) {
    console.log("Process.Error", error);
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message:
        "Internal Server error, dev team has been notified. Please try again after sometime!!",
    };
    ctx.app.emit("error", error);
  }
});

app.use(async (ctx, next) => {
  let start = new Date();
  await next();
  const responseTimeInMS = new Date() - start;
  ctx.set("x-response-time", `${responseTimeInMS}ms`);
  logger.info(
    `[${ctx.method}] ${ctx.status} ${ctx.url} - ${responseTimeInMS}ms`
  );
});

app.on("error", (error) => {
  console.log(error);
});

// Initializing application routes
const routesList = require("./src/routes");
_.each(routesList, (router, key) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

let server = app.listen($PORT, () => {
  logger.info(
    `[Started] Application started listening on port config.application.port ${$PORT}`
  );
});
// TODO: Timeout configuration

process.on("SIGINT", () => {
  logger.warn(`[Stopped] Application stopped`);
  // TODO: Fire events to all the buffers to store the data in db
  process.exit(0);
});

// loading assets || Front end

app.use(serve(path.resolve(__dirname, "../astrologer-frontend/")));
