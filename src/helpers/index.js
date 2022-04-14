const jwt = require('./jwt');
const validateUser = require('./validate-user');
const createUser = require('./create-user');
const updateUser = require('./update-user');

module.exports = {
    ...jwt,
    ...validateUser,
    ...createUser,
    ...updateUser
};