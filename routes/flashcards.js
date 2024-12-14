const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) => {
    try {
        const lists = await List.find({ user_email: req.session.user.email });
        res.render("flashcards/index", { lists: lists });
    } catch (error) {
        console.error("Erreur lors de la récupération des listes : ", error);
        res.redirect("/");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) throw new Error("Liste introuvable");
        res.render("flashcards/flashcardViews", { list: list });
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste : ", error);
        res.redirect("/flashcard");
    }
});

module.exports = router;
