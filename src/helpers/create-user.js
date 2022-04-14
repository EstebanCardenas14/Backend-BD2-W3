const { request, response } = require('express');
const db = require('../database/postgres-connection');
const bcrypt = require('bcryptjs');

//create the user
const createUser = async (id_rol, id_documento, username, num_doc, nombres, apellidos, telefono, correo, clave, req = request, res = response) => {
    try {

        return new Promise(async (resolve, reject) => {
            //bring the role
            const rol = await db.query(`SELECT * FROM rol WHERE descripcion = '${id_rol}'`);
            //Encrypt the password
            const salt = bcrypt.genSaltSync();
            pass = bcrypt.hashSync(clave, salt);
            //create the user
            await db.query(`INSERT INTO usuario (rol_id, doc_id, username, num_doc, nombres, apellidos, telefono, correo, clave, estado) VALUES (${rol.rows[0].id_rol},${id_documento},'${username}',${num_doc},'${nombres}','${apellidos}',${telefono},'${correo}','${pass}',${true});`);
            //verify the existence of the user
            const user =  await db.query(`SELECT * FROM usuario WHERE username = '${username}'`);
            if (user.rowCount === 0) {
                return reject('Error al crear el usuario');
            }

            resolve(user.rows[0]);

        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            type: 'Error en el servidor'
        });
    }
};

module.exports = { createUser };