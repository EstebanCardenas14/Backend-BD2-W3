const {Router} = require('express');
const router = Router();

const {redisConnection,getAll} = require('../database/redis-connection');

router.get('/getAll', getAll);


module.exports = router;