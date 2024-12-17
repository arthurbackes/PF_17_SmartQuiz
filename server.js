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

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }
}));

function isAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/user/login');
  }
}


// Middleware pour passer `isAuthenticated` à toutes les vues
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

// Middleware pour les sessions et les JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/",  indexRouter);
app.use("/list",isAuthenticated, listsRouter);
app.use("/edit", editListRouter);
app.use("/flashcard", isAuthenticated, flashcardRouter);
app.use("/test", isAuthenticated, testRouter);
app.use("/user", userRouter);
app.use("/all-lists", isAuthenticated, allListsRouter);
app.use("/classement", classementRouter);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Démarrer le serveur
const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Exporter l'application pour les tests
module.exports = { app, server };