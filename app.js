const createError = require('http-errors');
const mongoose = require('./Configs/dbConnect')
const express = require('express');
const session=require('express-session')
const config=require('./Configs/config')
let path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors=require('cors')
let usersRouter = require('./routes/users');
let adminRouter = require('./routes/admin');
const helper=require('./public/helpers/helper')
const rateLimit = require('express-rate-limit');

const app = express();
mongoose()




const hbs=require('hbs');
hbs.registerPartials(__dirname + '/views');
const nocache = require('nocache');

//config rate limiter
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
//   max: 100, 
//   message: 'Too many requests from this IP, please try again later.'
// });

// app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cors());


app.use(nocache())
app.use(logger('dev'));
app.use(express.json());
app.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:true}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


// app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/', usersRouter);
app.use('/:id', (req, res) => res.render('users/error'))
// app.use('/',categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) { 
  next(createError(404));

});

app.use(async (req, res, next) => {
  try {
    await someAsyncMiddlewareOperation();
    next();
  } catch (err) {
    next(err);  // pass the error to the error handling middleware
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
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
//PORT SETTING
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});

