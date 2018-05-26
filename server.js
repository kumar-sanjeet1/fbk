const express = require('express');
const bodyParse = require('body-parser');
const http = require('http');
const ejs = require('ejs');
const container = require('./container');
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

container.resolve(function(users, _) {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/fbk');

  const app = SetupExpress();

  function SetupExpress() {
    const app = express();
    const server = http.createServer(app);

    server.listen(process.env.PORT || 3000, function() {
      console.log('Listening on port 3000');
    });
    ConfigureExpress(app);

    //Setup router
    const router = require('express-promise-router')();
    users.setRouting(router);

    app.use(router);
  }

  function ConfigureExpress(app) {
    require('./passport/passport');

    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParse.json());
    app.use(bodyParse.urlencoded({ extended: true }));

    app.use(validator());
    app.use(
      session({
        secret: 'secretkey',
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({ mongooseConnection: mongoose.connection })
      })
    );
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.locals._ = _;
  }
});
