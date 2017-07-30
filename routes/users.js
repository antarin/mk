const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

let User = require('../models/user');
let csrfP = csrf();
router.use(csrfP);


router.get('/profile', isLooggedIn, function(req, res, next) {
  res.render('users/profile', {title: 'Profil', foot: true});
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/test', isLooggedIn, function(req, res, next) {
  res.render('users/test', {title: 'Profil', csrfToken: req.csrfToken()});
});

router.post('/test', isLooggedIn, function(req, res, next) {
  if (req.body.type) {
    console.log('Be');
  }
  console.log();
  res.render('users/test', {title: 'Profil'});
});

router.use('/', notLooggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
  let messages = req.flash('error');
  res.render('users/signup', {
    title: 'Regisztráció',
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
    foot: true });
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next) {
  let messages = req.flash('error');
  res.render('users/signin', {
    title: 'Belépés',
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
    foot: true });
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));





function isLooggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLooggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
