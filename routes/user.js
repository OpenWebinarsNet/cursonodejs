var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Importamos el modelo User
var User = require('../models/user.js');
var _ = require('lodash');


// Login view
router.get('/login', function(req, res) {
	res.render('login', {user: req.user} );
});

// Register view
router.get('/register', function(req, res) {
  // Le pasamos el user por si existiese
  
  res.render('register', {user: req.user});
});

// Configuramos passport

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    var userinfo = _.pick(user, 'username', 'role', 'email', '_id')
    done(err, userinfo);
  });
});


passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(username, password, done) {
    User.findByUsername(username, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'This email is not registered.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'This password is not correct.' });
      }
      console.log(user.password, password);
      console.log("User authed sucesfull");
      return done(null, user);
    });
  }
));

// Ruta que inicia el log
router.post('/auth', 
  passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: false }),
  function(req, res) {
    res.redirect('/');
  }
);

// Ruta que registra el usuario
router.post('/register', function(req, res) {
  var user = req.body;
  var validation_errors = []
  if (!user.username) validation_errors.push("El nombre de usuario no puede estar vacío");
  if (!user.password || !user.password2) validation_errors.push("La contraseña no puede estar vacía");
  if (user.password != user.password2) validation_errors.push("Las contraseñas no coinciden");
  if (!user.email) validation_errors.push("El email no puede estar vacío");
  if (validation_errors.length) return res.render('register', { validationErrors: validation_errors });

  User.create(user, function(err, result) {
    if (err) throw err;
    // Forzamos el login del usuario
    req.login(result, function(err) {
      if (err) throw err;
      res.redirect('/');
    })
  })
});



module.exports = router;
