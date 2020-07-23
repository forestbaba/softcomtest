const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    body: {
        type: String,
        required: true
    },
    vote: {
        type: Number,
        default: 0
    },
    answer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    date_created: {
        type: Date, default: Date.now
    }

})
module.exports = Question = mongoose.model('question', QuestionSchema);
