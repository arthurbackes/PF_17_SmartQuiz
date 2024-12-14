const express = require("express");
const router = express.Router();
const indexCtrl = require("../controllers/index");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/classement", indexCtrl.getClassement);

module.exports = router;
