'use strict';
const { eventEmitter } = require('../eventPool');

function respondToPickup(orderDetails) {
    eventEmitter.emit('in-transit', orderDetails);
}

function createDelivered(orderDetails) {
    return orderDetails;
}

module.exports = { 
    respondToPickup, 
    createDelivered 
};