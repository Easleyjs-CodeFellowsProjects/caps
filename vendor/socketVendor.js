'use strict';

const io = require('socket.io-client');
const { createPickup, respondToDelivery } = require('./handler')

class Vendor {
    constructor(connectString, storeName) {
        this.storeName = storeName,
        this.clientType = 'vendor',
        this.socket = io.connect( connectString )
    }

    connect() {
        this.socket.emit('join', { 
                                   clientType: this.clientType,
                                   storeName: this.storeName
                                 }
        );
    }

    listenForDelivery() {
        this.socket.on('delivered', ( orderDetails ) => respondToDelivery( orderDetails ));
    }

    createPickupEmit(orderDetails) {
        this.socket.emit('pickup', createPickup( orderDetails ));
    }
}

module.exports = Vendor;
