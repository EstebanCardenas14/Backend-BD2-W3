const { request, response } = require('express');
const db = require('../database/postgres-connection');

const validateProduct = async (marca_id,proveedor_id,precio,caracteristicas,descripcion, req = request, res = response) => {

    try{

        return new Promise(async(resolve, reject) => {

        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${marca_id}`);
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${proveedor_id}`);
        const product = await db.query(`SELECT * FROM producto WHERE precio = ${precio}`);
        const product2 = await db.query(`SELECT * FROM producto WHERE caracteristicas = '${caracteristicas}'`);
        const product3 = await db.query(`SELECT * FROM producto WHERE descripcion = '${descripcion}'`);
        //validate the marca of the product
        if(marca.rowCount === 0){
            return reject('La marca no existe');
        }
        //validate the proveedor of the product
        if(proveedor.rowCount === 0){
            return reject('El proveedor no existe');
        }
        //validate the price of the product
        if(product.rowCount === 0 && product.rowCount < 0){
            return reject('El precio del producto no puede ser menor o igual a 0');
        }
        //validate the characteristics of the product
        if(product2.rowCount === null){
            return reject('La caracteristicas del producto no puede estar vacia');
        }
        //validate the description of the product
        if(product3.rowCount === null){
            return reject('La descripcion del producto no puede estar vacia');
        }
        return resolve(true);
    });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            ok: false,
            type: 'Error en el servidor'
        });
    }

};

module.exports = { validateProduct };