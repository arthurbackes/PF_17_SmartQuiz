const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) => {
    try {
        const lists = await List.find({});
        res.render("lists/all-lists", { lists: lists});
    } catch {
        res.redirect("/");
    }
})
module.exports = router;