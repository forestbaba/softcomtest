const mongoose = require('mongoose');
const db = "mongodb://localhost/test_softcom";
mongoose.connect(db);
const Question = require('../question/questionModel');


describe("check the Question model", () => {
    beforeAll(async () => {
        await Question.deleteMany({});
    })


    afterEach(async () => {
        await Question.deleteMany({});
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it("should shows that Question module exists", () => {
        expect(Question).toBeDefined();
    })

    describe("fetch a Question", () => {
        it("should returns a question by its id", async () => {

            const quest = new Question({
                _id: "5f17d6657dd11329c05f7eff",
                body: "test question",
                user: "5f17d6657dd11329c05f7eff",
                vote: 0
            });

            await quest.save()

            const checkedQues = await Question.findOne({ _id: "5f17d6657dd11329c05f7eff" })
            const expected = "test question"
            const actual = checkedQues.body;
            expect(actual).toEqual(expected);
        });
    })

    describe("Submit an Question", () => {
        it("should post a Question", async () => {

            const newQues = new Question({
                body: "test question",
                user: "5f1758149c34ca4c64e59c1c",
                vote: 0
            });

            let tbs = await newQues.save();
            const expected = "5f1758149c34ca4c64e59c1c";
            const actual = tbs.user;

            expect(actual.toString()).toEqual(expected);
        })
    })
    describe("Upvote a Question", () => {
        it("SHould increment the vote count by 1", async () => {

            const newQues = new Question({
                _id:"5f17d6657dd11329c05f7eff",
                body: "test question",
                user: "5f1758149c34ca4c64e59c1c",
                vote: 0
            });

            let tbs = await newQues.save();
            let checkedQues = await Question.findOne({ _id: "5f17d6657dd11329c05f7eff" })

            checkedQues.vote = checkedQues.vote + 1
            let upvoted = await checkedQues.save()
            const expected = 1;
            const actual = upvoted.vote;
            expect(actual).toEqual(expected);
        })
    })
    describe("return an array of matched Question string", () => {
        it("SHould increment the vote count by 1", async () => {

            const newQues = new Question({
                _id:"5f17d6657dd11329c05f7eff",
                body: "test question",
                user: "5f1758149c34ca4c64e59c1c",
                vote: 0
            });

            let tbs = await newQues.save();
            let question = await Question.find({ "body": { $regex: 'test', $options: 'i' } })

            expect(Array.isArray(question)).toBe(true);
        })
    })
})