const eventPool = require('../eventPool');
const { respondToPickup, createDelivered } = require('./handler');

class Driver {
    constructor(driverName) {
        this.driverName = driverName;
    }

    listenForPickup(orderDetails) {
        eventPool.on('pickup', respondToPickup(orderDetails));
    }

    emitDelivered(orderDetails) {
        eventPool.emit('delivered', createDelivered(orderDetails));
    }
}
module.exports = Driver;