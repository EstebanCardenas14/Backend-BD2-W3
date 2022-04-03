const express = require('express');
const cors = require('cors');

const Redisconnection = require('./src/database/redis-connection');
const {mongoDB} = require('./src/database/mongose-connection');
//const {postgres} = require('./src/database/postgres-connection');

require('dotenv').config();
const app = express();

//Conection to Redis
const redis = new Redisconnection();
//Conection to MongoDB
mongoDB();
//Conection to Postgres
//postgres();  

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/doc', require('./src/routes/documents.routes'));
app.use('/rol', require('./src/routes/rol.routes'));


//Route default
app.use('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Exito'
    });
});
//Listen port
app.listen(process.env.PORT_APP, () => {
    console.log('Run back in:'.bold , `${process.env.PORT_APP}`.underline.yellow.bold);
});
