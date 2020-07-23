const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribeSchema = new Schema({

    question: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    message: {
        type: String
    },
    read: {
      type: Boolean, default: false  
    },
    date_created: {
        type: Date, default: Date.now
    }

})
module.exports = Subscribe = mongoose.model('subscribe', subscribeSchema);
