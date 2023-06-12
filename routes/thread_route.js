var express = require('express');
var router = express.Router();

const thread_controller = require("../controllers/thread_controller")

/* GET messages listing. */

router.get('/', thread_controller.display_thread_indv)
router.post('/', thread_controller.create_reply)

module.exports = router;
