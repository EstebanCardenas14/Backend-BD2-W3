const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    const { producto_id,marca_id,proveedor_id,categoria_id,titulo,precio,caracteristicas,descripcion,stock} = req.body;

    try{
        //verify that there is no producto with producto_id
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = '${producto_id}'`);
        if (producto.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto ya existe'
            });
        }
        //verify the existence of the marca in the database
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = '${marca_id}'`);
        if (marca.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La marca no existe'
            });
        }
        //verify the existence of the proveedor in the database
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = '${proveedor_id}'`);
        if (proveedor.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }

         //verify the existence of the categoria in the database
            const categoria = await db.query(`SELECT * FROM categoria WHERE categoria_id = '${categoria_id}'`);
            if (categoria.rows.length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'La categoria no existe'
                });
            }

        //insert producto
        await db.query(`INSERT INTO producto (producto_id, marca_id, proveedor_id, titulo, precio, caracteristicas, descripcion, estado,stock) VALUES (${producto_id}, ${marca_id}, ${proveedor_id}, '${titulo}', ${precio}, '${caracteristicas}', '${descripcion}', true, ${stock})`);
        

        //bring the new producto
        const newProducto = await db.query(`SELECT * FROM producto WHERE producto_id = '${producto_id}'`);
        if (newProducto.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Producto creado',
            producto: newProducto.rows
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
        


    }
}

const getById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = ${id}`);
        return res.status(200).json({
            ok: true,
            message: 'Producto encontrado',
            producto: producto.rows
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const getAll = async (req = request, res = response) => {
    try {
        const productos = await db.query(`SELECT * FROM producto`);
        return res.status(200).json({
            ok: true,
            message: 'Productos encontrados',
            productos: productos.rows
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const update = async (req = request, res = response) => {
    const { id } = req.params;
    const { marca_id, proveedor_id, titulo, precio, caracteristicas, descripcion, stock } = req.body;

    try {
        //verify that there is a producto with producto_id
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = '${id}'`);
        if (producto.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }
        //verify the existence of the marca in the database
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = '${marca_id}'`);
        if (marca.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La marca no existe'
            });
        }
        //verify the existence of the proveedor in the database
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = '${proveedor_id}'`);
        if (proveedor.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }

        //update producto
        await db.query(`UPDATE producto SET marca_id = ${marca_id}, proveedor_id = ${proveedor_id}, titulo = '${titulo}', precio = ${precio}, caracteristicas = '${caracteristicas}', descripcion = '${descripcion}',stock = ${stock} WHERE producto_id = '${id}'`);

        //bring the updated producto
        const updatedProducto = await db.query(`SELECT * FROM producto WHERE producto_id = '${id}'`);
        if (updatedProducto.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Producto actualizado',
            producto: updatedProducto.rows
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const deleteProducto = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        //verify that there is a producto with producto_id
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = '${id}'`);
        if (producto.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        //delete producto
        await db.query(`DELETE FROM producto WHERE producto_id = '${id}'`);

        // //bring the deleted producto
        // const deletedProducto = await db.query(`SELECT * FROM producto WHERE producto_id = '${id}'`);
        // if (deletedProducto.rows.length > 0) {
        //     return res.status(400).json({
        //         ok: false,
        //         message: 'El producto no existe'
        //     });
        // }

        return res.status(200).json({
            ok: true,
            message: 'Producto eliminado'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}
  

module.exports = {
    create,
    getById,
    getAll,
    update,
    deleteProducto
}