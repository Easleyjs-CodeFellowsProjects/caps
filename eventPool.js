'use strict';

const events = require('events');

// a singleton
const eventEmitter = new events.EventEmitter();

function logger(event, orderDetails) {
    const output = {
        event,
        time: new Date(),
        payload: orderDetails
    }
    console.log('EVENT',output);
}

function listenForPickup() {
    eventEmitter.on('pickup', ( orderDetails ) => { logger('pickup', orderDetails) })
}

function listenForInTransit() {
    eventEmitter.on('in-transit', ( orderDetails ) => { logger('in-transit', orderDetails) })
}
function listenForDelivery() {
    eventEmitter.on('delivered', ( orderDetails ) => { logger('delivered', orderDetails) })
}

module.exports = { 
    eventEmitter,
    listenForPickup,
    listenForInTransit,
    listenForDelivery,
};