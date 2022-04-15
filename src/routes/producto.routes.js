const {Router} = require('express');
const router = Router();

const {uploadImg, create,getAll,updateById,deleteById,getProductById} = require('../controllers/producto.controller');

router.post('/img', uploadImg);
router.post('/create/:proveedor_id', create);
router.get('/getAll', getAll);
router.get('/getById/:id', getProductById);
router.delete('/remove/:id', deleteById);
router.put('/update/:id', updateById);

module.exports = router;


