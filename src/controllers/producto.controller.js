const { request, response } = require('express');
const db = require('../database/postgres-connection');
const {uploadFile,deleteFile} = require('../helpers');

const uploadImg = async (req = request, res = response) => {
    try{

        const path = await uploadFile(req.files.archivo,['png', 'jpg', 'jpeg'] ,'producto/');
        const pathRoute = `${process.env.ROUTE_IMG}/storage/producto/`+ path;
        //console.log(pathRoute);
        
        res.status(200).json({
            ok: true,
            message: 'Imagen subida con exito',
            pathRoute
        });

    }
    catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la imagen de la marca',
            error
        });
    }
}

const create = async (req = request, res = response) => {
    const { proveedor_id } = req.params;
    const { marca_id, imagen, titulo, descripcion } = req.body;
    try {

        //validate the existence of the provider
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${proveedor_id}`);
        if (proveedor.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
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

        //create the product
        const createProduct = await db.query(`INSERT INTO producto (marca_id,proveedor_id, imagen, titulo, descripcion,estado) VALUES (${marca_id}, ${proveedor_id}, '${imagen}', '${titulo}', '${descripcion}',${true}) RETURNING *`);
        if (createProduct.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no se pudo crear'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Producto creado',
            producto: createProduct.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });

    }

}

const getProductById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //verify the existence of the product
        const product = await db.query(`SELECT * FROM producto WHERE producto_id = ${id}`);
        if (product.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        //verify the existence of the marca
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${product.rows[0].marca_id}`);
        if (marca.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La marca no existe'
            });
        }

        //verify the existence of the provider
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${product.rows[0].proveedor_id}`);
        if (proveedor.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }

        //verify the existence of the user
        const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${proveedor.rows[0].usuario_id}`);
        if (user.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Producto encontrado',
            producto: product.rows[0],
            marca: marca.rows[0],
            proveedor: user.rows[0]
        });
        
    } catch (error) {

        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }
}

const getAll = async (req = request, res = response) => {
    try {
        const productos = await db.query(`SELECT * FROM producto`);
        if (productos.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No hay productos'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Productos encontrados',
            productos: productos.rows
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }

}

const updateById = async (req = request, res = response) => {
    const { id } = req.params;
    const { marca_id,imagen, titulo, descripcion } = req.body;
    try {

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

        //validate the title of product
        if (titulo.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El titulo no puede estar vacio'
            });
        }

        //validate the description of product
        if (descripcion.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La descripcion no puede estar vacia'
            });
        }

        // Limpiar imágenes previas
        if (product.rows[0].imagen) {
            // Hay que borrar la imagen del servidor
            const path = product.rows[0].imagen.split('/');
     
            await deleteFile(path[5], 'producto/');
        }

        //update the product
        const updateProduct = await db.query(`UPDATE producto SET marca_id = ${marca_id}, imagen = '${imagen}', titulo = '${titulo}', descripcion = '${descripcion}' WHERE producto_id = ${id} RETURNING *`);


        return res.status(200).json({
            ok: true,
            message: 'Producto actualizado',
            producto: updateProduct.rows[0]
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }

}

const deleteById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
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
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });
    }
}

module.exports = {
    uploadImg,
    create,
    getProductById,
    getAll,
    updateById,
    deleteById
}