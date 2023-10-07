'use strict';

const io = require('socket.io-client');
const { createPickup, respondToSocketDelivery } = require('./handler')

class Vendor {
    constructor(connectString, storeName) {
        this.storeName = storeName,
        this.clientType = 'vendor',
        this.socket = io.connect( connectString )
    }

    connect() {
        // Listen for existing deliveries on connect
        this.socket.on('getAllDeliveredResponse', ( orders ) => respondToSocketDelivery( orders ));

        this.socket.emit('join', { 
            clientType: this.clientType,
            storeName: this.storeName
        });

        // Emit request for any existing deliveries in queue. If there are deliveries, thank customers immediately
        this.socket.emit('getAllDelivered', { storeName: this.storeName });
    }

    listenForDelivery() {
        this.socket.on('delivered', ( orders ) => respondToSocketDelivery( orders ));
    }

    // orderDetails = { customer, address }
    createPickupEmit(orderDetails) {
        this.socket.emit('pickup', createPickup( this.storeName, orderDetails ));
    }
}

module.exports = Vendor;
