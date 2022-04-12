const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    const { proveedor_id,usuario_id } = req.body;

    try{
        //verify that there is no proveedor with prov_id
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = '${proveedor_id}'`);
        if (proveedor.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor ya existe'
            });
        }
        //verify the existence of the user in the database
        const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = '${usuario_id}'`);
        if (user.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe'
            });
        }

        //insert proveedor
        await db.query(`INSERT INTO proveedor (proveedor_id, usuario_id, estado) VALUES ('${proveedor_id}', '${usuario_id}', true)`);

        //bring the new proveedor
        const newProveedor = await db.query(`SELECT * FROM proveedor WHERE proveedor_id = '${proveedor_id}'`);
        if (newProveedor.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Proveedor creado',
            proveedor: newProveedor.rows
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