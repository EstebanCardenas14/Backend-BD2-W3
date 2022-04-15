const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    const {producto_id,descripcion,stock} = req.body;
    try{
       //create variante
         await db.query(`INSERT INTO variante (producto_id,descripcion,stock,estado) VALUES ('${producto_id}','${descripcion}','${stock}',${true});`);
         //verify the existence of the variante
            const variante =  await db.query(`SELECT * FROM variante WHERE descripcion = '${descripcion}'`);
            if (variante.rowCount === 0) {
                return reject('Error al crear la variante');
            }
            return res.json({
                ok: true,
                variante: variante.rows[0]
            });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            ok: false,
            type: 'Error en el servidor'
        });
    }

};

const getById = async (req = request, res = response) => {
    try{
        
        const { id } = req.params;
        const variante = await db.query(`SELECT * FROM variante WHERE variante_id = ${id}`);
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = ${variante.rows[0].producto_id}`);

        if (variante.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La variante no existe'
            });
        }

        if (producto.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Variante encontrada',
            variante: variante.rows[0],
            producto: producto.rows[0]
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

const getAll = async (req = request, res = response) => {
    try{
        const variantes = [];
        const data = await db.query(`SELECT * FROM variante`);

        for(let variant in data.rows){
            const variante = await db.query(`SELECT * FROM variante WHERE variante_id = ${data.rows[variant].id_variante}`);
            variantes.push(variante.rows[0]);
        }

        return res.status(200).json({
            ok: true,
            message: 'Variantes encontradas',
            variantes
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });

    }

}

const update = async (req = request, res = response) => {

    const { id } = req.params;
    const {descripcion,stock,producto_id} = req.body;
    try{

        //verify the existence of the variante
        const variante = await db.query(`SELECT * FROM variante WHERE variante_id = ${id}`);
        if (variante.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La variante no existe'
            });
        }

        //verify the existence of the product
        const producto = await db.query(`SELECT * FROM producto WHERE producto_id = ${producto_id}`);
        if (producto.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        //update the variante
        const update = await db.query(`UPDATE variante SET descripcion = '${descripcion}', stock = ${stock}, producto_id = ${producto_id} WHERE variante_id = ${id}`);

        return res.status(200).json({
            ok: true,
            message: 'Variante actualizada',
            update
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
        //verify the existence of the variante
        const variante = await db.query(`SELECT * FROM variante WHERE variante_id = ${id}`);
        if (variante.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'La variante no existe'
            });
        }

        //delete the variante
        const deleteVariante = await db.query(`DELETE FROM variante WHERE variante_id = ${id}`);

        return res.status(200).json({
            ok: true,
            message: 'Variante eliminada',
            deleteVariante
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
    getById,
    getAll,
    update,
    deleteById
}



