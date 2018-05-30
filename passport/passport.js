'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    console.log('serialize')
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
            'email': email
        },
        (err, user) => { 
            if (err) {
                return done(err);
            }

            if (user) {
                console.log('Already exists');
                return done(null, false, req.flash('Already exists'));
            }

            const newUser = new User();
            console.log(req.body.username);
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);

            // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+ err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
    );
}));

// passport/login.js
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) { 
    // check in mongo if a user with email exists or not
    User.findOne({ 'email' :  email }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // email does not exist, log error & redirect back
        if (!user || !user.validUserpassword(password)){
          console.log('User Not Found with email '+ email);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
      
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));
