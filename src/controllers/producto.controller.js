const { request, response } = require('express');
const db = require('../database/postgres-connection');
const { validateProduct} = require('../helpers/index');

const create = async ( req = request, res = response) => {
    const { marca_id,proveedor_id,titulo,precio,caracteristicas,descripcion } = req.body;
    try{
      //verify the existence of the product
      await validateProduct(marca_id,proveedor_id,precio,caracteristicas,descripcion);
        //create product
      await db.query(`INSERT INTO producto (marca_id,proveedor_id,titulo,precio,caracteristicas,descripcion,estado) VALUES ('${marca_id}','${proveedor_id}','${titulo}','${precio}','${caracteristicas}','${descripcion}',${true});`);

        return res.status(200).json({
            ok: true,
            message: 'Producto creado'
        });
    }catch(error){
       console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
      
     }

}

const getProductById = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const product = await db.query(`SELECT * FROM producto WHERE producto_id = ${id}`);
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${product.rows[0].proveedor_id}`);

        if (product.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        if (proveedor.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }


        return res.status(200).json({
            ok: true,
            message: 'Producto encontrado',
            producto: product.rows[0],
            proveedor: proveedor.rows[0]
        });
    }catch(error){

        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }
}

const getAll = async (req = request, res = response) => {
    try{
        const productos = [];
        const data = await db.query(`SELECT * FROM producto`);

        for(let products in data.rows){
            const producto = await db.query(`SELECT * FROM producto WHERE producto_id = ${data.rows[products].proveedor_id}`);
            productos.push(producto.rows[0]);
        }

        return res.status(200).json({
            ok: true,
            message: 'Productos encontrados',
            productos
        });
    }catch(error){
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }

 }

 const updateById = async (req = request, res = response) => {
    const { id } = req.params;
    const { marca_id,proveedor_id,titulo,precio,caracteristicas,descripcion } = req.body;
    try{
      
        //verify the existence of the product
        const product = await db.query(`SELECT * FROM producto WHERE producto_id = ${id}`);
        if (product.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        //validate the brand of marca
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${marca_id}`);
        if (marca.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La marca no existe'
            });
        }

       //verify the title of the product
       const title = await db.query(`SELECT * FROM producto WHERE titulo = '${titulo}'`);
         if (title.rowCount !== 0) {
            return res.status(400).json({
                ok: false,
                message: 'El titulo ya existe'
            });
        }

        //update the product
        const update = await db.query(`UPDATE producto SET marca_id = '${marca_id}', proveedor_id = '${proveedor_id}', titulo = '${titulo}', precio = '${precio}', caracteristicas = '${caracteristicas}', descripcion = '${descripcion}' WHERE producto_id = ${id}`);

        return res.status(200).json({
            ok: true,
            message: 'Producto actualizado'
        });
    }catch(error){
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }

 }

const deleteById = async (req = request, res = response) => {
    const { id } = req.params;
    try{
        //verify the existence of the product
        const product = await db.query(`SELECT * FROM producto WHERE producto_id = ${id}`);
        if (product.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        //delete the product
        const deleteProduct = await db.query(`DELETE FROM producto WHERE producto_id = ${id}`);

        return res.status(200).json({
            ok: true,
            message: 'Producto eliminado'
        });
    }catch(error){
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }
}

module.exports = {
    create,
    getProductById,
    getAll,
    updateById,
    deleteById
}