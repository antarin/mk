const passport = require('passport');
let User = require('../models/user');
let ls = require('passport-local').Strategy;
const mongoose = require('mongoose');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new ls({
  usernameField: 'username',
  passowrdField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  req.checkBody('name', 'Kérlek add meg a neved').notEmpty();
  req.checkBody('username', 'Meg kell addnod a felhasználó neved').notEmpty();
  req.checkBody('email', 'Helytelen e-mail cím!').notEmpty().isEmail();
  req.checkBody('password', 'Helytelen jelszó! Minimum 6 karakter kell, hogy legyen.').notEmpty().isLength({min:6});
  req.checkBody('password2', 'A két jelszó nem egyezik!').equals(req.body.password);
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({$or: [{'username':username}, {'email': req.body.email} ]}, function(err, user) {
    console.log(req.body.email);
    if (err) {
      return done(err);
    }
    if (user.username === req.body.username) {
      return done(null, false, {message: 'A fekhasználónév  már foglalt!'});
    }
    if (user.email === req.body.email) {
      return done(null, false, {message: 'Az e-mail cím már foglalt!'});
    }
    let newUser = new User();
    newUser.name = req.body.name;
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) {
        return done(err);
      } else {
        return done(null, newUser);
      }
    });
  });
}));

passport.use('local.signin', new ls({
  usernameField: 'username',
  passowrdField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  req.checkBody('username', 'Helytelen felhasználó név vagy e-mail!').notEmpty();
  req.checkBody('password', 'Helytelen jelszó!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({$or: [{'username':username}, {'email': req.body.email} ]}, function(err, user) {
    console.log(req.body.email);
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Nem találtam ilyen felhasználót!'});
    }
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Helytelen jelszó'});
    }
    return done(null, user);
  });
}));
