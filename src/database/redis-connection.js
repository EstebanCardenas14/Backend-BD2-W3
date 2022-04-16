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
                        message: 'Productos obtenidos con exito de la cache',
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
                    
                    let products=[];
                    for(let index in productos.rows){
                        const product = productos.rows[index];
                        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${productos.rows[index].marca_id}`);
                        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${productos.rows[index].proveedor_id}`);
                        //traer el usuario de proveedor
                        const usuario = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${proveedor.rows[0].usuario_id}`);
                       
                       

                        products.push({
                            producto_id: product.producto_id,
                            Image: product.imagen,
                            Titulo: product.titulo,
                            marca: marca.rows[0].nombre,
                            marca_imagen: marca.rows[0].imagen,
                            proveedor: proveedor.rows[0].proveedor_id,
                            proveedor_nombre: usuario.rows[0].nombres,
                            
                           

                        });
                    }
                    await set_async('productos', JSON.stringify(products), 'EX', ttl);
                    return res.status(200).json({
                        ok: true,
                        message: 'Productos obtenidos con exito de la base de datos',
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

