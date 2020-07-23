const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: {
        type: String
    },
    fullname: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    point: {
      type: Number, default:0  
    },
   
    email: {
        type: String,
        required: true
    },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },

    date_created: {
        type: Date, default: Date.now
    }

})
module.exports = User = mongoose.model('user', UserSchema);
