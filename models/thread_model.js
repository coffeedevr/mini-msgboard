const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime, Interval } = require("luxon");

const ThreadSchema = new Schema({
    user: { type: String, maxLength: 18},
    title: { type: String, maxLength: 64, required: true},
    message: { type: String, maxLength: 360, required: true},
    date_created: { type: Date },
    flair: { type: String, required: true },
    tags: [{type: String}]
}, { collection: 'threads' })

ThreadSchema.virtual("date_created_formatted").get(function() {
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

module.exports = mongoose.model("Thread", ThreadSchema)