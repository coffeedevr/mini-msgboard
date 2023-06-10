const Thread = require("../models/thread_model")
const Message = require("../models/message_model")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");

exports.display_thread = asyncHandler(async (req, res, next) => {
  const allThreads = await Thread.find()
    .exec()
  res.render("index", { threads: allThreads })
})

// display create thread form GET
exports.create_thread_get = asyncHandler(async (req, res, next) => {
  res.render('create_thread')
})

// create thread form POST
exports.create_thread_post = [

  //sanitize data using validator
  body("title", "Thread name must consist of between 2 to 32 characters")
    .trim()
    .isLength({ min: 2, max:32 })
    .escape(),
  body("message", "Thread message must consist of between 2 to 320 characters")
    .trim()
    .isLength({ min: 2, max:320 })
    .escape(),
  body("user", "Name must consist of between 2 to 32 characters")
    .trim()
    .isLength({ min: 2, max:32 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const thread = new Thread({user: req.body.user, title: req.body.title, message: req.body.message, date_created: req.body.date_created})

    if (!errors.isEmpty()) {
      res.render("create_thread", {
        errors: errors.array()
      })
      return
    } else {
      await thread.save()
      res.redirect('/thread/' + thread._id)
    }
})]

// individual thread display GET
exports.display_thread_indv = asyncHandler(async (req, res, next) => {
  const [thread, message] = await Promise.all([
    Thread.findById(req.params.id).exec(),
    Message.find({ thread_id: req.params.id })
    .sort({date_created: 1})
    .exec()])

  res.render('display_thread', { thread: thread, message: message })
})

// post a reply POST
exports.create_reply = [
  body("user", "Name must consist of between 2 to 32 characters")
    .trim()
    .isLength({ min: 2, max:32 })
    .escape(),
  body("message", "Thread message must consist of between 2 to 320 characters")
    .trim()
    .isLength({ min: 2, max:320 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const message = new Message({user: req.body.user, message: req.body.message, date_created: req.body.date_create, thread_id: req.body.thread_id})
    if (!errors.isEmpty()) {
      res.render("display_thread", {
        errors: errors.array()
      })
      return
    } else {
      await message.save()
      res.redirect('/thread/' + req.body.thread_id)
    }
})]