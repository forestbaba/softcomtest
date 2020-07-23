const express = require("express");
const router = express.Router();
const Question = require("./questionModel");
const Answer = require("./answerModel");
const auth = require('../helpers/auth');
const Subscriber = require('./subscribeModel');
const { mongo } = require("mongoose");

router.post('/', auth, (req, res) => {
    if (!req.body.questionBody) {
        return res.status(400).json({ error: true, message: "questionBody is required" });
    } else {
        console.log('UU: ', req.user)
        const question = new Question({
            body: req.body.questionBody,
            user: req.user.id
        }).save()
            .then(question => {
                return res.status(200).json({ error: false, message: "question posted", question })
            })
            .catch(err => {
                return res.status(400).json({ error: true, message: "Error posting question, please try again later" })
            })
    }
})
router.get('/getQuestion/:id', (req, res) => {
    Question.findById(req.params.id)
        .populate({
            path: 'answer',
            model: 'answer', populate: {
                path: 'user',
                model: 'user',
                select: { "fullname": 1, "username": 1 }
            }
        })
        .then(questions => {
            return res.status(200).json({ error: false, questions })
        }).catch(err => {
            return res.status(400).json({ error: true, message: 'Error fetching questions' })
        })
})
router.post('/answer/:qId', auth, (req, res) => {

    if (!req.body.answerBody) {
        return res.status(400).json({ error: true, message: "answerBody is required" });
    }
    Question.findById(req.params.qId)
        .then(question => {
            if (!question) {
                return res.status(404).json({ error: true, message: "question is not available" })
            } else {

                const answer = new Answer({
                    body: req.body.answerBody,
                    user: req.user.id
                }).save()
                    .then(answer => {
                        question.answer.push(answer._id)
                        question.save()
                        notifySubscribers(req.params.qId)
                        return res.status(200).json({ error: false, message: "answer posted", answer })
                    })
                    .catch(err => {
                        return res.status(400).json({ error: true, message: "Error answering question, please try again later" })
                    })
            }
        }).catch(err => {
            return res.status(400).json({ error: true, message: "error fetching question" })
        })


})

router.put('/:id', auth, (req, res) => {
    Question.findOneById(req.params.id)
        .then(question => {
            if (!question) {
                return res.status(404).json({ error: true, message: "question not available" })
            } else {
                if (req.body.vote === true) {
                    question.vote = question.vote + 1
                } else {
                    question.vote = question.vote - 1
                }
                question.save()
                    .then(question => {
                        return res.status(200).json({ error: false, question })
                    })
                    .catch(err => {
                        return res.status(400), json({ error: true, message: "error updating vote" })
                    })
            }
        }).catch(err => {
            return res.status(400), json({ error: true, message: "error updating vote" })
        })
})

router.post('/subscribe/:qId', auth, (req, res) => {
    Question.findById(req.params.qId)
        .then(question => {
            if (!question) {
                return res.status(400).json({ error: true, message: "question not found" })
            } else {
                if (question.subscribers.length > 0) {
                    for (let i = 0; i < question.subscribers.length; i++) {
                        if (question.subscribers[i].toString() === req.user.id) {
                            return res.status(400).json({ error: true, message: "You have active subscription" })
                        } else { 
                            question.subscribers.push(req.user.id)
                            question.save()
                                .then(() => {
                                    return res.status(200).json({ error: false, message: "subscription successfull" })
                                }).catch(err => {
                                    return res.status(400).json({ error: true, message: "error subscribing. please try again later" })
                                })
                        }
                    }
                } else {
                    question.subscribers.push(req.user.id)
                    question.save()
                        .then(() => {
                            return res.status(200).json({ error: false, message: "subscription successfull" })
                        }).catch(err => {
                            return res.status(400).json({ error: true, message: "error subscribing. please try again later" })
                        })
                }

            }
        })
        .catch(err => {
            return res.status(400).json({ error: true, message: "error subscribing. please try again later" })
        })
})
router.get('/getSubNotifications', auth, (req, res) => {
    Subscriber.find({ user: req.user.id })
        .populate('question')
        .then(subs => {
            return res.status(200).json({ error: false, subscribes: subs })
        })
        .catch(err => {
            return res.status(400).json({ error: true, message: "error fetching notifications" })
        })
})

router.post('/search', async (req, res) => {

    if (!req.body.searchTerm) {
        let question = await Question.find({}).limit(20).sort({ date_created: -1 })
        return res.status(200).json({ error: false, searchResult: question })
    }

    let question = await Question.find({ "body": { $regex: req.body.searchTerm, $options: 'i' } })
    return res.status(200).json({ error: false, searchResult: question })

})

const notifySubscribers = (qId) => {

    console.log('Inside: ', qId)
    Question.findById(qId)
        .then(question => {
            if (question) {
                for (let i = 0; i < question.subscribers.length; i++) {


                    const subs = new Subscriber({
                        message: "A new answer has been added to the question you subscribed for",
                        question: qId,
                        user: question.subscribers[i]
                    }).save().then(quest => {
                        console.log('Subscribers notified')

                    }).catch(err => {
                        console.log("Error msg", err)
                    })
                }
            }
        })
}

module.exports = router;