'use strict';

const mongoose  = require('mongoose');
const Customer   = mongoose.model('Customer');

exports.get = async () => {
    let res = await Customer.find({});
    return res;
}

exports.getById = async (id) => {
    let res = await Customer.findById(id);
    return res;
}

exports.create = async (data) => {
    let customer = new Customer(data);
    await customer.save();
}

exports.authenticate = async (data) => {
    let res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

