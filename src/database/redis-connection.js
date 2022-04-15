const redis = require("ioredis");
const colors = require("colors");
const { set } = require("mongoose");
const axios = require('axios');
const db = require('../database/postgres-connection');
const {promisify} = require('util');


const redisClient = new redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB
});

const get_async =promisify(redisClient.get).bind(redisClient);
const set_async =promisify(redisClient.set).bind(redisClient);

const redisConnection = async() => {
    try {
        await redisClient.connect();
        console.log('Data base redis: \x1b[32m%s\x1b[0m'.bold, 'online'.underline.yellow.bold);
        return redisClient;
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos'.underline.red.bold);
    }
}

    const getAll = async(req = request, res = response) => {

        try {
            //tiempo de expiracion de la cache de 10 minutos    
            const ttl = 600;

           const reply = await get_async('productos');
              if(reply){
                    return res.status(200).json({
                        ok: true,
                        message: 'Productos obtenidos con exito',
                        productos: JSON.parse(reply)
                    });

                }else{
                    const productos = await db.query(`SELECT * FROM producto`);
                    if (productos.rowCount === 0) {
                        return res.status(400).json({
                            ok: false,
                            message: 'No hay productos'
                        });
                    }
                   await set_async('productos', JSON.stringify(productos.rows), 'EX', ttl);
                    return res.status(200).json({
                        ok: true,
                        message: 'Productos obtenidos con exito',
                        productos: productos.rows
                    });
                }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                ok: false,
                message: 'Error en el servidor',
                error
            });
        }
         
    }

  

    module.exports = {
        redisConnection,
        getAll
    }

