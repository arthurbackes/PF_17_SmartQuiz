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
                .catch(err => res.status(400).json({ error: "Email utilisé" }));
        })
        .catch((err) => {
            res.status(500).json({ error: "Erreur serveur" });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
                    }
                    req.session.user = {
                        email: user.email,
                    };
                    req.session.isAuthenticated = true;
                    res.redirect("/");
                })
                .catch((err) => res.status(500).json({ error: err }));
        })
        .catch((err) => res.status(500).json({ error: err }));
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
