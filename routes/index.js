var express = require('express');
var router = express.Router();

const thread_controller = require("../controllers/thread_controller")

/* GET home page. */
router.get('/', thread_controller.display_thread)

router.get('/page', thread_controller.display_thread)

router.get('/page/:page', thread_controller.display_thread)

module.exports = router;
