const {Router} = require('express');
const router = Router();

const { create,getById,getAll,deleteById,update } = require('../controllers/variante.controller');

router.post('/create', create);
router.get('/getById/:id', getById);
router.get('/getAll', getAll);
router.delete('/deleteById/:id', deleteById);
router.put('/update/:id', update);

module.exports = router;