const express = require("express");
const router = express.Router();
const List = require("../models/list");

router.get("/:id", async (req, res) => {
    try {
        // Récupérer la liste spécifique par son ID
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        // Passer la liste à la vue
        res.render("listEditView/listEditView.ejs", { list });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.post("/:id/content", async (req, res) => {
    try {
        // Récupérer la liste par ID
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        // Récupérer la clé et la valeur depuis le formulaire
        const { key, value } = req.body;

        // Valider que la clé est présente
        if (!key) {
            return res.status(400).send("La clé est obligatoire.");
        }

        // Ajouter la nouvelle entrée dans le tableau content
        list.content.push({ key, value: value || "" });

        // Sauvegarder la liste mise à jour
        await list.save();

        // Rediriger vers la page de la liste
        res.redirect(`/edit/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur.");
    }
});

router.delete("/:id/deleteitem/:itemId", async (req, res) => {
    try {
        const listId = req.params.id; // ID de la liste
        const itemId = req.params.itemId; // ID de l'élément à supprimer

        // Récupérer la liste
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        // Filtrer le contenu pour retirer l'élément avec l'ID donné
        list.content = list.content.filter((item) => item._id.toString() !== itemId);

        // Sauvegarder la liste mise à jour
        await list.save();

        // Redirection après suppression
        res.redirect(`/edit/${listId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});




module.exports = router;