require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

const session = require('express-session');

const indexRouter = require("./routes/index");
const listsRouter = require("./routes/list");
const editListRouter = require("./routes/editList");
const flashcardRouter = require("./routes/flashcards");
const testRouter = require("./routes/test");
const userRouter = require("./routes/user");
const allListsRouter = require("./routes/all-lists");
const classementRouter = require("./routes/classement");

const app = express();

app.use(methodOverride("_method"));

//session

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    }, //cookie de 24h
}));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(express.json());

//itiliser isAuthenticated dans les fichiers .ejs (local permet de stock valeur dans express pour utiliser dans le render)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next()
});

function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next(); // Utilisateur connecté, continue.
    }
    res.redirect('/user/login'); // Redirige vers la page de connexion.
}



// Modification ici pour analyser les données de formulaire correctement
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Changer extended à true
app.use(methodOverride('_method'));
app.use(express.json());

// Routes
app.use("/", indexRouter);
app.use("/list", isAuthenticated, listsRouter);
app.use("/edit", isAuthenticated, editListRouter);
app.use("/flashcard", isAuthenticated, flashcardRouter);
app.use("/test", isAuthenticated, testRouter);
app.use("/user", userRouter);
app.use("/all-lists", allListsRouter);
app.use("/classement", classementRouter);
app.use((req, res, next) => {
    if (req.session.isAuthenticated || req.path.startsWith('/user')) {
        return next(); // Accès autorisé si connecté ou si sur une route publique.
    }
    res.redirect('/user/login'); // Redirige si non connecté.
});





// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Démarrage du serveur
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});