const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime, Interval } = require("luxon");

const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    message: { type: String, maxLength: 320, required: true},
    date_created: { type: Date, required: true },
    thread_id: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
    msgno: { type: Number }
}, { collection: 'messages' })

MessageSchema.virtual("date_created_formatted").get(function() {
  const currentDate = DateTime.fromISO(new Date().toISOString())
  const dateCreation = DateTime.fromISO(this.date_created.toISOString())
  const res = Interval.fromDateTimes(dateCreation, currentDate)

  return (
    res.length('seconds') < 60 ?
      Math.trunc(res.length('seconds')) + ' seconds ago' :
    res.length('minutes') < 60 ?
      Math.trunc(res.length('minutes')) + ' minutes ago' :
    res.length('hours') < 24 ?
      Math.trunc(res.length('hours')) + ' hours ago' :
    res.length('days') < 7 ?
      Math.trunc(res.length('days')) + ' days ago' :
      Math.trunc(res.length('weeks')) + ' weeks ago' 
  )
})

MessageSchema.virtual("get_page").get(function() {
  const msgsCount = this.msgno
  if (msgsCount < 10) { return '1' }
  const number = msgsCount.toString()
  if (msgsCount % 10 === 0) {
      return parseInt(number.slice(0, 1))
  } else {
      return parseInt(number.slice(0, 1)) + 1
  }
})

module.exports = mongoose.model("Message", MessageSchema)