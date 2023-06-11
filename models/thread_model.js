const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { DateTime } = require("luxon");

const ThreadSchema = new Schema({
    user: { type: String, maxLength: 18},
    title: { type: String, maxLength: 32, required: true},
    message: { type: String, maxLength: 360, required: true},
    date_created: { type: Date },
    flair: { type: String, required: true },
    tags: [{type: String}]
}, { collection: 'threads' })

ThreadSchema.virtual("date_created_formatted").get(function() {
  return DateTime.fromISO(this.date_created.toISOString()).toLocaleString(DateTime.DATETIME_MED)
})

module.exports = mongoose.model("Thread", ThreadSchema)