const { eventEmitter } = require('../eventPool');
const { createPickup, respondToDelivery } = require('./handler');

class Vendor {
    constructor(storeName) {
        this.storeName = storeName;
    }

    listenForDelivery(orderDetails) {
        eventEmitter.on('delivered', (orderDetails) => { respondToDelivery(orderDetails) });
    }

    emitPickup(orderDetails) {
        eventEmitter.emit('pickup', createPickup(this.storeName, orderDetails));
    }
}
module.exports = Vendor;