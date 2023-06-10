var express = require('express');
var router = express.Router();

const thread_controller = require("../controllers/thread_controller")

/* GET messages listing. */
router.get('/new', thread_controller.create_thread_get)
router.post('/new', thread_controller.create_thread_post)

router.get('/:id', thread_controller.display_thread_indv)
router.get('/:id/:page', thread_controller.display_thread_indv)

router.post('/:id', thread_controller.create_reply)
router.post('/:id/:page', thread_controller.create_reply)

module.exports = router;
