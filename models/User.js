const mongoose = require('mongoose')

//Create user schema
const UserSchema = mongoose.Schema({
    name : {type: String,lowercase:true, required: true},
    tasks: [{type: mongoose.Schema.Types.ObjectId , ref: "Task"}],
    role: {type:String, enum: ["manager",'employee'], default: "employee"}
},
{
    timestamps: true,
}
)

const User = mongoose.model('User', UserSchema)

module.exports = User