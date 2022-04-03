const {Router} = require('express');
const router = Router();

const { create,getByRol,getAll,update,deleteById,getById} = require('../controllers/comprador.controller');

router.post('/create', create);
router.get('/getByRol/:rol', getByRol);
router.get('/getAll', getAll);
router.get('/getById/:id', getById);
router.delete('/remove/:id', deleteById);
router.put('/update/:id', update);

module.exports = router;