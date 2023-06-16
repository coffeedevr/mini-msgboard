const Account = require("../models/account_model")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render('login')
})

exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render('signup')
})

exports.signup_post = asyncHandler(async (req, res, next) => {

})