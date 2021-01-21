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
        successRedirect: '/'
      })(req, res);
    } else {
      //else user wasn't created, then there is a user at that email so they can't sign up
        //redirect to /auth/signup
      console.log(`${user.name} has already been taken`);
      redirect('/auth/signup');
    }
  }).catch(err => {
      console.log(`There was an error`)
      console.log(err)
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
  successRedirect: '/'
}));

module.exports = router;
