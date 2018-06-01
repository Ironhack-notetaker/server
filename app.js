require('dotenv').config();

const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const express        = require('express');
const favicon        = require('serve-favicon');
const hbs            = require('hbs');
const mongoose       = require('mongoose');
const logger         = require('morgan');
const path           = require('path');
const User           = require('./models/user');
const session        = require("express-session");
const bcrypt         = require("bcryptjs");
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const flash          = require("connect-flash");
const cors           = require('cors');

mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


console.log("======================================", process.env.MONGODB_URI);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Note taker'; //Change after name is decided
app.use(flash());

//Passport config area
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "our-passport-local-strategy-app"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors
  ({
    credentials: true,                 // allow other domains to send cookies
    origin: ["http://localhost:4200"]  // these are the domains that are allowed
  })
);

const index = require('./routes/index');
app.use('/', index);
const userApi = require('./routes/auth-routes')
app.use('/api', userApi);
const noteApi = require('./routes/notes-routes')
app.use('/n', noteApi);
const teamApi = require('./routes/team-routes')
app.use('/t', teamApi);

app.use((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});

module.exports = app;