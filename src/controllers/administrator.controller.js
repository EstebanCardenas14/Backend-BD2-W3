const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    const { rol, username, doc_type, doc_num, name, lastname, phone, email, password } = req.body;
    try {

        const rolUser = await db.query(`SELECT * FROM rol WHERE descripcion = '${rol}'`);
        console.log(rolUser.rows[0]);
        console.log(rolUser.rows[0].descripcion);
        const rolUserDB = rolUser.rows[0];
        console.log(rolUserDB);
        console.log(rolUserDB.descripcion);

      //  await db.query(`INSERT INTO usuario (nombre, apellido, correo, clave, rol) VALUES ('${nombre}', '${apellido}', '${correo}', '${clave}', '${rol}')`);
        return res.status(200).json({
            ok: true,
            message: 'Usuario creado'
        });
        
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Error en el servidor'
        });
    }
}