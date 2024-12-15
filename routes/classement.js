const express = require("express");
const router = express.Router();
const List = require("../models/list");
const Users = require("../models/user");
const classementCtrl = require("../controllers/classement")


router.get("/", classementCtrl.getClassement);

module.exports = router;