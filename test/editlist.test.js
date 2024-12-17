const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { connect, closeDatabase, clearDatabase } = require('./mongoConfig');
const List = require('../models/list');
const editListRouter = require('../routes/editlist'); // Route pour editlist
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

// Routes setup
app.use('/edit', editListRouter); // Route pour editlist
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
  console.log('Base de données temporaire nettoyée.');
});

// Test cases
describe('Test des routes de editlist', function() {
  it('GET /edit/:id - devrait retourner une liste spécifique', function(done) {
    const list = new List({ name: 'Nouvelle Liste', user_email: 'test@example.com' });
    list.save().then(savedList => {
      request(app)
        .get(`/edit/${savedList._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log('Erreur lors de la récupération de la liste:', err);
            return done(err);
          }
          console.log('Liste récupérée avec succès:', res.body);
          done();
        });
    });
  });

  it('POST /edit/:id/content - devrait ajouter du contenu à une liste', function(done) {
    const list = new List({ name: 'Nouvelle Liste', user_email: 'test@example.com' });
    list.save().then(savedList => {
      request(app)
        .post(`/edit/${savedList._id}/content`)
        .send({ key: 'Question', value: 'Réponse' })
        .expect(302)
        .expect('Location', `/edit/${savedList._id}/`)
        .end((err, res) => {
          if (err) {
            console.log('Erreur lors de l\'ajout de contenu:', err);
            return done(err);
          }
          console.log('Contenu ajouté avec succès:', res.body);
          done();
        });
    });
  });

  it('DELETE /edit/:id/deleteitem/:itemId - devrait supprimer un élément de la liste', function(done) {
    const list = new List({ name: 'Nouvelle Liste', user_email: 'test@example.com', content: [{ key: 'Question', value: 'Réponse' }] });
    list.save().then(savedList => {
      const itemId = savedList.content[0]._id; // Extrait l'ID de l'élément ajouté
      request(app)
        .delete(`/edit/${savedList._id}/deleteitem/${itemId}`)
        .expect(302)
        .expect('Location', `/edit/${savedList._id}/`)
        .end((err, res) => {
          if (err) {
            console.log('Erreur lors de la suppression de l\'élément:', err);
            return done(err);
          }
          console.log('Élément supprimé avec succès:', res.body);
          done();
        });
    });
  });

  it('DELETE /edit/:id/deletelist - devrait supprimer une liste', function(done) {
    const list = new List({ name: 'Nouvelle Liste', user_email: 'test@example.com' });
    list.save().then(savedList => {
      request(app)
        .delete(`/edit/${savedList._id}/deletelist`)
        .expect(302)
        .expect('Location', '/list')
        .end((err, res) => {
          if (err) {
            console.log('Erreur lors de la suppression de la liste:', err);
            return done(err);
          }
          console.log('Liste supprimée avec succès:', res.body);
          done();
        });
    });
  });
});