const reserve = require('../routes/reserves');
const classSport = require('../routes/classSports');
const signup = require('../routes/signup');
const signin = require('../routes/signin');
const users = require('../routes/users');
const express = require('express');

module.exports = function (app) {
    app.use(express.json());
    app.use('/user', users);
    app.use('/signin', signin);
    app.use('/signup', signup);
    app.use('/class', classSport);
    app.use('/reserve', reserve);
}