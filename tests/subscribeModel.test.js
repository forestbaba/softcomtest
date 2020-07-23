const mongoose = require('mongoose');
const db = "mongodb://localhost/test_softcom";
mongoose.connect(db);
const Subscribe = require('../question/subscribeModel');
const Question = require('../question/questionModel')


describe("check the subscription model", () => {
    beforeAll(async () => {
        await Subscribe.deleteMany({});
    })


    afterEach(async () => {
        await Subscribe.deleteMany({});
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it("shows that a subscribe module exists", () => {
        expect(Subscribe).toBeDefined();
    })

    describe("get a subscribed question ", () => {
        it("Returns a question being subscribed to", async () => {
            const questn = new Subscribe({
                message: "the test subscription",
                user: "5f1758149c34ca4c64e59c1c",
                question: "5f1758149c34ca4c64e59c1c",
            });

            await questn.save()

            const checkQuestion = await Subscribe.findOne({ question: "5f1758149c34ca4c64e59c1c" })
            const expected = "the test subscription"
            const actual = checkQuestion.message;
            expect(actual).toEqual(expected);
        });
    })

    describe("Subscribe to a question", () => {
        it("Subscribe to a question of interest", async () => {

            const newSub = new Subscribe({
                message: "The test subscription",
                user: "5f17d6657dd11329c05f7eff",
                question: "5f1758149c34ca4c64e59c1c",
            });

            const tbs = await newSub.save();
            const expected = "5f1758149c34ca4c64e59c1c";
            const actual = tbs.question;
            const expectedMsg = "The test subscription"

            expect(tbs.message).toEqual(expectedMsg)
            expect(tbs.question.toString() === expected).toBe(true);
        })
    })
})