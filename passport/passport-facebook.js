'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secret');

passport.serializeUser((user, done) => {
    console.log('serialize')
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// ===============================================
// FACEBOOK ======================================
// ===============================================
passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: secret.facebookAuth.clientID,
        clientSecret: secret.facebookAuth.clientSecret,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['email', 'displayName', 'photos'],
        passReqToCallback: true

    },

    // facebook will send back the token and profile
    function (req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {

            // find the user in the database based on their facebook id
            User.findOne({
                'facebook': profile.id
            }, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook = profile.id; // set the users facebook id                   
                    newUser.fullName = profile.displayName // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.userImage = 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
                    newUser.fbToken.push({
                        token: token
                    })
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));