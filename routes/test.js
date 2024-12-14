const express = require('express');
const router = express.Router();
const List = require('../models/list');

// Afficher la liste des tests
router.get('/', async (req, res) => {
    try {
        const lists = await List.find({});
        res.render('test/index', { lists });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Afficher le test d'une liste spécifique
router.get('/:id', async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).send("Liste introuvable");
        res.render('test/test', { list, questions: list.content });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

router.post('/submit', async (req, res) => {
    const { answers, listId } = req.body;

    console.log('Réponses reçues:', req.body);  // Log complet de req.body pour tout voir
    console.log('Réponses utilisateur:', answers); // Log des réponses

    try {
        const list = await List.findById(listId);
        if (!list) return res.status(404).send("Liste introuvable");

        const questions = list.content || [];
        let score = 0;

        // Si les réponses sont mal formatées, retour avec message d'erreur
        if (!answers || !Array.isArray(answers)) {
            return res.render('test/testResults', {
                score,
                totalQuestions: questions.length,
                isPassed: false,
                errorMessage: "Veuillez répondre à toutes les questions.",
            });
        }

        // Vérification des réponses
        questions.forEach((question, index) => {
            const userAnswer = answers[index]?.trim().toLowerCase();  // Réponse de l'utilisateur
            const correctAnswer = question.value?.trim().toLowerCase();  // Réponse correcte

            if (userAnswer === correctAnswer) {
                score++;
            }
        });

        // Affichage des résultats
        res.render('test/testResults', {
            score,
            totalQuestions: questions.length,
            isPassed: score === questions.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});


module.exports = router;