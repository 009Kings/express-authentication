const db = require('../models')
const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig')
const flash = require('connect-flash')

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      // replace the contents of this if statement with the code below
      console.log(user)
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Congrats on signing up! You\'re here forever now'
      })(req, res);
    } else {
      console.log('Email already exists');
      req.flash('error', 'Email already exists!🔪')
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log('An error occurred: ', error.message);
    req.flash('error', error.message)
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  successFlash: 'You are now logged in! 🎉',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid login details 🔪'
}));

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  req.flash('success', 'You have logged out 👋')
  res.redirect('/');
});

module.exports = router;
