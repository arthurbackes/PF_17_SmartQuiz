const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists/all-lists", { lists: lists, results: false});
    } catch {
        res.redirect("/");
    }
})

router.post("/search", async (req, res) => {
    const nameList = req.body.name;
    try {
        const lists = await List.find({});
        const results = await List.find({name: { $regex: `^${nameList}`, $options: 'i' }});
        console.log(results, req.body.name)
        res.render('lists/all-lists', { lists, results }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur lors de la recherche');
    }
})
module.exports = router;