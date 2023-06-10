const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    user: { type: String, maxLength: 18},
    message: { type: String, maxLength: 320, required: true},
    date_created: { type: Date },
    thread_id: { type: Schema.Types.ObjectId }
}, { collection: 'messages' })

MessageSchema.virtual("date_created_formatted").get(function() {
    
})

module.exports = mongoose.model("Message", MessageSchema)