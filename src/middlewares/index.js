const validateToken = require('../middlewares/validate-jwt');
const validarArchivo = require('../middlewares/validarArchivo');

module.exports = {
    ...validateToken,
    ...validarArchivo
}