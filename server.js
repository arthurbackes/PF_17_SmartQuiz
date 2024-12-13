require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');



const indexRouter = require("./routes/index");
const listsRouter = require("./routes/list");
const editListRouter = require("./routes/editList");
const flashcardRouter = require("./routes/flashcards");
const testRouter = require("./routes/test");
const userRouter = require("./routes/user");

const app = express();
app.use(methodOverride("_method"));


app.set("view engine", "ejs")
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride('_method'));


// Middleware
app.use(express.json());



app.use("/", indexRouter);
app.use("/list", listsRouter);
app.use("/edit", editListRouter);
app.use("/flashcard", flashcardRouter);
app.use("/test", testRouter);
app.use("/user", userRouter);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));


// Démarrage du serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
