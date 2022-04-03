const {Router} = require('express');
const router = Router();

const { allDocument } = require('../controllers/document.controller');

router.get('/all', allDocument);

module.exports = router;