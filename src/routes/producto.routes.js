const {Router} = require('express');
const router = Router();

const { create,getAll,updateById,deleteById,getProductById} = require('../controllers/producto.controller');

router.post('/create', create);
router.get('/getAll', getAll);
router.get('/getById/:id', getProductById);
router.delete('/remove/:id', deleteById);
router.put('/update/:id', updateById);

module.exports = router;


