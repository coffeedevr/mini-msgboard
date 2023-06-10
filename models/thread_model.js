const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ThreadSchema = new Schema({
    user: { type: String, maxLength: 18},
    title: { type: String, maxLength: 32, required: true},
    message: { type: String, maxLength: 360, required: true},
    date_created: { type: Date },
}, { collection: 'threads' })

ThreadSchema.virtual("date_created_formatted").get(function() {
    return `Fixed date`
})

module.exports = mongoose.model("Thread", ThreadSchema)