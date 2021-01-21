const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

//mounted at /auth

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// sign up POST route
router.post('/signup', (req,res) => {
  // findOrCreate a new user based email
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {     //findOrCreate returns a promise with (instance, created)
    // if (the user was created)
      //redirect to homepage or profile
    if (created) {
      console.log(`${user.name} was created`);
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Welcome to this app'
      })(req, res);
    } else {
      //else user wasn't created, then there is a user at that email so they can't sign up
        //redirect to /auth/signup
      console.log(`${user.name} has already been taken`);
      req.flash('error', `email already exists`)
      redirect('/auth/signup');
    }
  }).catch(err => {
      console.log(`There was an error`)
      console.log(err)
      req.flash('error', err.message);
      res.redirect('/auth/signup')
      //if there is an error, it's probably a validation error so return to /auth/signup
  })
  
});


router.get('/login', (req, res) => {
  res.render('auth/login');
});

//make passport do the logins for us
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  successRedirect: '/',
  failureFlash: 'Invalid Login Credentials',
  successFlash: 'Successful Login'
}));

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Thanks! See you soon')
  res.redirect('/');
});

module.exports = router;
