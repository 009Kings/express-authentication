const db = require('../models')
const express = require('express');
const router = express.Router();

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
  })
  .spread(function (user, created) {
    if (created) {
      console.log("shit done gone been created")
      res.redirect('/')
    } else {
      console.log("email already exists")
      res.redirect("/auth/signup")
    }
  })
  .catch(function (err) {
    console.log("Bad news bears! 🐻")
    console.error(err)
    res.redirect("/auth/signup")
  })
})

router.get('/login', function(req, res) {
  res.render('auth/login');
});

module.exports = router;
