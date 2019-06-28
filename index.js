require('dotenv').config();
const ejsLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('./config/passportConfig')
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);

// Make a session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Starts the flash middleware
app.use(flash())

// Link passport to the express session (MUST BE BELOW SESSION)
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req,res, next){
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
// app.use('/locked', isLoggedIn, require('./controllers/lockedController'))

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
