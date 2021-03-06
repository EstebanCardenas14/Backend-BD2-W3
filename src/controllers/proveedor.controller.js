const { request, response } = require('express');
const db = require('../database/postgres-connection');
const { validateUser, createUser, updateUser } = require('../helpers/index');

const create = async (req = request, res = response) => {
    const { id_documento, username, num_doc, nombres, apellidos, telefono, correo, clave } = req.body;

    try {
        //verify the existence of the supplier
        await validateUser('Proveedor', id_documento, username, num_doc, telefono, correo);
        //create the supplier
        const user = await createUser('Proveedor', id_documento, username, num_doc, nombres, apellidos, telefono, correo, clave);
        //associate the user to the suppliers table
        await db.query(`INSERT INTO proveedor (usuario_id, estado) VALUES (${user.usuario_id}, ${true})`);

        return res.status(200).json({
            ok: true,
            message: 'Proveedor creado',
            proveedor: user
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor',
            error
        });

    }

}

const getById = async (req = request, res = response) => {
    try {

        const { id } = req.params;
        const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${id}`);
        const proveedor = await db.query(`SELECT * FROM proveedor WHERE usuario_id = ${id}`);

        if (user.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El proveedor no existe'
            });
        }

        if (proveedor.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no es proveedor'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Proveedor encontrado',
            proveedor: user.rows[0],
            registro_proveedor: proveedor.rows[0]
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

        const proveedores = [];
        const data = await db.query(`SELECT * FROM proveedor`);

        for (let register in data.rows) {
            const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${data.rows[register].usuario_id}`);
            proveedores.push(user.rows[0]);
        }

        return res.status(200).json({
            ok: true,
            message: 'Proveedores encontrados',
            proveedores
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
        //Delete the provider
        await db.query(`DELETE FROM proveedor WHERE usuario_id = ${id}`);
        //Delete the user
        await db.query(`DELETE FROM usuario WHERE usuario_id = ${id}`);

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

const updateById = async (req = request, res = response) => {
    try {

        const { id } = req.params;
        const { id_documento, username, num_doc, nombres, apellidos, telefono, correo } = req.body;
        //verify the existence of the supplier
        const verify = await db.query(`SELECT * FROM proveedor WHERE usuario_id = ${id}`);
       
        if (verify.rowCount === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no es proveedor'
            });
        }

        //update the user
        const proveedor = await updateUser(id, id_documento, username, num_doc, nombres, apellidos, telefono, correo);

        return res.status(200).json({
            ok: true,
            message: 'Proveedor actualizado',
            proveedor
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
    create,
    getById,
    getAll,
    deleteById,
    updateById
}