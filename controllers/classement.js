const User = require("../models/user");

exports.getClassement = (req, res) => {
    User.find().sort({ points: -1 })
        .then(users => {
            res.render("classement", { users });
        })
        .catch(err => {
            res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
        });
};
