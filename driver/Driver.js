const { eventEmitter } = require('../eventPool');
const { respondToPickup, createDelivered } = require('./handler');

class Driver {
    constructor(driverName) {
        this.driverName = driverName;
    }

    listenForPickup(orderDetails) {
        eventEmitter.on('pickup', (orderDetails) => { respondToPickup(orderDetails) });
    }

    emitDelivered(orderDetails) {
        eventEmitter.emit('delivered', createDelivered(orderDetails));
    }
}
module.exports = Driver;