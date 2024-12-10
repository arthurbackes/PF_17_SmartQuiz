const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/", async (req, res) =>{
    try {
        const lists = await List.find({});
        res.render("test/index", {lists: lists})
    } catch {
        res.redirect("/test")
    }
});

router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        // Si une clé et une réponse sont fournies dans les requêtes, effectuez la vérification
        const { key, userAnswer } = req.query; // On récupère les valeurs depuis la requête
        let result = null;

        if (key && userAnswer) {
            const item = list.content.find((item) => item.key === key);

            if (item) {
                result = {
                    isCorrect: item.value === userAnswer,
                    correctValue: item.value,
                };
            } else {
                result = { error: "Clé introuvable" };
            }
        }

        // Sélectionnez une clé aléatoire s'il n'y a pas encore de vérification
        const randomItem = key ? list.content.find((item) => item.key === key) : list.content[Math.floor(Math.random() * list.content.length)];

        res.render("test/test", { list, randomItem, result });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});



// Vérifier la réponse soumise par l'utilisateur

module.exports = router;