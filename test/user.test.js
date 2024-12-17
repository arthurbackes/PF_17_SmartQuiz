const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const { connect, closeDatabase, clearDatabase } = require('./mongoConfig');
const User = require('../models/user'); // Assurez-vous que le modèle User est correctement importé
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
  req.session.isAuthenticated = false;
  req.session.user = { email: 'test@example.com' };
  res.locals.isAuthenticated = false;
  next();
});

// Routes setup
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
describe('Test des routes de user', function() {
  // Test d'inscription d'un utilisateur
  it('POST /user/signup - devrait enregistrer un nouvel utilisateur', function(done) {
    request(app)
      .post('/user/signup')
      .send({ username: 'newuser', email: 'new@example.com', password: 'newpassword' })
      .expect(302)
      .expect('Location', '/')
      .end((err, res) => {
        if (err) {
          console.log('Erreur lors de l\'inscription:', err);
          return done(err);
        }
        console.log('Utilisateur inscrit avec succès:', res.body);
        done();
      });
  });

  // Test de connexion d'un utilisateur
  it('POST /user/login - devrait authentifier l\'utilisateur inscrit', function(done) {
    // Créer l'utilisateur avant de tester la connexion
    bcrypt.hash('newpassword', 10, async (err, hashedPassword) => {
      if (err) return done(err);
      await User.create({ username: 'newuser', email: 'new@example.com', password: hashedPassword });
      request(app)
        .post('/user/login')
        .send({ email: 'new@example.com', password: 'newpassword' })
        .expect(302)
        .expect('Location', '/')
        .end((err, res) => {
          if (err) {
            console.log('Erreur lors de la tentative de connexion:', err);
            return done(err);
          }
          console.log('Session après authentification:', res.headers['set-cookie']);
          done();
        });
    });
  });

  // Test de déconnexion de l'utilisateur
  it('GET /user/logout - devrait déconnecter l\'utilisateur', function(done) {
    request(app)
      .get('/user/logout')
      .expect(302)
      .expect('Location', '/')
      .end((err, res) => {
        if (err) {
          console.log('Erreur lors de la tentative de déconnexion:', err);
          return done(err);
        }
        console.log('Utilisateur déconnecté avec succès');
        done();
      });
  });
});