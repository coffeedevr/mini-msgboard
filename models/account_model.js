const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime, Interval } = require("luxon");

const AccountSchema = new Schema({
    username: { type: String, minLength: 7, maxLength: 15, required: true},
    password: { type: String, minLength: 8, required: true },
    email: { type: String},
    gender: { type: String },
    location: { type: String },
    date_created: { type: Date, required: true }
}, { collection: 'accounts' })

AccountSchema.virtual("get_acc_age").get(function() {
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

module.exports = mongoose.model("Account", AccountSchema)