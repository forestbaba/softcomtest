const mongoose = require('mongoose');
const db = "mongodb://localhost/test_softcom";
mongoose.connect(db);
const Answer = require('../question/answerModel');

describe("check the user model", () => {
    beforeAll(async () => {
        await Answer.deleteMany({});
    })


    afterEach(async () => {
        await Answer.deleteMany({});
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it("shows that answer module exists", () => {
        expect(Answer).toBeDefined();
    })

    describe("get answer", () => {
        it("Returns a question", async () => {

            const quest = new Answer({
                _id: "5f17d6657dd11329c05f7eff",
                body: "test question",
                user: "5f17d6657dd11329c05f7eff",
                vote: 0
            });

            await quest.save()

            const checkedAns = await Answer.findOne({ _id: "5f17d6657dd11329c05f7eff" })
            const expected = "test question"
            const actual = checkedAns.body;
            expect(actual).toEqual(expected);
        });
    })

    describe("Submit an  answer", () => {
        it("save answer to database", async () => {

            const newAns = new Answer({
                body: "test question",
                user: "5f1758149c34ca4c64e59c1c",
                vote: 0
            });

            let tbs = await newAns.save();
            const expected = "5f1758149c34ca4c64e59c1c";
            const actual = tbs.user;

            expect(actual.toString()).toEqual(expected);
        })
    })
})