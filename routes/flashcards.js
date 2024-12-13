const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) => {
    try{
        const lists = await List.find({});
        res.render("flashcards/index", {lists: lists});
    } catch {
        res.redirect("/");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        res.render("flashcards/flashcardViews", {list: list});
    } catch {
        res.redirect("flashcard/")
    }
});


module.exports = router;