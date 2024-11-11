var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileupload = require("express-fileupload");

var phonebooksRouter = require('./routes/phonebooks');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload({ createParentPath: true, safeFileNames: true, preserveExtension: true }));

app.use('/api/phonebooks', phonebooksRouter);

module.exports = app;
