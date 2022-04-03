
const {request, response} = require('express');
const db = require('../database/postgres-connection');

const allDocument = async(req = request, res = response) => {
    const documents = await db.query('SELECT * FROM documento');
    if(documents.rowCount > 0) {
        
        return res.status(200).json({
            ok: true,
            documents: documents.rows
        });
    }
    return res.status(404).json({
        ok: false,
        message: 'Documentos no encontrado'
    });
}

module.exports = {
    allDocument
}