const { response } = require("express");
const jwt = require('jsonwebtoken');

const validatejwt = (req, res = response, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'Error en el token'
        });
    }

    try {

        const { username, email, rol } = jwt.verify(token, process.env.SECRET_JWT_SEED);

        req.username = uid;
        req.email = email;
        req.rol = rol;

    } catch (err) {
        return res.status(401).json({
            ok: false,
            message: 'Token no valido'
        });
    }

    next();
};

module.exports = {
    validatejwt
};