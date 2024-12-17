const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { connect, closeDatabase, clearDatabase } = require('./mongoConfig');
const List = require('../models/list');
const listsRouter = require('../routes/list');
const userRouter = require('../routes/user');

const app = express();

// Définir le moteur de vue et le chemin des vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Mock des données de session pour les tests
app.use((req, res, next) => {
  req.session.isAuthenticated = true; // Authentifié pour les tests
  req.session.user = { email: 'test@example.com' };
  res.locals.isAuthenticated = true;
  next();
});

// Définir la fonction middleware isAuthenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next(); // Utilisateur connecté, continuer.
  }
  res.redirect('/user/login'); // Redirige vers la page de connexion.
}

// Routes setup
app.use('/list', isAuthenticated, listsRouter);
app.use('/user', userRouter);

// Connexion à MongoDB pour les tests
before(async function() {
  await connect();
  console.log('Connexion à MongoDB réussie.');
});

after(async function() {
  await closeDatabase();
  console.log('Déconnexion de MongoDB réussie.');
});

afterEach(async function() {
  await clearDatabase();
});

// Test cases
describe('Test des routes de list', function() {
  it('POST /list - devrait créer une nouvelle liste quand authentifié', function(done) {
    request(app)
      .post('/list')
      .send({ name: 'Nouvelle Liste', user_email: 'test@example.com', content: [{ key: 'Question', value: 'Réponse' }] })
      .expect('Location', '/list')  // Vérifie la redirection
      .expect(302, done);  // Vérifie le code de statut 302 Found
  });

  it('DELETE /list/:id - devrait supprimer une liste quand authentifié', function(done) {
    request(app)
      .post('/list')
      .send({ name: 'Nouvelle Liste', user_email: 'test@example.com', content: [{ key: 'Question', value: 'Réponse' }] })
      .then(res => {
        const listId = res.header['location'].split('/').pop(); // Extrait l'ID de la liste créée
        request(app)
          .delete(`/list/${listId}`)
          .expect('Location', '/list')  // Vérifie la redirection
          .expect(302, done);  // Vérifie le code de statut 302 Found
      });
  });
});