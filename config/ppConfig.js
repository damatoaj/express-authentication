//requirements
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// passport will serialize objects; converts the user to an identifier (id)
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

// passport deserializing an object; finds user in db via serialized identifier (id)
passport.deserializeUser((id, cb) => {
    db.user.findByPk(id).then(user => {
        cb(null, user);
    }).catch(err => {
        cb(err, null)
    });
});

//passport using its strategy to provide local auth. We need to give the LocalStrategy the following info:

//configuration: an object of data to identify our ath fields (username, password)

// callback function: a function that is called to log the user in. We can pass the email and password to a db query, and return the appropriate info in the callback (ogin(error, user) {do some stuff})
    //provide "null" if no error, or "false" if there is no user

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    //look for a user and cb accordingly
    db.user.findOne({
        where: {email}
    }).then(user => {
        //if there is no user AND the user  has an invalid password
        if (user && user.validPassword(password)) {
            console.log(`${user.email} is valid--------`)
            //no error, give the user
            cb(null, user);
        } else {
            //no error, false user
            console.log(`${user.email} did not log in`)
            cb(null, false);
        }
    }).catch(cb)
}));

//export the configured passport
module.exports = passport;

