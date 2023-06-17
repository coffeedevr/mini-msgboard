var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../modules/middleware')

const thread_controller = require("../controllers/thread_controller")
const account_controller = require("../controllers/account_controller")

/* GET home page. */
router.get('/', thread_controller.display_thread)
router.get('/log-in', forwardAuthenticated, account_controller.login_get)
router.get('/sign-up', forwardAuthenticated, account_controller.signup_get)
router.post('/sign-up', account_controller.signup_post)

module.exports = router;
