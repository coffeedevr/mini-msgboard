const asyncHandler = require("express-async-handler")

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render('login')
})