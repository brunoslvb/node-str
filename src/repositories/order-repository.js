'use strict';

const mongoose  = require('mongoose');
const Order   = mongoose.model('Order');

exports.get = async () => {
    let res = await Order
        .find({}, 'customer number status items')
        .populate('customer', 'name')
        .populate('items.product', 'title description price');

    return res;
}

exports.create = async (data) => {
    let order = new Order(data);
    await order.save();
}