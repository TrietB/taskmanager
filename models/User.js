const mongoose = require('mongoose')

//Create user schema
const UserSchema = mongoose.Schema({
    name : {type: String, required: true},

},
{
    timestamps: true,
}
)

const Users = mongoose.model('Users', UserSchema)

module.exports = Users