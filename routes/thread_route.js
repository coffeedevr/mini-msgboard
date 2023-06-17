const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../modules/middleware')

const thread_controller = require("../controllers/thread_controller")

/* GET messages listing. */

router.get('/thread/new', ensureAuthenticated, thread_controller.create_thread_get)
router.post('/thread/new', ensureAuthenticated, thread_controller.create_thread_post)
router.get('/thread/:thread', thread_controller.display_thread_indv)
router.post('/thread/:thread', thread_controller.create_reply)

module.exports = router;
