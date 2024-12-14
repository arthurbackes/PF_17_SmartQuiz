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
                    req.session.user = {
                        email: user.email,
                    };
                    req.session.isAuthenticated = true;
                    res.status(201).json({ message : "User successfully saved and session created" });
                    res.redirect("/");
                })
                .catch(err => res.status(400).json({error: "Email used"}));

        })
        .catch((err) => {
            res.status(500).json({error : "Error with server"})
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
                            req.session.user = {
                                email: user.email,
                            };
                            req.session.isAuthenticated = true;
                            res.redirect("/");
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
