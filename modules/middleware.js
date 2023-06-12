const session = require('express-session')

const addQuery = (req, res, next) => {
    req.query.order = req.query.order || 'desc'
    req.query.page = req.query.page || '1'
    next();
}

module.exports = { addQuery }