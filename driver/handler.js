'use strict';
const socket = require('socket.io');
const { eventEmitter } = require('../eventPool');

function respondToPickup(orderDetails) {
    eventEmitter.emit('in-transit', orderDetails);
}

const respondToSocketPickup = (socket) => (orderDetails) => {
    console.log('Driver Recieved Pickup:', orderDetails);

    socket.emit('in-transit', orderDetails);

    socket.emit('delivered', createSocketDelivered( orderDetails ));
};

function createDelivered(orderDetails) {
    return orderDetails;
}

function createSocketDelivered (orderDetails) {
    return orderDetails;
}


module.exports = { 
    respondToPickup, 
    createDelivered,
    respondToSocketPickup,
    createSocketDelivered,
};