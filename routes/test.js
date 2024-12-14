const express = require("express");
const router = express.Router();
const List = require("../models/list");
const User = require("../models/user");

router.get("/", async (req, res) => {
    try {
        const lists = await List.find({ user_email: req.session.user.email });
        res.render("test/index", { lists: lists });
    } catch {
        res.redirect("/test");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).send("Liste non trouvée");
        }

        const { key, userAnswer } = req.query;
        let result = null;

        if (key && userAnswer) {
            const item = list.content.find((item) => item.key === key);

            if (item) {
                result = {
                    isCorrect: item.value === userAnswer,
                    correctValue: item.value,
                };

                if (result.isCorrect) {
                    const user = await User.findOne({ email: req.session.user.email });
                    if (user) {
                        user.points += 1;
                        await user.save();
                    }
                }
            } else {
                result = { error: "Clé introuvable" };
            }
        }

        const randomItem = key ? list.content.find((item) => item.key === key) : list.content[Math.floor(Math.random() * list.content.length)];

        res.render("test/test", { list, randomItem, result });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

module.exports = router;