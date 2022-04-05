const { request, response } = require('express');
const db = require('../database/postgres-connection');

const create = async (req = request, res = response) => {
    try{
        //save the category collected in the body
        const {nombre, estado} = req.body;
        
        //list the category
        const category = await db.query(`SELECT * FROM categoria WHERE nombre = '${nombre}'`);

        //loop through the list of categories to check if the category already exists
        for (let doc in category.rows) {
            if (category.rows[doc].nombre === nombre) {
                return res.status(400).json({
                    ok: false,
                    message: 'La categoria ya existe'
                });
            }
        }

        //if the category does not exist, create it
        await db.query(`INSERT INTO categoria (nombre, estado) VALUES ('${nombre}', ${true})`);

        //get the record of the created category
        const categoryResult = await db.query(`SELECT * FROM categoria WHERE nombre = '${nombre}'`);
        console.log(categoryResult.rows[0]);

        //return the created category
        if (categoryResult.rowCount > 0) {
            return res.status(200).json({
                ok: true,
                category: categoryResult.rows[0]
            });
        }

        //if the category was not created return an error
        return res.status(404).json({
            ok: false,
            message: 'Categoria no creada'
        });

    } catch (error) {
        //if there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al crear la categoria',
            error
        });



    }
}

const getById = async (req = request, res = response) => {
    try {

        //save the id of the category collected in the body
        const {id} = req.params;

        //list the category
        const category = await db.query(`SELECT * FROM categoria WHERE categoria_id = '${id}'`);

        //return the category
        if (category.rowCount > 0) {
            return res.status(200).json({
                ok: true,
                category: category.rows[0]
            });
        }

        //if the category was not found return an error
        return res.status(404).json({
            ok: false,
            message: 'Categoria no encontrada'
        });

    } catch (error) {
        //if there is an error return the error
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener la categoria',
            error
        });

    }
}

const getAll = async (req = request, res = response) => {
    try {

        //list the categories
        const categories = await db.query(`SELECT * FROM categoria`);

        //return the categories
        if (categories.rowCount > 0) {
            return res.status(200).json({
                ok: true,
                categories: categories.rows
            });
        }

        //if the categories were not found return an error
        return res.status(404).json({
            ok: false,
            message: 'No se encontraron categorias'
        });

    } catch (error) {
        //if there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener las categorias',
            error
        });

    }
}

const update = async (req = request, res = response) => {
    try {

        //save the id of the category collected in the body
        const {id} = req.params;

        //save the category collected in the body
        const {nombre, estado} = req.body;

        //list the category
        const category = await db.query(`SELECT * FROM categoria WHERE categoria_id = '${id}'`);

        //loop through the list of categories to check if the category already exists
        for (let doc in category.rows) {
            if (category.rows[doc].nombre === nombre) {
                return res.status(400).json({
                    ok: false,
                    message: 'La categoria ya existe'
                });
            }
        }

        //if the category does not exist, update it
        await db.query(`UPDATE categoria SET nombre = '${nombre}' WHERE categoria_id = '${id}'`);

        //get the record of the updated category
        const categoryResult = await db.query(`SELECT * FROM categoria WHERE categoria_id = '${id}'`);
        console.log(categoryResult.rows[0]);

        //return the updated category
        if (categoryResult.rowCount > 0) {
            return res.status(200).json({
                ok: true,
                category: categoryResult.rows[0]
            });
        }

        //if the category was not updated return an error
        return res.status(404).json({
            ok: false,
            message: 'Categoria no actualizada'
        });

    } catch (error) {
        console.log(error);
        //if there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la categoria',
            error
        });

    }
}

const deleteById = async (req = request, res = response) => {
    try {

        //save the id of the category collected in the body
        const {id} = req.params;

        //list the category
        const category = await db.query(`SELECT * FROM categoria WHERE categoria_id = '${id}'`);

        //if the category does not exist, delete it
        await db.query(`DELETE FROM categoria WHERE categoria_id = '${id}'`);

        //return the deleted category
        if (category.rowCount > 0) {
            return res.status(200).json({
                ok: true,
                category: category.rows[0]
            });
        }

        //if the category was not deleted return an error
        return res.status(404).json({
            ok: false,
            message: 'Categoria no eliminada'
        });

    } catch (error) {
        //if there is an error return the error
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la categoria',
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
