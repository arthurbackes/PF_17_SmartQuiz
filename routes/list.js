const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists/index", { lists: lists, title: "Vos Listes" });
    } catch (err) {
        console.error("Erreur lors de la récupération des listes :", err);
        res.redirect("/");
    }
});

router.get("/new", (req, res) => {
    res.render("lists/new", {
        list: new List(),
        errorMessage: "",
        title: "Créer une Nouvelle Liste",
    });
});



router.post("/", async (req, res) => {
    const list = new List({
        name: req.body.name,
        content: req.body.content || [], // Ajouter le contenu si fourni
    });

    try {
        const newList = await list.save();
        res.redirect("/lists");
    } catch (err) {
        console.error("Erreur lors de la création de la liste :", err);
        res.render("lists/new", {
            list: list,
            errorMessage: "Erreur lors de la création de la liste. Veuillez vérifier les informations et réessayer.",
        });
    }
});


module.exports = router;
