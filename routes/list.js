const express = require("express");
const router = express.Router();
const List = require("../models/list");

// Afficher toutes les listes
router.get("/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists/index", { lists: lists });
    } catch {
        res.redirect("/");
    }
});

// Afficher le formulaire pour créer une nouvelle liste
router.get("/new", (req, res) => {
    res.render("lists/new", { list: new List() });
});

// Créer une nouvelle liste
router.post("/", async (req, res) => {
    const list = new List({
        name: req.body.name,
    });
    try {
        const newList = await list.save();
        res.redirect("/list");
    } catch {
        res.render("lists/new", {
            list: list,
            errorMessage: "Error creating List",
        });
    }
});

// Afficher les détails d'une liste
router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (list == null) {
            return res.redirect("/list");
        }
        res.render("lists/show", { list: list });
    } catch {
        res.redirect("/list");
    }
});

// Supprimer une liste
router.post("/:id/delete", async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id);
        res.redirect("/list");
    } catch {
        res.redirect("/list");
    }
});

module.exports = router;