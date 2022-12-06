const mongoose = require('mongoose')

//Create user schema
const UserSchema = mongoose.Schema({
    name : {type: String, required: true},
    tasks: [{type: mongoose.Schema.Types.ObjectId , ref: "Task"}]
},
{
    timestamps: true,
}
)

const User = mongoose.model('User', UserSchema)

module.exports = User