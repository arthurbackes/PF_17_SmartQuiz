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

router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        res.render("lists/list", { list: list});
    } catch {
        res.render("/list")
    }
});


router.get("/:id/edit", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        res.render("lists/edit", { list });
    } catch {
        res.redirect("/list");
    }
});

router.put("/:id", async (req, res) => {
    let list;
    try {
        // Trouver la liste par ID
        list = await List.findById(req.params.id);
        if (!list) {
            throw new Error("Liste non trouvée");
        }

        // Mettre à jour le nom de la liste
        list.name = req.body.name;

        // Transformer les clés et valeurs du formulaire en tableau d'objets
        const keys = req.body.keys || [];
        const values = req.body.values || [];
        if (!Array.isArray(keys) || !Array.isArray(values)) {
            throw new Error("Les clés et valeurs doivent être des tableaux.");
        }

        // Mettre à jour le contenu
        list.content = keys.map((key, index) => {
            return {
                key: key,
                value: values[index] || null,
            };
        });

        // Sauvegarder les modifications
        await list.save();
        res.redirect(`/list/${list._id}`);
    } catch (error) {
        console.error(error);
        if (!list) {
            res.redirect("/list");
        } else {
            res.render("lists/edit", {
                list,
                errorMessage: "Erreur lors de la mise à jour de la liste.",
            });
        }
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
        res.render("lists/new", {
            list: list,
            errorMessage: "Error creating List"
        });
    }
})





module.exports = router;