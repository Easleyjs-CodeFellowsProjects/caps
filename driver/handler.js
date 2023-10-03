'use strict';
const eventPool = require('../eventPool');

function respondToPickup(orderDetails) {
    eventPool.emit('in-transit', orderDetails);
}

function createDelivered(orderDetails) {
    return orderDetails;
}

module.exports = { 
    respondToPickup, 
    createDelivered 
};