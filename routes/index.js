var express = require('express');
var router = express.Router();

const thread_controller = require("../controllers/thread_controller")

/* GET home page. */
router.get('/', thread_controller.display_thread)
router.get('/new', thread_controller.create_thread_get)
router.post('/new', thread_controller.create_thread_post)

module.exports = router;
