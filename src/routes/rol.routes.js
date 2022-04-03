const {Router} = require('express');
const router = Router();

const { create,getById,getAll,remove } = require('../controllers/rol.controller');

router.post('/create', create);
router.get('/getById/:id', getById);
router.get('/getAll', getAll);
router.delete('/remove/:id', remove);

module.exports = router;