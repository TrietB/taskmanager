const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const TaskSchema = mongoose.Schema({
    name: {type:String, required: true},
    description: {type:String, required: true},
    assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    status: {type: String, enum: ["pending","working",'review','done','archived'], default: 'pending'},
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    deleted: {type: Boolean, default: false}
},
{
    timestamps: true
})

TaskSchema.plugin(mongoose_delete)

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task