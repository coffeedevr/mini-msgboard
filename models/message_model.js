const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime, Interval } = require("luxon");

const MessageSchema = new Schema({
    user: { type: String, maxLength: 18},
    message: { type: String, maxLength: 320, required: true},
    date_created: { type: Date },
    thread_id: { type: Schema.Types.ObjectId }
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

MessageSchema.virtual("position").get(function() {

})

module.exports = mongoose.model("Message", MessageSchema)