'use strict'

const express       = require('express');
const bodyParser    = require('body-parser');

const mongoose      = require('mongoose');

const Product       = require('./models/product');
const Customer      = require('./models/customer');
const Order         = require('./models/order');

const app           = express();

const index         = require('./routes/index');
const product       = require('./routes/product');
const customer      = require('./routes/customer');
const order         = require('./routes/order');

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/node-str');

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', index);
app.use('/products', product);
app.use('/customers', customer);
app.use('/orders', order);

module.exports = app;