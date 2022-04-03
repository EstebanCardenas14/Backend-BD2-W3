const {Router} = require('express');
const router = Router();

const { create,getAll,deleteById,getById} = require('../controllers/proveedor.controller');

router.post('/create', create);
router.get('/getAll', getAll);
router.get('/getById/:id', getById);
router.delete('/remove/:id', deleteById);

module.exports = router;
