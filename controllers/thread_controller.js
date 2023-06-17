const Thread = require("../models/thread_model")
const Message = require("../models/message_model")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const session = require('express-session')
const { lastpage } = require("../modules/get_pages")

exports.display_thread = asyncHandler(async (req, res, next) => {
  const page = req.query.page
  const skipped = (page - 1) * 10
  const pageArr = [];

  console.log(req.user)

  const [threadsCount, threadsRes, recentMsgs] = await Promise.all([
    Thread.countDocuments().exec(),
    Thread.find()
      .limit(10)
      .skip(skipped)
      .sort({date_created: req.query.order})
      .exec(),
    Message.find()
      .sort({date_created: "desc"})
      .limit(5)
      .exec()])
  const fetchMsgCount = await Promise.all(threadsRes.map( x => Message.countDocuments({ thread_id: x._id }).exec()))
  const replyArr = await Promise.all(threadsRes.map( x => Message.find({ thread_id: x._id }).sort({date_created: "desc"}).limit(1).exec()))

  fetchMsgCount.forEach( x => {
    if ( x > 10 ) {
      pageArr.push(lastpage(x))
    } else { 
      pageArr.push(1)
    }
  })
  
  if (threadsCount > 10) {
    const pageInt = parseInt(page)
    const prevpage = parseInt(page) - 1
    const nextpage = () => { 
      return pageInt < lastpage(threadsCount) ? pageInt + 1 : lastpage(threadsCount)
    }
    res.render("index", { count: threadsCount, threads: threadsRes, messages: recentMsgs, page: page, nextpage: nextpage(), prevpage: prevpage, threadpage: pageArr, replies: replyArr})
  } else {
    res.render("index", { count: threadsCount, threads: threadsRes, messages: recentMsgs, threadpage: pageArr, replies: replyArr})
  }
})

// display create thread form GET
exports.create_thread_get = asyncHandler(async (req, res, next) => {
  res.render('create_thread')
})

// create thread form POST
exports.create_thread_post = [

  //sanitize data using validator
  body("title", "Thread name must consist of between 5 to 64 characters")
    .trim()
    .isLength({ min: 2, max:64 })
    .escape(),
  body("message", "Thread message must const of at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    const thread = new Thread({ user: req.user.username, title: req.body.title, message: req.body.message, date_created: req.body.date_created, flair: req.body.flair})

    if (!errors.isEmpty()) {
      res.render("create_thread", {
        errors: errors.array()
      })
      return
    } else {
      await thread.save()
      res.redirect('/view/thread/' + thread._id)
    }
})]

// view thread display GET
exports.display_thread_indv = asyncHandler(async (req, res, next) => {
  const page = req.query.page
  const skipped = (page - 1) * 10

  const [thread, msgsCount, messages] = await Promise.all([
    Thread.findById(req.params.thread )
     .exec(),
    Message.find({ thread_id: req.params.thread })
     .countDocuments(),
    Message.find({ thread_id: req.params.thread })
     .limit(10)
     .skip(skipped)
     .sort({date_created: "asc"})
     .exec()])

  if (msgsCount > 10) {
    const pageInt = parseInt(page)
    const prevpage = parseInt(page) - 1
    const nextpage = () => { return pageInt < lastpage(msgsCount) ? pageInt + 1 : lastpage()}
    
    res.render('display_thread', { thread: thread, messages: messages, page: page, nextpage: nextpage(), prevpage: prevpage})
  } else {
    res.render('display_thread', { thread: thread, messages: messages })
  }
})

// post a reply on a thread POST
exports.create_reply = [
  body("message", "Thread message must consist of between 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
  
    const errors = validationResult(req)

    const page = parseInt(req.query.page)
    const skipped = (page - 1) * 10

    const [thread, msgsCount, messages] = await Promise.all([
      Thread.findById(req.params.thread)
       .exec(),
      Message.find({ thread_id: req.params.thread }).countDocuments(),
      Message.find({ thread_id: req.params.thread })
        .limit(10)
        .skip(skipped)
        .sort({date_created: "desc"})
        .exec()])

    const getLastPage = lastpage(msgsCount)
    const prevpage = page - 1
    const nextpage = () => {
      return page < getLastPage ? page + 1 : getLastPage
    }
    
    const message = new Message({user: req.user.username, message: req.body.message, date_created: req.body.date_created, thread_id: req.body.thread_id, msgno: msgsCount + 1})

    if (!errors.isEmpty()) {
        res.render('display_thread', { thread: thread, messages: messages, page: page, nextpage: nextpage(), prevpage: prevpage, errors: errors.array()})
      return
    } else {
      await message.save()
      res.redirect('/view/thread/' + req.body.thread_id + '?page='  + message.get_page + '#r' + message._id)
    }
})]