const Redisconnection = require('./models/redis-connection');


const redis = new Redisconnection();

redis.listen();
