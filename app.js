const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const validator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const Mongostore = require('connect-mongo')(session);


//Set routes
const index = require('./routes/index');
const blog = require('./routes/blogs');
const user = require('./routes/users');


const app = express();


//Connecting to the database
const promise = mongoose.connect('mongodb://article:article@ds161022.mlab.com:61022/article', {
  useMongoClient: true,
});

//Cheking connection
mongoose.connection.once('open', function() {
  console.log('Server connected to MongoDb');
}).on('error', console.error.bind(console, 'connection error:'));;

//Passport configs
require('./config/passport');

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'main_layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'atitkoskulcs',
  resave: false,
  saveUninitialized: false,
  store: new Mongostore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180*60*100}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', user);
app.use('/blog', blog);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
