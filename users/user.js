const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("./userModel");
const { validateSignupInput, validateLoginInput } = require('./validate_user');
const { secret } = require('../helpers/config')



router.post("/signup", (req, res) => {
    const { errors, isValid } = validateSignupInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(422).json({ error: "Email already exist" });
        } else {
            const newUser = new User({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(reguser => {
                        if (reguser) {
                            res.status(200).json({ error: false, message: 'signup is successful',user: reguser })
                        }
                    }).catch(err => res.status(400).json({ error: err }))
                });
            });
        }
    }).catch(err => {
        console.log('ERR: ', err.message)
        return res.status(400).json({ error: true, message: "Error creating user" })
    })

})

router.post("/login", (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {

                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                email: user.email,
                                full_name: user.full_name,
                            }
                            jwt.sign(payload, secret, (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token,
                                    user: payload
                                })

                            });

                        } else {
                            return res.status(400).json({ error: true, message: 'Email or Password is incorrect"' });
                        }
                    })
                    .catch(err => console.log(err));

            } else {
                errors.email = "User not found";

                return res.status(400).json(errors)
            }
        })
        .catch(err => res.status(400).json(err))
});


module.exports = router