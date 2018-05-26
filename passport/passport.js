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

// passport.use('local.signup', new LocalStrategy({
//     passReqToCallback: true
// }, (req, email, password, done) => {
//     User.findOne({
//             'email': email
//         },
//         (err, user) => { 
//             if (err) {
//                 return done(err);
//             }

//             if (user) {
//                 console.log('Already exists');
//                 return done(null, false, req.flash('Already exists'));
//             }

//             const newUser = new User();
//             console.log(req.body.username);
//             newUser.username = req.body.username;
//             newUser.email = req.body.email;
//             newUser.password = newUser.encryptPassword(req.body.password);

//             // save the user
//           newUser.save(function(err) {
//             if (err){
//               console.log('Error in Saving user: '+ err);  
//               throw err;  
//             }
//             console.log('User Registration succesful');    
//             return done(null, newUser);
//           });
//         }
//     );
// }));

passport.use('local.signup', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, email, password, done) {
        // find a user in Mongo with provided username
        User.findOne({
            'email': email
        }, function (err, user) {
            // In case of any error return
            if (err) {
                console.log('Error in SignUp: ' + err);
                return done(err);
            }
            // already exists
            if (user) {
                console.log('User already exists');
                return done(null, false,
                    req.flash('message', 'User Already Exists'));
            } else {
                // if there is no user with that email
                // create the user
                const newUser = new User();
                console.log(req.body.username);
                newUser.username = req.body.username;
                newUser.email = req.body.email;
                newUser.password = newUser.encryptPassword(req.body.password);

                // save the user
                newUser.save(function (err) {
                    if (err) {
                        console.log('Error in Saving user: ' + err);
                        throw err;
                    }
                    console.log('User Registration succesful');
                    return done(null, newUser);
                });
            }
        });

    }));