const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    try{
        //Save the marca collected in the body
        const { nombre } = req.body;

        //List of marca
        const marcaVar = await db.query('SELECT * FROM marca');

        //Loop through the list of marca to see if the marca already exists
        for(let mar in marcaVar.rows){
            if(marcaVar.rows[mar].nombre === nombre){
                return res.status(400).json({
                    ok: false,
                    message: 'La marca ya existe'
                });
            }
        }

        //If the marca does not exist I create it
        await db.query(`INSERT INTO marca (nombre, estado) VALUES ('${nombre}', ${true})`);

        //Get the record of the marca created
        const marcaResult = await db.query(`SELECT * FROM marca WHERE nombre = '${nombre}'`);

        //Return the marca created
        if(marcaResult.rowCount > 0){
            return res.status(200).json({
                ok: true,
                marca: marcaResult.rows[0]
            });
        }

        //If the marca was not created, I return an error
        return res.status(404).json({
            ok: false,
            message: 'Marca no creada'
        });

    }catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al crear la marca',
            error
        });
    }
}

const getAll = async (req = request, res = response) => {
    try{
        //Get all the marca
        const marca = await db.query('SELECT * FROM marca');

        //If the marca was found, I return the marca
        if(marca.rowCount > 0){
            return res.status(200).json({
                ok: true,
                marca: marca.rows
            });
        }

        //If the marca was not found, I return an error
        return res.status(404).json({
            ok: false,
            message: 'No se encontraron marcas'
        });

    }catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener las marcas',
            error
        });
    }
}

const getById = async (req = request, res = response) => {
    try{
        //Get the id of the marca
        const { id } = req.params;

        //Get the marca
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${id}`);

        //If the marca was found, I return the marca
        if(marca.rowCount > 0){
            return res.status(200).json({
                ok: true,
                marca: marca.rows[0]
            });
        }

        //If the marca was not found, I return an error
        return res.status(404).json({
            ok: false,
            message: 'No se encontró la marca'
        });

    }catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener la marca',
            error
        });
    }
}

const update = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const { nombre } = req.body;
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${id}`);

        //If the marca was found, I update the marca
        if(marca.rowCount > 0){
            await db.query(`UPDATE marca SET nombre = '${nombre}' WHERE marca_id = ${id}`);
            return res.status(200).json({
                ok: true,
                message: 'Marca actualizada'
            });
        }

        //If the marca was not found, I return an error
        return res.status(404).json({
            ok: false,
            message: 'No se encontró la marca'
        });

    }catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la marca',
            error
        });
    }
}

const deleteById = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const marca = await db.query(`SELECT * FROM marca WHERE marca_id = ${id}`);

        //If the marca was found, I delete the marca
        if(marca.rowCount > 0){
            await db.query(`DELETE FROM marca WHERE marca_id = ${id}`);
            return res.status(200).json({
                ok: true,
                message: 'Marca eliminada'
            });
        }

        //If the marca was not found, I return an error
        return res.status(404).json({
            ok: false,
            message: 'No se encontró la marca'
        });

    }catch(error){
        //If there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la marca',
            error
        });
    }
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteById
}

   