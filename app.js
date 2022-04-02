const Redisconnection = require('./src/database/redis-connection');
const {mongoDB} = require('./src/database/mongose-connection');

require('dotenv').config();
const redis = new Redisconnection();
mongoDB();

