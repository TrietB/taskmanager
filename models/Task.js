const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    name: {type:String, required: true},
    description: {type:String, required: true},
    assignee: { type: mongoose.Schema.Types.String, ref: "User"},
    status: {type: String, enum: ["pending","working",'review','done','archived']},
    assignedBy: { type: mongoose.Schema.Types.String, ref: "User"},

},
{
    timestamps: true
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task