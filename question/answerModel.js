const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    body: {
        type: String
    },
    vote: {
        type: Number,
        default: 0
    },
    date_created: {
        type: Date, default: Date.now
    }

})
module.exports = Answer = mongoose.model('answer', AnswerSchema);
