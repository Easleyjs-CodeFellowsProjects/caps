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
        // Check for existing deliveries
        this.socket.on('getAllDeliveredResponse', respondToSocketDelivery( this.socket ));

        this.socket.emit('join', { 
                                   clientType: this.clientType,
                                   storeName: this.storeName
                                 }
        );
        // listen for getAllDelivered. If there are deliveries, thank customers immediately
        this.socket.emit('getAllDelivered', {});
    }

    listenForDelivery() {
        this.socket.on('delivered', ( orderDetails ) => respondToDelivery( orderDetails ));
    }

    createPickupEmit(orderDetails) {
        this.socket.emit('pickup', createPickup( orderDetails ));
    }
}

module.exports = Vendor;
