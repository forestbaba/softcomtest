const mongoose = require('mongoose');
const db = "mongodb://localhost/test_softcom";
mongoose.connect(db);
const User = require('../users/userModel');


describe("check the user model", () => {
    beforeAll(async () => {
        await User.deleteMany({});
    })


    afterEach(async () => {
        await User.deleteMany({});
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it("shows that a user module exists", () => {
        expect(User).toBeDefined();
    })

    describe("get user", () => {
        it("Returns a user", async () => {
            const user = new User({
                fullname: "User one",
                username: "user1",
                email: "user1@test.com",
                password: "userpassword"
            });

            await user.save()

            const checkedUser = await User.findOne({ email: "user1@test.com" })
            const expected = "user1"
            const actual = checkedUser.username;
            expect(actual).toEqual(expected);
        });
    })

    describe("Save user", () => {
        it("save user to database", async () => {
            const newUser = new User({
                fullname: "User one",
                username: "user1",
                email: "user1@test.com",
                password: "userpassword"
            });

            const tobeSaved = await newUser.save();
            const expected = "user1";
            const actual = tobeSaved.username;
            expect(actual).toEqual(expected);
        })
    })
})