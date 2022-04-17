const {Router} = require('express');
const router = Router();

const { create} = require('../controllers/carrito.controller');

router.post('/create', create);

module.exports = router;