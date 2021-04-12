var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
var cors = require('cors')
var indexRouter = require('./routes/index');
var routes = require('./routes/routes');
require('dotenv').config();



var app = express();
app.use(cors())




const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file ========= ",file)
      cb(null, 'images');
  },
  filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('artImage'))
app.use(express.static('public'))

app.use("/images",express.static('images'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

Mongoose.connect("mongodb://localhost:27017/nft",{ useNewUrlParser: true ,useUnifiedTopology: true }).then((result)=>{
  if (result){
    console.log('db connected')
  }else{
    console.log('db not connect')
  }
})

module.exports = app;
