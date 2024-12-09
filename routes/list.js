const express = require("express");
const router = express.Router();
const List = require("../models/list");



router.get("/", async(req, res) => {
    try{
        const lists = await List.find({});
        res.render("lists/index", {lists: lists});
    } catch {
        res.redirect("/");
    }
    
})

router.get("/new", (req, res) => {
    res.render("lists/new", { list: new List()});
})

router.post("/",  async (req, res) => {
    const list = new List({
        name: req.body.name
    })
    try {
        const newList = await list.save();
        // res.redirect(`author/${newAuthor.id}`)
        res.redirect("list");
    } catch {
        res.render("lists/new", {
            list: list,
            errorMessage: "Error creating List"
        });
    }
})





module.exports = router;