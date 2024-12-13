const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            user.save()
                .then((user) => {
                    res.status(201).json({ message : "User successfully saved" });
                })
                .catch(err => res.status(400).json({error: err}));

        })
        .catch((err) => {
            res.status(500).json({error : err})
        })
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user === null){
                res.status(401).json({message: "User or password incorrect"});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid){
                            res.status(401).json({message: "User or password incorrect"});
                        } else {
                            res.status(200).json({
                                message: "User connected"
                            });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({error: err});
                    })
            }
        })
        .catch((err) => {
            res.status(500).json({error : err});
        })
};