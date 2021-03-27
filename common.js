const _ = require("lodash");
const Registry = require("./src/misc/registry");

// Requiring databases client and their wrappers
const MemcacheClient = require("./src/misc/db/client/memcache");
const MemcacheWrapper = require("./src/misc/db/client/memcache");
const RedisClient = require("./src/misc/db/client/redis");
// const RedisWrapper = require("./src/misc/db/redis"); //TODO
const MongoDbClient = require("./src/misc/db/client/mongodb");

// Application environment and configuration
const ENV = process.env.NODE_ENV || "development";
Registry.set("env", ENV);
const config = require(`./${ENV}.config.json`);
Registry.set("config", config);

// Initializing pino logger and setting it to registry
const pino = require("pino");
const logger = pino({
  prettyPrint: ENV != "production" ? true : false,
});
Registry.set("logger", logger);

// Initializing default (Primary) memcache and setting to registry
// const defaultMemcacheClient = (new MemcacheClient(config.cacheDatabases.memcachePrimary));
// const defaultMemcacheWrapper = new MemcacheWrapper(defaultMemcacheClient, config.cacheDatabases.keyPrefix, config.cacheDatabases.memcachePrimary.timeout);
// Registry.set("memcache", defaultMemcacheWrapper);

// Initializing default (Primary) redis
// const defaultRedisClient = (new RedisClient(config.redisDatabases.redisPrimary)).createConnection();
// const defaultRedisWrapper = new RedisWrapper(defaultRedisClient, config.redisDatabases.redisPrimary.timeout);
// Registry.set("redis", defaultRedisWrapper);

// Initializing default (Primary) mongodb and initializing models
const defaultMongodbClient = new MongoDbClient(
  config.storageDatabases.mongodbPrimaryRpl0
).createConnection({
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const schemaList = require("./src/models");
let models = {};
_.each(schemaList, (value, key) => {
  models[key] = defaultMongodbClient.model(key, value);
});
Registry.set("models", models);
