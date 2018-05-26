'use strict';

module.exports = function(_, passport, userValidation) {
  return {
    setRouting: function(router) {
      router.get('/', this.indexPage);
      router.get('/signup', this.signupPage);
      router.get('/home', this.homePage)

      router.post('/signup', userValidation.signupValidation, this.userAuthenticate)

    },
    indexPage: function(req, res) {
      return res.render('index');
    },

    signupPage: function(req, res) {
      const errors = req.flash('error');
      return res.render('signup', { title: 'fbk login', messages: errors, hasErrors: errors.length > 0 });
    },
    userAuthenticate: passport.authenticate('local.signup', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true
    }),
    homePage: function(req, res) {
      return res.render('home')
    }
  }
};
