'use strict'

module.exports = function() {
    return  {
        signupValidation: function(req, res, next) {
            req.checkBody('username', 'Username is require').notEmpty();
            req.checkBody('email', 'email is require').notEmpty();
            req.checkBody('password', 'password is require').notEmpty();
        
            req.getValidationResult()
            .then((result) => {
                const errors = result.array();
                const messages = [];
                errors.forEach(err => {
                  message.push(err.msg)
                });

                req.flash('error', messages)
                res.redirect('/signup')
            })
            .catch((err) => {
                return next();
            })
        }
    }

}