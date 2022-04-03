const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    const{ rol,username,doc_type, doc_num, name, lastname, phone, email, password,estado } = req.body;
   
    try {

        const rolUser = await db.query(`SELECT * FROM rol WHERE id_rol = '${rol}'`);
        console.log(rolUser.rows[0]);
        const rolUserDB = rolUser.rows[0];

        const doc_typeUser = await db.query(`SELECT * FROM documento WHERE id_documento = '${doc_type}'`);
        console.log(doc_typeUser.rows[0]);
        const doc_typeUserDB = doc_typeUser.rows[0];


        await db.query(`INSERT INTO usuario (rol_id, doc_id, username, num_doc, nombres, apellidos, telefono, correo, clave, estado) VALUES ('${rol}','${doc_type}','${username}','${doc_num}','${name}','${lastname}','${phone},'${email}','${password}','${estado}')`);
        return res.status(200).json({
            ok: true,
            message: 'Vendedor creado'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }

    }

    const getByRol = async (req = request, res = response) => {
        try {
            const { rol } = req.params;
            const user = await db.query(`SELECT * FROM usuario WHERE rol_id = ${rol}`);
            return res.status(200).json({
                ok: true,
                message: 'Vendedor encontrado',
                user: user.rows
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
            const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${id}`);
            return res.status(200).json({
                ok: true,
                message: 'Vendedor encontrado',
                user: user.rows
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
            const users = await db.query(`SELECT * FROM usuario`);
            return res.status(200).json({
                ok: true,
                message: 'Vendedor encontrados',
                users: users.rows
            });
        } catch (error) {
            return res.status(400).json({
                ok: false,
                message: 'Error en el servidor'
            });
        }
    }

    const update = async (req = request, res = response) => {
        try {
            const { id } = req.params;
            const { rol, username, doc_type, doc_num, name, lastname, phone, email, password, estado } = req.body;
            const user = await db.query(`SELECT * FROM usuario WHERE id_usuario = ${id}`);
            if (user.rows.length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Vendedor no encontrado'
                });
            }
            await db.query(`UPDATE usuario SET rol_id = '${rol}', doc_id = '${doc_type}', username = '${username}', num_doc = '${doc_num}', nombres = '${name}', apellidos = '${lastname}', telefono = '${phone}', correo = '${email}', clave = '${password}', estado = '${estado}' WHERE id_usuario = ${id}`);
            return res.status(200).json({
                ok: true,
                message: 'Vendedor actualizado'
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
            const user = await db.query(`SELECT * FROM usuario WHERE id_usuario = ${id}`);
            if (user.rows.length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Vendedor no encontrado'
                });
            }
            await db.query(`DELETE FROM usuario WHERE id_usuario = ${id}`);
            return res.status(200).json({
                ok: true,
                message: 'Vendedor eliminado'
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
        getByRol,
        getAll,
        update,
        deleteById,
        getById
    }