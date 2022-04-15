const jwt = require('./jwt');
const validateUser = require('./validate-user');
const createUser = require('./create-user');
const updateUser = require('./update-user');
const validateProduct = require('./validate-product');

module.exports = {
    ...jwt,
    ...validateUser,
    ...createUser,
    ...updateUser,
    ...validateProduct
};