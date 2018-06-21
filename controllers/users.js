'use strict';

module.exports = function(_, passport, userValidation) {
  return {
    setRouting: function(router) {
      router.get('/', this.indexPage);
      router.get('/signup', this.signupPage);
      router.get('/auth/facebook', this.getFacebookSignup)
      router.get('/auth/facebook/callback', this.facebookSignup)

      router.post('/', this.signInAuthentication, this.indexPage);
      router.post('/signup', userValidation.signupValidation, this.signUpAuthenticate)

    },
    indexPage: function(req, res) {
      return res.render('index');
    },

    signupPage: function(req, res) {
      const errors = req.flash('error');
      return res.render('signup', { title: 'fbk login', messages: errors, hasErrors: errors.length > 0 });
    },
    signUpAuthenticate: passport.authenticate('local.signup', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true
    }),
    signInAuthentication: passport.authenticate('local.signin', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true
    }),
    
    getFacebookSignup: passport.authenticate('facebook', {
      scope: 'email'
    }),

    facebookSignup: passport.authenticate('facebook', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true
    })
  }
};
