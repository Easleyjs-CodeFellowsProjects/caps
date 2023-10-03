const eventPool = require('../eventPool');
const { createPickup, respondToDelivery } = require('./handler');

class Vendor {
    constructor(storeName) {
        this.storeName = storeName;
    }

    listenForDelivery(orderDetails) {
        eventPool.on('delivered', respondToDelivery(orderDetails));
    }

    emitPickup(orderDetails) {
        eventPool.emit('pickup', createPickup(this.storeName, orderDetails));
    }
}
module.exports = Vendor;