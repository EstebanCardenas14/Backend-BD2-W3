const {Router} = require('express');
const router = Router();

const { create,getAll,update,deleteProducto,getById} = require('../controllers/producto.controller');

router.post('/create', create);
router.get('/getAll', getAll);
router.get('/getById/:id', getById);
router.delete('/remove/:id', deleteProducto);
router.put('/update/:id', update);

module.exports = router;


