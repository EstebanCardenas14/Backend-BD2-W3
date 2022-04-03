const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    try{
        //Save the proveedor collected in the body
        const {usuario_id, estado} = req.body;
        
        const userProv = await db.query(`SELECT * FROM usuario usuario_id = ${usuario_id}`);
        const userProvDB = userProv.rows[0];
        console.log(userProvDB);
        
        await db.query(`INSERT INTO proveedor (usuario_id, estado) VALUES ('${usuario_id}','${estado}')`);
        return res.status(200).json({
            ok: true,
            message: 'Proveedor creado'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });

    }
}

const getById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = ${id}`);
        return res.status(200).json({
            ok: true,
            message: 'Proveedor encontrado',
            proveedor: proveedor.rows
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
        const proveedor = await db.query(`SELECT * FROM proveedor`);
        return res.status(200).json({
            ok: true,
            message: 'Proveedores encontrados',
            proveedor: proveedor.rows
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const deleteById = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM proveedor WHERE proveedor_id = ${id}`);
        return res.status(200).json({
            ok: true,
            message: 'Proveedor eliminado'
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
    deleteById
}