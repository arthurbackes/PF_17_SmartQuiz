const express = require("express");
const router = express.Router();
const List = require("../models/list");

// Afficher toutes les listes
router.get("/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists/index", { lists });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

// Afficher une liste spécifique
router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).send("Liste introuvable");
        res.render("lists/listView", { list });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

// Ajouter une nouvelle liste
router.post("/", async (req, res) => {
    const list = new List({ name: req.body.name, user_email: req.session.user.email });
    try {
        const newList = await list.save();
        res.redirect(`/list`);
    } catch (error) {
        console.error(error);
        res.render("lists/index", { errorMessage: "Erreur lors de la création de la liste." });
    }
});

// Modifier une liste existante
router.put("/:id", async (req, res) => {
    let list;
    try {
        list = await List.findById(req.params.id);
        if (!list) throw new Error("Liste introuvable");

        list.name = req.body.name;
        list.content = req.body.keys.map((key, index) => ({
            key,
            value: req.body.values[index] || null,
        }));

        await list.save();
        res.redirect(`/list/${list._id}`);
    } catch (error) {
        console.error(error);
        if (list) {
            res.render("lists/edit", { list, errorMessage: "Erreur lors de la mise à jour de la liste." });
        } else {
            res.redirect("/list");
        }
    }
});

// Supprimer une liste
router.delete("/:id", async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id);
        res.redirect("/list");
    } catch (error) {
        console.error(error);
        res.redirect("/list");
    }
});

module.exports = router;