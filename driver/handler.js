'use strict';
const socket = require('socket.io');
const { eventEmitter } = require('../eventPool');

function respondToPickup(orderDetails) {
    eventEmitter.emit('in-transit', orderDetails);
}

const respondToSocketPickup = (socket) => (orderDetails) => {
    console.log(orderDetails);
    orderDetails.forEach(( order ) => {
        console.log('Driver Recieved Pickup:', order);
    
        socket.emit('in-transit', order);
    
        socket.emit('delivered', createSocketDelivered( order ));
    });
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