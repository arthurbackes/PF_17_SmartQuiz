const User = require("../models/user");
const bcrypt = require("bcrypt");

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
                    res.redirect("/");
                })
                .catch(err => {
                    {
                        const errorMail = true
                        res.render("user/signup", {errorMail})}
                });
        })
        .catch((err) => {
            res.status(500).json({ error: "Erreur serveur" });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                const errorLogIn = true
                return res.render("user/login", {errorLogIn});
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        const errorLogIn = true
                        return res.render("user/login", {errorLogIn});
                    }
                    req.session.user = {
                        email: user.email,
                    };
                    req.session.isAuthenticated = true;
                    res.redirect("/");
                })
                .catch((err) => res.status(500).json({ error: "Erreur lors du hashage du mot de passe, relancez la page" }));
        })
        .catch((err) => res.status(500).json({ error: "Erreur serveur" }));
};

exports.profile = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/user/login');
    }

    User.findOne({ email: req.session.user.email })
        .then((user) => {
            if (!user) {
                return res.redirect('/user/login');
            }
            res.render('user/profile', { user: user });
        })
        .catch((err) => {
            res.status(500).json({ error: "Erreur lors du chargement du profil" });
        });
};

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
}
