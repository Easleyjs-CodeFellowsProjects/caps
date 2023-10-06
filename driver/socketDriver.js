'use strict';

const io = require('socket.io-client');
const { 
        respondToSocketPickup,
      } = require('./handler')

class Driver {
    constructor( connectString ) {
        this.clientType = 'driver',
        this.socket = io.connect( connectString )
    }

    connect() {
        this.socket.emit('join', { 
                                   clientType: this.clientType,
                                 }
        );
    }

    // List for pickup, emit "in-transit" and "delivered" events
    listenForPickup() {
        this.socket.on('pickup', respondToSocketPickup( this.socket ))
    }

}

module.exports = Driver;
