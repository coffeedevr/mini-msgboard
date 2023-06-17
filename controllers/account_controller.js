const Account = require("../models/account_model")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render('login')
})

exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render('signup')
})

exports.signup_post = [
    body("username", "Thread name must consist of between 7 to 15 characters.")
      .trim()
      .isLength({ min: 7, max: 15 })
      .escape(),
    body('email')
      .trim()
      .escape(),
    body('email', 'Email already exist.')
      .custom(async value => {
        const user = await Account.findOne({ email: value })
        if (user) {
            throw new Error('Email already in use.')
        }
      }),
    body('password', 'Your password must consist of at least 7 characters')
      .isLength({ min: 7}),
    body("passwordConfirm", "Password don't match")
      .custom((value, { req }) => {
        return value === req.body.password
      }),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req)
      const account = new Account({username: req.body.username, password: req.body.password, email: req.body.email, date_created: new Date(), gender: 'Unknown', location: 'Unknown'})

      if (!errors.isEmpty()) {
        res.render('signup', { errors: errors.array() })
      } else {
        await account.save()
        res.redirect('/')
      }
    }
)]