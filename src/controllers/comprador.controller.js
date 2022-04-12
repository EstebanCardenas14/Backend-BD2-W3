const { request, response } = require('express');
const db = require('../database/postgres-connection');
const bcrypt = require('bcryptjs');

const create = async (req = request, res = response) => {
    const { username, num_doc, doc_id, name, lastname, phone, email, password } = req.body;

    try {
        //verify that there is no buyer with the username
        const userVar = await db.query(`SELECT * FROM usuario WHERE username = '${username}'`);
        if (userVar.rows.length > 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario ya existe'
            });
        }

        //verify the existence of the role in the database
        const rolUser = await db.query(`SELECT * FROM rol WHERE descripcion = 'comprador'`);
        if (rolUser.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El rol no existe'
            });
        }

        //verify that the document exists
        const doc_typeUser = await db.query(`SELECT * FROM documento WHERE id_documento = '${doc_id}'`);
        if (doc_typeUser.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El documento no existe'
            });
        }

        //Encrypt the password
        const salt = bcrypt.genSaltSync();
        pass = bcrypt.hashSync(password, salt);

        //Insert the new buyer in the database
        await db.query(`INSERT INTO usuario (rol_id, doc_id, username, num_doc, nombres, apellidos, telefono, correo, clave, estado) VALUES (${rolUser.rows[0].id_rol},${doc_typeUser.rows[0].id_documento},${num_doc},'${username}','${name}','${lastname}',${phone},'${email}','${password}',true)`);

        

        //bring the new buyer
        const user = await db.query(`SELECT * FROM usuario WHERE username = '${username}'`);
        if (user.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no fue agregado'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Comprador creado',
            comprador: user.rows
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
        //bring the id of the buyer
        const { id } = req.params;

        //bring the buyer
        const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = '${id}'`);
        //verify that the buyer exists
        if (userVer.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Comprador no encontrado'
            });
        }

        //return the buyer
        return res.status(200).json({
            ok: true,
            message: 'Comprador encontrado',
            user: user.rows
        });

    } catch (error) {
        //if there is an error, return the error
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const getAll = async (req = request, res = response) => {
    try {
         //verify the existence of the role in the database
         const rol = await db.query(`SELECT * FROM rol WHERE descripcion = 'Comprador'`);
         if (rol.rows.length === 0) {
             return res.status(400).json({
                 ok: false,
                 message: 'El rol no existe'
             });
         }

         //bring the buyers
        const users = await db.query(`SELECT * FROM usuario where rol_id = ${rol.rows[0].id_rol}`);

        //verify that the buyers exists
        if (users.rows.length === 0) {
            return res.status(200).json({
                ok: true,
                message: 'No hay compradores'
            });
        }

        //return the buyers
        return res.status(200).json({
            ok: true,
            message: 'Compradores encontrados',
            users: users.rows
        });

    } catch (error) {

        //if there is an error, return the error
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}

const update = async (req = request, res = response) => {
    try {
        //bring the id of the buyer
        const { id } = req.params;
        //bring the data of the buyer to update
        const { username, doc_type, doc_num, name, lastname, phone, email, estado } = req.body;

        //verify that the buyer exists
        const user = await db.query(`SELECT * FROM usuario WHERE id_usuario = ${id}`);
        if (user.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Comprador no encontrado'
            });
        }

        //update the buyer
        await db.query(`UPDATE usuario SET rol_id = '${rol}', doc_id = '${doc_type}', username = '${username}', num_doc = '${doc_num}', nombres = '${name}', apellidos = '${lastname}', telefono = '${phone}', correo = '${email}', clave = '${password}', estado = '${estado}' WHERE id_usuario = ${id}`);
        return res.status(200).json({
            ok: true,
            message: 'Comprador actualizado'
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
        const user = await db.query(`SELECT * FROM usuario WHERE usuario_id = ${id}`);
        if (user.rows.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Comprador no encontrado'
            });
        }
        await db.query(`DELETE FROM usuario WHERE usuario_id = ${id}`);
        return res.status(200).json({
            ok: true,
            message: 'Comprador eliminado'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}



module.exports = {
    create,
    getAll,
    update,
    deleteById,
    getById
}