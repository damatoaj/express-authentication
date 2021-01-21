require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/ppConfig')
const app = express();
const isLoggedIn = require('./middleware/isLoggedIn')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(helmet());

app.use(session({
  secret:  process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

//init passport config MUST HAPPEN AFTER SESSION CONFIG
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//write custom middleware to access the user on every response
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', (req, res) => {
  req.session.testVar = 'what up';
  res.render('index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  console.log(req.session.testVar);
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));

var server = app.listen(process.env.PORT || 3000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 3000}🎧`));

module.exports = server;
