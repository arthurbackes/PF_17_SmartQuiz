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

router.get("/:id", async (req, res) => {
    try {
        // Récupérer la liste spécifique par son ID
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        // Passer la liste à la vue
        res.render("lists/listView.ejs", { list });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});


router.post("/",  async (req, res) => {
    const list = new List({
        name: req.body.name
    })
    try {
        const newList = await list.save();
        // res.redirect(`author/${newAuthor.id}`)
        res.redirect("list");
    } catch {
        res.render("lists/index", {
            list: list,
            errorMessage: "Error creating List"
        });
    }
})





module.exports = router;