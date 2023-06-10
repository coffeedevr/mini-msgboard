const Thread = require("../models/thread_model")
const Message = require("../models/message_model")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");

exports.display_thread = asyncHandler(async (req, res, next) => {
  const page = req.params.page || 1
  const skipped = (page - 1) * 10

  const [threadsCount, threadsRes, recentMsgs] = await Promise.all([
    Thread.countDocuments(),
    Thread.find()
      .limit(10)
      .skip(skipped)
      .sort({date_created: "desc"})
      .exec(),
    Message.find()
      .sort({date_created: "desc"})
      .limit(5)])
  
  if (threadsCount > 10) {

    const pageInt = parseInt(page)
    const lastpage = () => {
      const getLastPage = Math.trunc(threadsCount / 10)
      const checkRemainder = () => {
        if (threadsCount % 10 !== 0) {
          return 1
        }
        return 0
      }
      return getLastPage + checkRemainder()
    }
    const prevpage = parseInt(page) - 1
    const nextpage = () => { return pageInt < lastpage() ? pageInt + 1 : lastpage()}

    res.render("index", { count: threadsCount, threads: threadsRes, messages: recentMsgs, page: page, nextpage: nextpage(), prevpage: prevpage})
  } else {
    res.render("index", { count: threadsCount, threads: threadsRes})
  }
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
  const page = req.params.page || 1
  const skipped = (page - 1) * 10

  const [thread, msgsCount, messages] = await Promise.all([
    Thread.findById(req.params.id)
     .exec(),
    Message.find({ thread_id: req.params.id })
     .countDocuments(),
    Message.find({ thread_id: req.params.id })
     .limit(10)
     .skip(skipped)
     .sort({date_created: "asc"})
     .exec()])

  if (msgsCount > 10) {
  
    const pageInt = parseInt(page)
    const lastpage = () => {
      const getLastPage = Math.trunc(msgsCount / 10)
      const checkRemainder = () => {
        if (msgsCount % 10 !== 0) {
          return 1
        }
        return 0
      }
      return getLastPage + checkRemainder()
    }
    const prevpage = parseInt(page) - 1
    const nextpage = () => { return pageInt < lastpage() ? pageInt + 1 : lastpage()}
    
    res.render('display_thread', { thread: thread, messages: messages, page: page, nextpage: nextpage(), prevpage: prevpage })
  } else {
    res.render('display_thread', { thread: thread, messages: messages })
  }
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

    const message = new Message({user: req.body.user, message: req.body.message, date_created: req.body.date_created, thread_id: req.body.thread_id})

    if (!errors.isEmpty()) {
      const page = req.params.page || 1
      const skipped = (page - 1) * 10
    
      const [thread, msgsCount, messages] = await Promise.all([
        Thread.findById(req.params.id)
         .exec(),
        Message.countDocuments(),
        Message.find({ thread_id: req.params.id })
          .limit(10)
          .skip(skipped)
          .sort({date_created: "desc"})
          .exec()])
    
      if (msgsCount > 10) {
      
        const pageInt = parseInt(page)
        const lastpage = () => {
          const getLastPage = Math.trunc(msgsCount / 10)
          const checkRemainder = () => {
            if (msgsCount % 10 !== 0) {
              return 1
            }
            return 0
          }
          return getLastPage + checkRemainder()
        }
        const prevpage = parseInt(page) - 1
        const nextpage = () => { return pageInt < lastpage() ? pageInt + 1 : lastpage()}
        
        res.render('display_thread', { thread: thread, messages: messages, page: page, nextpage: nextpage(), prevpage: prevpage, errors: errors.array() })
      } else {
        res.render('display_thread', { thread: thread, messages: messages, errors: errors.array() })
      }
      return
    } else {
      await message.save()
      res.redirect('/thread/' + req.body.thread_id)
    }
})]