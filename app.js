var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const flash = require("express-flash");
var session = require("express-session");
const MemoryStore = require('memorystore')(session);
const cors = require('cors');

var fotoRouter = require("./routes/foto");
var userRouter = require("./routes/user");
var lokasiRouter = require("./routes/lokasi");

var app = express();


app.use('/images', express.static('public/images'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS should be applied before routes
app.use(cors());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 }, // Session lasts for 1 day
  store: new MemoryStore({
    checkPeriod: 86400000 // Check for expired sessions every 24 hours
  })
}));

app.use(flash());
app.use("/foto", fotoRouter);
app.use("/user", userRouter);
app.use("/lokasi", lokasiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
