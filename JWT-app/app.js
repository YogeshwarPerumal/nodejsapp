const express = require('express');
const app = express();
const userRoutes = require('./api/routes/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yogeshwarperumal:yoyoyo@jwt-app.418sh.mongodb.net/jwt-app?retryWrites=true&w=majority');

app.use('/user',userRoutes);

module.exports = app;