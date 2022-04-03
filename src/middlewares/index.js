const validateToken = require('../middlewares/validate-jwt');

module.exports = {
    ...validateToken
}