const session = require('express-session')

const addQuery = (req, res, next) => {
    req.query.page = req.query.page || 1
    req.query.order = req.query.order || 'desc'
    next();
}

module.exports = { addQuery }